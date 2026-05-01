/** Preset name for built-in character-class patterns. */
export type TargetPreset = 'alphanumeric' | 'alpha' | 'digit' | 'ascii';

/** Options shared by {@link tokenize} and the React / Vue `<Tcy>` components. */
export interface TcyOptions {
  /**
   * Which characters to treat as tcy targets.
   * A preset name selects a built-in pattern; a `RegExp` is tested per character.
   * @defaultValue `'alphanumeric'`
   */
  target?: TargetPreset | RegExp;
  /**
   * When `true`, consecutive target characters are merged into a single tcy segment.
   * Set to `false` to wrap each character individually.
   * @defaultValue `true`
   */
  combine?: boolean;
  /**
   * Extra characters to treat as targets regardless of {@link target}.
   * Each character in the string (or each string in the array) is added individually.
   */
  include?: string | string[];
  /**
   * Characters to exclude from targeting. Takes precedence over {@link include}.
   * Each character in the string (or each string in the array) is removed individually.
   */
  exclude?: string | string[];
  /**
   * Maximum length for a tcy segment.
   * Segments whose length exceeds this value are demoted to plain text.
   * @example
   * ```ts
   * tokenize('第1章 2026年4月', { maxLength: 2 })
   * // "2026" (4 chars) becomes text; "1" and "4" remain tcy
   * ```
   */
  maxLength?: number;
  /**
   * Exact words to exclude from tcy wrapping.
   * Matched against the combined segment value (exact match, not substring).
   * @example
   * ```ts
   * tokenize('第1章 2026年4月', { excludeWords: ['2026'] })
   * // "2026" becomes text; "1" and "4" remain tcy
   * ```
   */
  excludeWords?: string[];
}

const PRESET_PATTERNS: Record<TargetPreset, RegExp> = {
  alphanumeric: /[0-9A-Za-z]/,
  alpha: /[A-Za-z]/,
  digit: /[0-9]/,
  ascii: /[\x21-\x7e]/,
};

function toCharSet(input: string | string[] | undefined): Set<string> {
  if (!input) return new Set();
  const joined = Array.isArray(input) ? input.join('') : input;
  return new Set(Array.from(joined));
}

/**
 * Build a per-character predicate from the given options.
 * The returned function returns `true` when a character should be treated as a tcy target.
 *
 * Priority: {@link TcyOptions.exclude} \> {@link TcyOptions.include} \> {@link TcyOptions.target}.
 */
export function buildMatcher(options: TcyOptions = {}): (ch: string) => boolean {
  const { target = 'alphanumeric', include, exclude } = options;
  const pattern = target instanceof RegExp ? target : PRESET_PATTERNS[target];
  const includeSet = toCharSet(include);
  const excludeSet = toCharSet(exclude);

  return (ch: string) => {
    if (excludeSet.has(ch)) return false;
    if (includeSet.has(ch)) return true;
    return pattern.test(ch);
  };
}
