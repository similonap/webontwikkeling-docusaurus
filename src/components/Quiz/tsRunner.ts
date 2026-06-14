import { loader } from '@monaco-editor/react';
import type { CodeTest } from './types';

// ---------------------------------------------------------------------------
// tsRunner — validates and grades code answers.
//
// We reuse the TypeScript service that Monaco already ships with (so no extra
// dependency / no megabyte-sized compiler in the main bundle). The flow is:
//
//   1. Put the learner's code in an in-memory Monaco model.
//   2. Ask the TypeScript worker for syntactic + semantic diagnostics
//      → this is the "TypeScript validation": real type errors are reported.
//   3. Ask the same worker to emit JavaScript.
//   4. Run that JS together with the question's test expressions and compare
//      each (awaited) result to its expected value via deep equality.
//
// Everything here runs only in the browser (triggered by a button click), so
// it is safe with Docusaurus server-side rendering.
// ---------------------------------------------------------------------------

export interface TestResult {
  expression: string;
  description?: string;
  expected: unknown;
  actual?: unknown;
  passed: boolean;
  error?: string;
}

export interface RunOutcome {
  /** TypeScript type/syntax errors. Empty means the code type-checks. */
  typeErrors: string[];
  results: TestResult[];
  /** A top-level error that aborted execution (e.g. infinite loop guard, throw). */
  runtimeError?: string;
  /** True when there are no type errors and every test passed. */
  correct: boolean;
}

let monacoPromise: Promise<any> | null = null;

function getMonaco(): Promise<any> {
  if (!monacoPromise) monacoPromise = loader.init();
  return monacoPromise;
}

// Flatten Monaco's DiagnosticMessageChain (or plain string) into one line.
function flattenMessage(message: any): string {
  if (typeof message === 'string') return message;
  let text = message?.messageText ?? '';
  let chain = message?.next?.[0];
  while (chain) {
    text += ` ${chain.messageText ?? ''}`;
    chain = chain.next?.[0];
  }
  return text.trim();
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (typeof a !== 'object') return Object.is(a, b);

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  const ak = Object.keys(a as object);
  const bk = Object.keys(b as object);
  if (ak.length !== bk.length) return false;
  return ak.every(
    (k) => k in (b as object) && deepEqual((a as any)[k], (b as any)[k]),
  );
}

function runTests(js: string, tests: CodeTest[]): Promise<TestResult[]> {
  // Build a single async function body: the learner's emitted JS followed by
  // one guarded evaluation per test. Each expression is awaited so both
  // synchronous and async (Promise-returning) answers work.
  const evaluations = tests
    .map(
      (t, i) => `
      try { __out.push({ i: ${i}, value: await (${t.expression}) }); }
      catch (e) { __out.push({ i: ${i}, error: String((e && e.message) || e) }); }`,
    )
    .join('\n');

  const body = `
    return (async () => {
      const __out = [];
      ${js}
      ${evaluations}
      return __out;
    })();`;

  // eslint-disable-next-line no-new-func
  const fn = new Function(body);

  return Promise.resolve(fn()).then((raw: any[]) =>
    tests.map((t, i) => {
      const entry = raw.find((r) => r.i === i);
      if (!entry || 'error' in entry) {
        return {
          expression: t.expression,
          description: t.description,
          expected: t.expected,
          passed: false,
          error: entry?.error ?? 'geen resultaat',
        };
      }
      return {
        expression: t.expression,
        description: t.description,
        expected: t.expected,
        actual: entry.value,
        passed: deepEqual(entry.value, t.expected),
      };
    }),
  );
}

export interface RunCodeOptions {
  code: string;
  language: 'typescript' | 'javascript';
  /** Extra ambient declarations available while type-checking. */
  libs?: string;
  tests: CodeTest[];
}

export async function runCode(opts: RunCodeOptions): Promise<RunOutcome> {
  const monaco = await getMonaco();
  const tsLang = monaco.languages.typescript;
  const isTs = opts.language !== 'javascript';
  const defaults = isTs ? tsLang.typescriptDefaults : tsLang.javascriptDefaults;

  defaults.setCompilerOptions({
    target: tsLang.ScriptTarget.ESNext,
    module: tsLang.ModuleKind.ESNext,
    allowNonTsExtensions: true,
    noEmit: false,
    strict: false,
    skipLibCheck: true,
  });
  defaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  const libDisposable = opts.libs
    ? defaults.addExtraLib(opts.libs, 'file:///quiz-globals.d.ts')
    : null;

  const ext = isTs ? 'ts' : 'js';
  const uri = monaco.Uri.parse(
    `file:///quiz-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`,
  );
  // Append `export {}` so TypeScript treats the snippet as a *module* with its
  // own scope. Without it, snippets are global scripts: top-level names would
  // collide with DOM globals (e.g. `name`) and with other models on the page
  // ("Cannot redeclare block-scoped variable …"). We strip it again before
  // executing the emitted JS.
  const source = `${opts.code}\nexport {};\n`;
  const model = monaco.editor.createModel(source, isTs ? 'typescript' : 'javascript', uri);

  try {
    const getWorker = isTs
      ? await tsLang.getTypeScriptWorker()
      : await tsLang.getJavaScriptWorker();
    const client = await getWorker(uri);

    const [syntactic, semantic] = await Promise.all([
      client.getSyntacticDiagnostics(uri.toString()),
      isTs
        ? client.getSemanticDiagnostics(uri.toString())
        : Promise.resolve([] as any[]),
    ]);

    const typeErrors = [...syntactic, ...semantic].map((d) =>
      flattenMessage(d.messageText),
    );

    const emit = await client.getEmitOutput(uri.toString());
    // Remove the module markers (our appended `export {}`, plus any `export`
    // emit) so the result is a plain script we can run with `new Function`.
    const js: string = (emit.outputFiles?.[0]?.text ?? '')
      .replace(/^\s*export\s*\{\s*\}\s*;?\s*$/gm, '')
      .replace(/^\s*Object\.defineProperty\(exports[^\n]*$/gm, '');

    let results: TestResult[] = [];
    let runtimeError: string | undefined;
    try {
      results = await runTests(js, opts.tests);
    } catch (e: any) {
      runtimeError = String((e && e.message) || e);
    }

    const correct =
      typeErrors.length === 0 &&
      !runtimeError &&
      results.length > 0 &&
      results.every((r) => r.passed);

    return { typeErrors, results, runtimeError, correct };
  } finally {
    model.dispose();
    libDisposable?.dispose();
  }
}
