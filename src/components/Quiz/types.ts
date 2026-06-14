// ---------------------------------------------------------------------------
// Quiz schema — these types describe the shape of the JSON file that a Quiz
// loads from its `url` prop. The JSON is authored by the course maker and can
// be hosted anywhere on the Docusaurus site (e.g. /quizzes/arrays.json under
// the static/ folder) or on any reachable URL.
// ---------------------------------------------------------------------------

export type QuestionType =
  | 'single'
  | 'multiple'
  | 'text'
  | 'code'
  | 'fill'
  | 'errors';

interface BaseQuestion {
  /** Optional stable id (handy for analytics / deep-linking). */
  id?: string;
  /** The question text. Supports `inline code` and line breaks. */
  prompt: string;
  /** Shown after the learner checks their answer. Supports `inline code`. */
  explanation?: string;
}

/** Classic multiple choice — exactly one correct option. */
export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single';
  options: string[];
  /** Index of the correct option in `options`. */
  answer: number;
}

/** Multiple choice where several options can be correct. */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple';
  options: string[];
  /** Indices of every correct option. */
  answers: number[];
}

/** Free-form text answer, checked against a list of accepted answers. */
export interface TextQuestion extends BaseQuestion {
  type: 'text';
  /** Accepted answers. Plain strings by default, regex when `regex` is true. */
  accept: string[];
  /** When true, every `accept` entry is treated as a regular expression. */
  regex?: boolean;
  /** When true, comparison is case sensitive (default false). */
  caseSensitive?: boolean;
  /** Optional placeholder shown in the input. */
  placeholder?: string;
}

/** A single automated test run against the learner's code. */
export interface CodeTest {
  /**
   * A JS/TS expression evaluated after the learner's code. Its (awaited)
   * result is compared with `expected` using deep equality.
   * e.g. "double(21)" or "greet('Sam')".
   */
  expression: string;
  /** The value the expression is expected to produce. */
  expected: unknown;
  /** Optional human-readable label for this test. */
  description?: string;
}

/** Write-the-code question, validated by TypeScript + automated tests. */
export interface CodeQuestion extends BaseQuestion {
  type: 'code';
  /** Editor language. Defaults to 'typescript'. */
  language?: 'typescript' | 'javascript';
  /** Code pre-filled in the editor. */
  starterCode?: string;
  /** Extra ambient declarations (a .d.ts blob) made available to the code. */
  libs?: string;
  /** Automated tests; the answer is correct when all pass and types check. */
  tests: CodeTest[];
}

/** Fill-in-the-blanks within a code snippet, validated like CodeQuestion. */
export interface FillQuestion extends BaseQuestion {
  type: 'fill';
  language?: 'typescript' | 'javascript';
  /**
   * The snippet with numbered placeholders `{{0}}`, `{{1}}`, … Each placeholder
   * becomes an inline input the learner fills in. The full snippet (with the
   * inputs substituted back in) is type-checked and tested.
   */
  template: string;
  /** Optional per-blank hints, indexed by placeholder number. */
  blanks?: { placeholder?: string; width?: number }[];
  libs?: string;
  tests: CodeTest[];
}

/**
 * Find-the-error question. The learner is shown a code snippet and must click
 * every part that is wrong. Wrap each wrong part in `[[ ]]` markers in the
 * `code` string; everything outside the markers becomes a clickable distractor
 * token. The answer is correct when exactly the marked parts are selected.
 *
 *   "code": "let id : number = 1;\nid = [[\"hallo\"]];"
 */
export interface ErrorFindQuestion extends BaseQuestion {
  type: 'errors';
  /** Used only for the editor label / styling hook. */
  language?: 'typescript' | 'javascript';
  /** The snippet, with each wrong part wrapped in `[[ ]]`. */
  code: string;
}

export type QuizQuestion =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | TextQuestion
  | CodeQuestion
  | FillQuestion
  | ErrorFindQuestion;

export interface QuizData {
  title?: string;
  description?: string;
  /** Ambient declarations shared by every code/fill question in this quiz. */
  libs?: string;
  questions: QuizQuestion[];
}
