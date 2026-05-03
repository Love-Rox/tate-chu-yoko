# @love-rox/tcy-core

Framework-agnostic tokenizer for Japanese **tate-chu-yoko (縦中横)** span wrapping.

Returns a `Segment[]` that splits a string into text chunks and target chunks (typically half-width alphanumerics). Framework wrappers build on top of this:

- [`@love-rox/tcy-react`](https://www.npmjs.com/package/@love-rox/tcy-react) — React `<Tcy>` component
- [`@love-rox/tcy-vue`](https://www.npmjs.com/package/@love-rox/tcy-vue) — Vue 3 `<Tcy>` component
- [`@love-rox/tcy-rehype`](https://www.npmjs.com/package/@love-rox/tcy-rehype) — rehype plugin for HAST
- [`@love-rox/tcy-astro`](https://www.npmjs.com/package/@love-rox/tcy-astro) — Astro integration + `<Tcy>` component

## Install

```bash
pnpm add @love-rox/tcy-core
```

## Usage

```ts
import { tokenize } from '@love-rox/tcy-core';

tokenize('第1章 2026年4月');
// [
//   { type: 'text', value: '第' },
//   { type: 'tcy',  value: '1' },
//   { type: 'text', value: '章 ' },
//   { type: 'tcy',  value: '2026' },
//   { type: 'text', value: '年' },
//   { type: 'tcy',  value: '4' },
//   { type: 'text', value: '月' },
// ]
```

## API

```ts
type Segment = { type: 'text'; value: string } | { type: 'tcy'; value: string };

function tokenize(input: string, options?: TcyOptions): Segment[];

interface TcyOptions {
  target?: 'alphanumeric' | 'alpha' | 'digit' | 'ascii' | RegExp; // default: 'alphanumeric'
  combine?: boolean; // default: true
  include?: string | string[];
  exclude?: string | string[];
  maxLength?: number;
  excludeWords?: string[];
}
```

- `target`: preset or custom `RegExp` for the characters to wrap. `alphanumeric` = `[0-9A-Za-z]`; `ascii` = full printable ASCII
- `combine`: if `true`, consecutive target characters become one `tcy` segment; if `false`, each character becomes its own segment
- `include` / `exclude`: per-character overrides. `exclude` wins over `include`
- `maxLength`: maximum length for a tcy segment. Segments longer than this are demoted to plain text
- `excludeWords`: exact words to exclude from tcy wrapping. Matched against the combined segment value

## Links

- Full documentation: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko#readme) ([日本語](https://github.com/Love-Rox/tate-chu-yoko/blob/main/README.ja.md))
- Issues: https://github.com/Love-Rox/tate-chu-yoko/issues

## License

MIT
