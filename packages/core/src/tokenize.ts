import { buildMatcher, type TcyOptions } from './options.js';

/** A single chunk produced by {@link tokenize}. */
export type Segment = { type: 'text'; value: string } | { type: 'tcy'; value: string };

/**
 * Split a string into an array of {@link Segment}s.
 *
 * Characters matching the target pattern become `tcy` segments; everything else
 * becomes `text` segments. When {@link TcyOptions.maxLength} or
 * {@link TcyOptions.excludeWords} is set, qualifying tcy segments are demoted
 * back to text and adjacent text segments are merged.
 */
export function tokenize(input: string, options: TcyOptions = {}): Segment[] {
  if (!input) return [];

  const isTarget = buildMatcher(options);
  const combine = options.combine ?? true;

  const segments: Segment[] = [];
  let buffer = '';
  let bufferKind: 'text' | 'tcy' | null = null;

  const flush = () => {
    if (bufferKind && buffer) {
      segments.push({ type: bufferKind, value: buffer });
    }
    buffer = '';
    bufferKind = null;
  };

  for (const ch of input) {
    const kind: 'text' | 'tcy' = isTarget(ch) ? 'tcy' : 'text';

    if (kind === 'tcy' && !combine) {
      flush();
      segments.push({ type: 'tcy', value: ch });
      continue;
    }

    if (bufferKind !== kind) {
      flush();
      bufferKind = kind;
    }
    buffer += ch;
  }
  flush();

  return applySegmentFilter(segments, options);
}

function applySegmentFilter(segments: Segment[], options: TcyOptions): Segment[] {
  const { maxLength, excludeWords } = options;
  if (maxLength == null && (!excludeWords || excludeWords.length === 0)) return segments;

  const excludeSet = excludeWords && excludeWords.length > 0 ? new Set(excludeWords) : null;

  const shouldDemote = (seg: Segment): boolean => {
    if (seg.type !== 'tcy') return false;
    if (maxLength != null && seg.value.length > maxLength) return true;
    if (excludeSet && excludeSet.has(seg.value)) return true;
    return false;
  };

  const result: Segment[] = [];
  for (const seg of segments) {
    const demoted: Segment = shouldDemote(seg) ? { type: 'text', value: seg.value } : seg;
    const last = result[result.length - 1];
    if (last && last.type === 'text' && demoted.type === 'text') {
      last.value += demoted.value;
    } else {
      result.push(demoted);
    }
  }
  return result;
}
