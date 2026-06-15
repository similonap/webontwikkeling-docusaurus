import React, { useEffect, useMemo, useState } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Editor from '@monaco-editor/react';
import CodeBlock from '@theme/CodeBlock';
import { runCode } from './tsRunner';
import type { RunOutcome } from './tsRunner';
import type {
  QuizData,
  QuizQuestion,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  TextQuestion,
  CodeQuestion,
  FillQuestion,
  ErrorFindQuestion,
} from './types';
import styles from './styles.module.css';

// ---------------------------------------------------------------------------
// Quiz — drops a self-contained quiz below an MDX page. Questions come from a
// JSON file referenced by the `url` prop. See types.ts for the JSON schema and
// static/quizzes/example.json for a worked example.
//
//   import Quiz from '@site/src/components/Quiz';
//   <Quiz url="/quizzes/arrays.json" />
// ---------------------------------------------------------------------------

interface QuizProps {
  url: string;
}

type Status = 'unanswered' | 'correct' | 'incorrect';

// Parse one line into text/code nodes. Handles code spans delimited by a run
// of N backticks (CommonMark-style), so `code`, ``with `backticks` inside`` and
// other multi-backtick spans all render correctly.
function parseInline(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let buffer = '';
  let i = 0;
  let key = 0;

  const flush = () => {
    if (buffer) {
      nodes.push(<React.Fragment key={key++}>{buffer}</React.Fragment>);
      buffer = '';
    }
  };

  while (i < line.length) {
    if (line[i] !== '`') {
      buffer += line[i++];
      continue;
    }
    // Measure the opening run of backticks.
    let open = i;
    while (line[open] === '`') open++;
    const runLen = open - i;

    // Find a closing run of exactly the same length.
    let close = -1;
    let scan = open;
    while (scan < line.length) {
      if (line[scan] === '`') {
        let end = scan;
        while (line[end] === '`') end++;
        if (end - scan === runLen) {
          close = scan;
          break;
        }
        scan = end;
      } else {
        scan++;
      }
    }

    if (close === -1) {
      // No matching closing run — treat the backticks as literal text.
      buffer += line.slice(i, open);
      i = open;
      continue;
    }

    let content = line.slice(open, close);
    // CommonMark: a single leading & trailing space is stripped (lets you write
    // a code span that itself starts/ends with a backtick).
    if (content.length >= 2 && content.startsWith(' ') && content.endsWith(' ') && content.trim() !== '') {
      content = content.slice(1, -1);
    }
    flush();
    nodes.push(<code key={key++}>{content}</code>);
    i = close + runLen;
  }
  flush();
  return nodes;
}

// Tiny inline renderer: turns `code` into <code> and keeps line breaks.
function InlineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {parseInline(line)}
          {li < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}

type Segment =
  | { type: 'text'; content: string }
  | { type: 'code'; lang: string; content: string };

