# @love-rox/tcy-astro

[Astro](https://astro.build) integration and `<Tcy>` component for Japanese **tate-chu-yoko (縦中横)** auto-wrap.

Two pieces:

- **`tcy()` integration** — registers [`@love-rox/tcy-rehype`](https://www.npmjs.com/package/@love-rox/tcy-rehype) on Astro's Markdown / MDX pipeline so half-width alphanumerics in your `.md` and `.mdx` content are wrapped automatically.
- **`<Tcy>` component** — wrap a slot inside `.astro` files to apply the same transformation explicitly.

## Install

```bash
pnpm add @love-rox/tcy-astro
```

Peer dependency: `astro >= 4`.

## CSS

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

## Usage

### Integration (auto-applies to Markdown / MDX)

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tcy from '@love-rox/tcy-astro';

export default defineConfig({
  integrations: [tcy()],
});
```

Pass options to forward to `rehype-tcy`:

```ts
integrations: [tcy({ excludeWords: ['2026'], className: 'tcy' })];
```

### `<Tcy>` component (in `.astro` files)

```astro
---
import Tcy from '@love-rox/tcy-astro/Tcy.astro';
---

<p style="writing-mode: vertical-rl">
  <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
</p>
```

Rendered HTML:

```text
第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月、Webの縦書きは進化した。
```

## Options

The integration and the component both accept the [`@love-rox/tcy-rehype` options](https://www.npmjs.com/package/@love-rox/tcy-rehype):

| Option         | Type                                                        | Default                              | Description                                                                        |
| -------------- | ----------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| `target`       | `'alphanumeric' \| 'alpha' \| 'digit' \| 'ascii' \| RegExp` | `'alphanumeric'`                     | What to wrap                                                                       |
| `combine`      | `boolean`                                                   | `true`                               | Merge consecutive target characters into one span                                  |
| `include`      | `string \| string[]`                                        | `undefined`                          | Extra characters to treat as targets                                               |
| `exclude`      | `string \| string[]`                                        | `undefined`                          | Characters to exclude. Takes precedence over `include`                             |
| `maxLength`    | `number`                                                    | `undefined`                          | Maximum length for a tcy segment. Segments longer than this are left as plain text |
| `excludeWords` | `string[]`                                                  | `undefined`                          | Exact words to exclude from tcy wrapping                                           |
| `tagName`      | `string`                                                    | `'span'`                             | Tag name used for wrapping                                                         |
| `className`    | `string \| string[]`                                        | `'tcy'`                              | Class name(s) applied to the wrapping element                                      |
| `skipTags`     | `string[]`                                                  | `['code', 'pre', 'script', 'style']` | Tag names whose subtrees are left untouched                                        |

Integration-only:

| Option     | Type      | Default | Description                                                              |
| ---------- | --------- | ------- | ------------------------------------------------------------------------ |
| `markdown` | `boolean` | `true`  | Register `rehype-tcy` on the Markdown pipeline (also covers MDX content) |

## Behavior

- Text inside `<code>`, `<pre>`, `<script>`, and `<style>` is skipped (configurable via `skipTags`).
- Runs are not joined across element boundaries.
- Both pieces run at build time (Astro is SSG-first); no client-side cost.

## Links

- Full documentation: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko#readme) ([日本語](https://github.com/Love-Rox/tate-chu-yoko/blob/main/README.ja.md))
- Issues: https://github.com/Love-Rox/tate-chu-yoko/issues

## License

MIT
