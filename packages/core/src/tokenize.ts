import { buildMatcher, type TcyOptions } from './options.js';

export type Segment = { type: 'text'; value: string } | { type: 'tcy'; value: string };

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

  return segments;
}
