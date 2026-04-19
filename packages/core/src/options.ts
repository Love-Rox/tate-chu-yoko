export type TargetPreset = 'alphanumeric' | 'alpha' | 'digit' | 'ascii';

export interface TcyOptions {
  target?: TargetPreset | RegExp;
  combine?: boolean;
  include?: string | string[];
  exclude?: string | string[];
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
