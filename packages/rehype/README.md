# @love-rox/tcy-rehype

[rehype](https://github.com/rehypejs/rehype) plugin for Japanese **tate-chu-yoko (縦中横)** auto-wrap.

Walks a HAST tree and wraps half-width alphanumeric runs in `<span class="tcy">` so that CSS `text-combine-upright: all` composes them uprightly within vertical text. Slots cleanly into a `unified` pipeline (e.g. `remark-parse` → `remark-rehype` → `rehype-tcy` → `rehype-stringify`).

Built on top of [`@love-rox/tcy-core`](https://www.npmjs.com/package/@love-rox/tcy-core).

## Install

```bash
pnpm add @love-rox/tcy-rehype
```

Peer dependency: `unified >= 10`.

## CSS

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

## Usage

Pure rehype pipeline:

```ts
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeTcy from '@love-rox/tcy-rehype';

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process('<p>第1章 2026年4月</p>'),
);
// <p>第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月</p>
```

Markdown pipeline (remark → rehype):

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeTcy from '@love-rox/tcy-rehype';

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process('第1章 2026年4月'),
);
```

## Options

| Option         | Type                                                        | Default                              | Description                                                                                  |
| -------------- | ----------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `target`       | `'alphanumeric' \| 'alpha' \| 'digit' \| 'ascii' \| RegExp` | `'alphanumeric'`                     | What to wrap                                                                                 |
| `combine`      | `boolean`                                                   | `true`                               | Merge consecutive target characters into one span. `false` wraps each character individually |
| `include`      | `string \| string[]`                                        | `undefined`                          | Extra characters to treat as targets                                                         |
| `exclude`      | `string \| string[]`                                        | `undefined`                          | Characters to exclude. Takes precedence over `include`                                       |
| `maxLength`    | `number`                                                    | `undefined`                          | Maximum length for a tcy segment. Segments longer than this are left as plain text           |
| `excludeWords` | `string[]`                                                  | `undefined`                          | Exact words to exclude from tcy wrapping                                                     |
| `tagName`      | `string`                                                    | `'span'`                             | Tag name used for wrapping                                                                   |
| `className`    | `string \| string[]`                                        | `'tcy'`                              | Class name(s) applied to the wrapping element                                                |
| `skipTags`     | `string[]`                                                  | `['code', 'pre', 'script', 'style']` | Tag names whose subtrees are left untouched                                                  |

## Behavior

- Text inside `<code>`, `<pre>`, `<script>`, and `<style>` is skipped (configurable via `skipTags`).
- Runs are not joined across element boundaries — `第<em>1</em>2` keeps the `1` and `2` in separate spans.
- The plugin is idempotent: applying it twice produces the same output as applying it once.

## Links

- Full documentation: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko#readme) ([日本語](https://github.com/Love-Rox/tate-chu-yoko/blob/main/README.ja.md))
- Issues: https://github.com/Love-Rox/tate-chu-yoko/issues

## License

MIT