// Split text into inline-text segments and fenced code blocks (```lang … ```).
function splitSegments(text: string): Segment[] {
  const segments: Segment[] = [];
  const lines = text.split('\n');
  let textBuf: string[] = [];

  const flushText = () => {
    if (textBuf.length) {
      segments.push({ type: 'text', content: textBuf.join('\n') });
      textBuf = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const fence = /^\s*```(\w*)\s*$/.exec(lines[i]);
    if (fence) {
      flushText();
      const lang = fence[1] || '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // sla de sluit-fence over
      segments.push({ type: 'code', lang, content: codeLines.join('\n') });
    } else {
      textBuf.push(lines[i]);
      i++;
    }
  }
  flushText();
  return segments;
}

// Renders inline `code`, line breaks AND fenced code blocks. Inline-only text
// keeps rendering as before (valid inside <span>/<p>); fenced blocks use
// Docusaurus' own <CodeBlock> so highlighting matches the rest of the site.
function RichText({ text }: { text: string }) {
  const segments = useMemo(() => splitSegments(text), [text]);

  if (!segments.some((s) => s.type === 'code')) {
    return <InlineText text={text} />;
  }

  return (
    <>
      {segments.map((seg, si) =>
        seg.type === 'code' ? (
          <CodeBlock key={si} language={seg.lang || undefined}>
            {seg.content}
          </CodeBlock>
        ) : seg.content.trim() === '' ? null : (
          <InlineText key={si} text={seg.content} />
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Per-question-type renderers
// ---------------------------------------------------------------------------

interface QuestionRenderProps<Q extends QuizQuestion> {
  question: Q;
  status: Status;
  onStatus: (status: Status) => void;
  sharedLibs?: string;
}

function SingleChoice({ question, status, onStatus }: QuestionRenderProps<SingleChoiceQuestion>) {
  const [selected, setSelected] = useState<number | null>(null);
  const locked = status !== 'unanswered';

  return (
    <div>
      <ul className={styles.options}>
        {question.options.map((opt, i) => {
          const chosen = selected === i;
          const showCorrect = locked && i === question.answer;
          const showWrong = locked && chosen && i !== question.answer;
          return (
            <li key={i}>
              <label
                className={[
                  styles.option,
                  chosen ? styles.optionChosen : '',
                  showCorrect ? styles.optionCorrect : '',
                  showWrong ? styles.optionWrong : '',
                ].filter(Boolean).join(' ')}
              >
                <input
                  type="radio"
                  name={`q-${question.id ?? question.prompt}`}
                  checked={chosen}
                  disabled={locked}
                  onChange={() => setSelected(i)}
                />
                <span className={styles.optionText}>
                  <RichText text={opt} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <CheckBar
        disabled={selected === null}
        status={status}
        onCheck={() => onStatus(selected === question.answer ? 'correct' : 'incorrect')}
      />
    </div>
  );
}

function MultipleChoice({ question, status, onStatus }: QuestionRenderProps<MultipleChoiceQuestion>) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const locked = status !== 'unanswered';
  const correctSet = useMemo(() => new Set(question.answers), [question.answers]);

  const toggle = (i: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const check = () => {
    const ok =
      selected.size === correctSet.size && [...selected].every((i) => correctSet.has(i));
    onStatus(ok ? 'correct' : 'incorrect');
  };

  return (
    <div>
      <ul className={styles.options}>
        {question.options.map((opt, i) => {
          const chosen = selected.has(i);
          const showCorrect = locked && correctSet.has(i);
          const showWrong = locked && chosen && !correctSet.has(i);
          return (
            <li key={i}>
              <label
                className={[
                  styles.option,
                  chosen ? styles.optionChosen : '',
                  showCorrect ? styles.optionCorrect : '',
                  showWrong ? styles.optionWrong : '',
                ].filter(Boolean).join(' ')}
              >
                <input
                  type="checkbox"
                  checked={chosen}
                  disabled={locked}
                  onChange={() => toggle(i)}
                />
                <span className={styles.optionText}>
                  <RichText text={opt} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <CheckBar disabled={selected.size === 0} status={status} onCheck={check} />
    </div>
  );
}

function FreeText({ question, status, onStatus }: QuestionRenderProps<TextQuestion>) {
  const [value, setValue] = useState('');
  const locked = status !== 'unanswered';

  const check = () => {
    const candidate = question.caseSensitive ? value.trim() : value.trim().toLowerCase();
    const ok = question.accept.some((raw) => {
      if (question.regex) {
        return new RegExp(raw, question.caseSensitive ? '' : 'i').test(value.trim());
      }
      const expected = question.caseSensitive ? raw.trim() : raw.trim().toLowerCase();
      return candidate === expected;
    });
    onStatus(ok ? 'correct' : 'incorrect');
  };

  return (
    <div>
      <input
        type="text"
        className={styles.textInput}
        value={value}
        disabled={locked}
        placeholder={question.placeholder ?? 'Typ je antwoord…'}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !locked && value.trim()) check();
        }}
      />
      {status === 'incorrect' && question.accept.length > 0 && !question.regex && (
        <p className={styles.hint}>
          Verwacht antwoord: <code>{question.accept[0]}</code>
        </p>
      )}
      <CheckBar disabled={!value.trim()} status={status} onCheck={check} />
    </div>
  );
}

// Shared editor + run/report block used by both `code` and `fill` questions.
function CodeReport({ outcome }: { outcome: RunOutcome }) {
  return (
    <div className={styles.report}>
      {outcome.typeErrors.length > 0 && (
        <div className={styles.typeErrors}>
          <strong>TypeScript fouten:</strong>
          <ul>
            {outcome.typeErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      {outcome.runtimeError && (
        <div className={styles.typeErrors}>
          <strong>Fout bij uitvoeren:</strong> {outcome.runtimeError}
        </div>
      )}
      <ul className={styles.testList}>
        {outcome.results.map((r, i) => (
          <li key={i} className={r.passed ? styles.testPass : styles.testFail}>
            <span className={styles.testIcon}>{r.passed ? '✓' : '✗'}</span>
            <code>{r.description ?? r.expression}</code>
            {!r.passed && (
              <span className={styles.testDetail}>
                {r.error
                  ? ` — fout: ${r.error}`
                  : ` — verwacht ${JSON.stringify(r.expected)}, kreeg ${JSON.stringify(r.actual)}`}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeAnswer({ question, status, onStatus, sharedLibs }: QuestionRenderProps<CodeQuestion>) {
  const { colorMode } = useColorMode();
  const language = question.language ?? 'typescript';
  const [code, setCode] = useState(question.starterCode ?? '');
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);

  const libs = [sharedLibs, question.libs].filter(Boolean).join('\n');

  const run = async () => {
    setRunning(true);
    try {
      const result = await runCode({ code, language, libs: libs || undefined, tests: question.tests });
      setOutcome(result);
      onStatus(result.correct ? 'correct' : 'incorrect');
    } catch (e: any) {
      setOutcome({
        typeErrors: [],
        results: [],
        runtimeError: String((e && e.message) || e),
        correct: false,
      });
      onStatus('incorrect');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <div className={styles.editor}>
        <Editor
          height="200px"
          language={language}
          theme={colorMode === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={(v) => setCode(v ?? '')}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            automaticLayout: true,
            padding: { top: 10, bottom: 10 },
            readOnly: running,
          }}
        />
      </div>
      {outcome && <CodeReport outcome={outcome} />}
      <CheckBar
        disabled={running || !code.trim()}
        status={status}
        running={running}
        label="Uitvoeren"
        allowRetry
        onCheck={run}
      />
    </div>
  );
}

function FillAnswer({ question, status, onStatus, sharedLibs }: QuestionRenderProps<FillQuestion>) {
  const language = question.language ?? 'typescript';
  const parts = useMemo(() => question.template.split(/(\{\{\d+\}\})/g), [question.template]);
  const blankCount = useMemo(
    () => (question.template.match(/\{\{\d+\}\}/g) ?? []).length,
    [question.template],
  );
  const [values, setValues] = useState<Record<number, string>>({});
  const [outcome, setOutcome] = useState<RunOutcome | null>(null);
  const [running, setRunning] = useState(false);

  const libs = [sharedLibs, question.libs].filter(Boolean).join('\n');
  const allFilled = Object.keys(values).length >= blankCount &&
    Array.from({ length: blankCount }, (_, i) => values[i]?.trim()).every(Boolean);

  const assemble = () =>
    question.template.replace(/\{\{(\d+)\}\}/g, (_, n) => values[Number(n)] ?? '');

  const run = async () => {
    setRunning(true);
    try {
      const result = await runCode({
        code: assemble(),
        language,
        libs: libs || undefined,
        tests: question.tests,
      });
      setOutcome(result);
      onStatus(result.correct ? 'correct' : 'incorrect');
    } catch (e: any) {
      setOutcome({
        typeErrors: [],
        results: [],
        runtimeError: String((e && e.message) || e),
        correct: false,
      });
      onStatus('incorrect');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <pre className={styles.fillSnippet}>
        <code>
          {parts.map((part, i) => {
            const match = part.match(/^\{\{(\d+)\}\}$/);
            if (!match) return <React.Fragment key={i}>{part}</React.Fragment>;
            const n = Number(match[1]);
            const meta = question.blanks?.[n];
            const placeholder = meta?.placeholder ?? '___';
            // Grow to fit the longest of: configured width, placeholder, current
            // value — plus a little breathing room so text is never clipped.
            const width = Math.max(
              meta?.width ?? 0,
              placeholder.length,
              (values[n] ?? '').length,
            ) + 2;
            return (
              <input
                key={i}
                type="text"
                className={styles.fillInput}
                style={{ width: `${width}ch` }}
                placeholder={placeholder}
                value={values[n] ?? ''}
                disabled={running}
                onChange={(e) => setValues((prev) => ({ ...prev, [n]: e.target.value }))}
              />
            );
          })}
        </code>
      </pre>
      {outcome && <CodeReport outcome={outcome} />}
      <CheckBar
        disabled={running || !allFilled}
        status={status}
        running={running}
        label="Uitvoeren"
        allowRetry
        onCheck={run}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error finder
// ---------------------------------------------------------------------------

interface CodeToken {
  text: string;
  /** Clickable tokens are the candidates; whitespace is not clickable. */
  clickable: boolean;
  /** True for tokens that were wrapped in [[ ]] — the parts that are wrong. */
  isError: boolean;
}

// Split the snippet into tokens. Parts wrapped in [[ ]] become a single
// clickable error token; the rest is split into words / single symbols so each
// is a separate clickable distractor. Whitespace is preserved but not clickable.
function tokenizeErrorCode(code: string): CodeToken[] {
  const tokens: CodeToken[] = [];

  const pushPlain = (text: string) => {
    const re = /\s+|[A-Za-z0-9_$]+|[^\s]/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const t = m[0];
      const isSpace = /^\s+$/.test(t);
      tokens.push({ text: t, clickable: !isSpace, isError: false });
    }
  };

  const marker = /\[\[([\s\S]*?)\]\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = marker.exec(code))) {
    if (m.index > last) pushPlain(code.slice(last, m.index));
    tokens.push({ text: m[1], clickable: true, isError: true });
    last = m.index + m[0].length;
  }
  if (last < code.length) pushPlain(code.slice(last));
  return tokens;
}

function ErrorFind({ question, status, onStatus }: QuestionRenderProps<ErrorFindQuestion>) {
  const tokens = useMemo(() => tokenizeErrorCode(question.code), [question.code]);
  const errorIndices = useMemo(
    () => tokens.map((t, i) => (t.isError ? i : -1)).filter((i) => i >= 0),
    [tokens],
  );
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const locked = status !== 'unanswered';

  const toggle = (i: number) => {
    if (locked) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const check = () => {
    const ok =
      selected.size === errorIndices.length && errorIndices.every((i) => selected.has(i));
    onStatus(ok ? 'correct' : 'incorrect');
  };

  const tokenClass = (token: CodeToken, i: number) => {
    if (!token.clickable) return undefined;
    const isSelected = selected.has(i);
    if (!locked) return isSelected ? `${styles.token} ${styles.tokenSelected}` : styles.token;
    // After checking: reveal what was right / wrong / missed.
    if (token.isError && isSelected) return `${styles.token} ${styles.tokenFound}`;
    if (token.isError && !isSelected) return `${styles.token} ${styles.tokenMissed}`;
    if (!token.isError && isSelected) return `${styles.token} ${styles.tokenFalse}`;
    return styles.token;
  };

  return (
    <div>
      <p className={styles.hint}>
        Klik op de delen van de code die fout zijn ({errorIndices.length}{' '}
        {errorIndices.length === 1 ? 'fout' : 'fouten'}).
      </p>
      <pre className={styles.errorSnippet}>
        <code>
          {tokens.map((token, i) =>
            token.clickable ? (
              <span
                key={i}
                className={tokenClass(token, i)}
                onClick={() => toggle(i)}
                role="button"
                tabIndex={locked ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle(i);
                  }
                }}
              >
                {token.text}
              </span>
            ) : (
              <React.Fragment key={i}>{token.text}</React.Fragment>
            ),
          )}
        </code>
      </pre>
      <CheckBar disabled={selected.size === 0} status={status} onCheck={check} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

function CheckBar({
  disabled,
  status,
  onCheck,
  running,
  label = 'Controleer',
  allowRetry = false,
}: {
  disabled: boolean;
  status: Status;
  onCheck: () => void;
  running?: boolean;
  label?: string;
  allowRetry?: boolean;
}) {
  const answered = status !== 'unanswered';
  // Choice/text questions lock after answering; code questions may be re-run.
  if (answered && !allowRetry) {
    return (
      <div className={styles.checkBar}>
        <span className={status === 'correct' ? styles.verdictCorrect : styles.verdictWrong}>
          {status === 'correct' ? '✓ Juist' : '✗ Onjuist'}
        </span>
      </div>
    );
  }
  return (
    <div className={styles.checkBar}>
      <button
        type="button"
        className={styles.checkButton}
        disabled={disabled}
        onClick={onCheck}
      >
        {running ? '⏳ Bezig…' : label}
      </button>
      {answered && (
        <span className={status === 'correct' ? styles.verdictCorrect : styles.verdictWrong}>
          {status === 'correct' ? '✓ Juist' : '✗ Onjuist'}
        </span>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  index,
  status,
  onStatus,
  sharedLibs,
}: {
  question: QuizQuestion;
  index: number;
  status: Status;
  onStatus: (status: Status) => void;
  sharedLibs?: string;
}) {
  let body: React.ReactNode;
  switch (question.type) {
    case 'single':
      body = <SingleChoice question={question} status={status} onStatus={onStatus} />;
      break;
    case 'multiple':
      body = <MultipleChoice question={question} status={status} onStatus={onStatus} />;
      break;
    case 'text':
      body = <FreeText question={question} status={status} onStatus={onStatus} />;
      break;
    case 'code':
      body = <CodeAnswer question={question} status={status} onStatus={onStatus} sharedLibs={sharedLibs} />;
      break;
    case 'fill':
      body = <FillAnswer question={question} status={status} onStatus={onStatus} sharedLibs={sharedLibs} />;
      break;
    case 'errors':
      body = <ErrorFind question={question} status={status} onStatus={onStatus} />;
      break;
    default:
      body = <em>Onbekend vraagtype</em>;
  }

  return (
    <li
      className={[
        styles.card,
        status === 'correct' ? styles.cardCorrect : '',
        status === 'incorrect' ? styles.cardIncorrect : '',
      ].filter(Boolean).join(' ')}
    >
      <div className={styles.prompt}>
        <span className={styles.number}>{index + 1}</span>
        <div className={styles.promptText}>
          <RichText text={question.prompt} />
        </div>
      </div>
      {body}
      {status !== 'unanswered' && question.explanation && (
        <div className={styles.explanation}>
          <RichText text={question.explanation} />
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Quiz({ url }: QuizProps) {
  const resolvedUrl = useBaseUrl(url);
  const [data, setData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);

  useEffect(() => {
    let cancelled = false;
    // Root-relative paths go through useBaseUrl; absolute URLs are left as-is.
    const target = /^https?:\/\//.test(url) ? url : resolvedUrl;
    setData(null);
    setError(null);
    fetch(target)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: QuizData) => {
        if (cancelled) return;
        setData(json);
        setStatuses(json.questions.map(() => 'unanswered'));
      })
      .catch((e) => {
        if (!cancelled) setError(String(e.message || e));
      });
    return () => {
      cancelled = true;
    };
  }, [url, resolvedUrl]);

  const answered = statuses.filter((s) => s !== 'unanswered').length;
  const correct = statuses.filter((s) => s === 'correct').length;

  if (error) {
    return (
      <div className={styles.quiz}>
        <p className={styles.error}>Quiz kon niet geladen worden ({error}).</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className={styles.quiz}>
        <p className={styles.loading}>Quiz laden…</p>
      </div>
    );
  }

  return (
    <div className={styles.quiz}>
      <div className={styles.header}>
        <div>
          {data.title && <h3 className={styles.title}>{data.title}</h3>}
          {data.description && (
            <div className={styles.description}>
              <RichText text={data.description} />
            </div>
          )}
        </div>
        <div className={styles.score} aria-live="polite">
          {correct} / {data.questions.length} juist
          {answered < data.questions.length && (
            <span className={styles.scoreSub}>{answered} beantwoord</span>
          )}
        </div>
      </div>

      <ol className={styles.list}>
        {data.questions.map((question, i) => (
          <QuestionCard
            key={question.id ?? i}
            question={question}
            index={i}
            status={statuses[i] ?? 'unanswered'}
            sharedLibs={data.libs}
            onStatus={(status) =>
              setStatuses((prev) => {
                const next = [...prev];
                next[i] = status;
                return next;
              })
            }
          />
        ))}
      </ol>
    </div>
  );
}
