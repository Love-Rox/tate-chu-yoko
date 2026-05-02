# tate-chu-yoko

**English** | [日本語](README.ja.md)

Automatic **tate-chu-yoko (縦中横)** wrapping for Japanese vertical writing. The library wraps half-width alphanumerics in `<span>` tags so that CSS `text-combine-upright: all` can compose them uprightly within vertical text.

- **`@love-rox/tcy-core`** — framework-agnostic tokenizer
- **`@love-rox/tcy-react`** — React `<Tcy>` component
- **`@love-rox/tcy-vue`** — Vue 3 `<Tcy>` component
- **`@love-rox/tcy-rehype`** — rehype plugin for `unified` HAST pipelines

## Why

To typeset half-width letters and digits cleanly in vertical Japanese text, each run has to be wrapped in `<span class="tcy">…</span>` by hand. Doing this in source manuscripts is error-prone and hostile to CMS / Markdown workflows. This library automates that preprocessing — authors write plain text and the wrapping happens at render time.

## Install

```bash
# React
pnpm add @love-rox/tcy-react

# Vue
pnpm add @love-rox/tcy-vue

# rehype (Markdown / HAST pipelines)
pnpm add @love-rox/tcy-rehype

# Core only (for writing your own wrapper)
pnpm add @love-rox/tcy-core
```

## CSS

What actually composes the tate-chu-yoko is the CSS you attach to the generated span. The recommended baseline is:

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

## Usage

### React

```tsx
import { Tcy } from '@love-rox/tcy-react';

export function Chapter() {
  return (
    <p style={{ writingMode: 'vertical-rl' }}>
      <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
    </p>
  );
}
```

Rendered DOM:

```text
第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月、Webの縦書きは進化した。
```

### Vue 3

```vue
<script setup lang="ts">
import { Tcy } from '@love-rox/tcy-vue';
</script>

<template>
  <p style="writing-mode: vertical-rl">
    <Tcy class-name="tcy">第1章 2026年4月、Webの縦書きは進化した。</Tcy>
  </p>
</template>
```

### rehype (unified pipeline)

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

Text inside `<code>`, `<pre>`, `<script>`, and `<style>` is skipped by default (configurable via `skipTags`). Plugin-only options are `tagName`, `className`, and `skipTags`; the rest of the [Options](#options) below apply identically.

### Core (string tokenizer)

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

## Options

Shared by the React / Vue `<Tcy>` components and `tokenize()`:

| Option         | Type                                                        | Default          | Description                                                                                                  |
| -------------- | ----------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `target`       | `'alphanumeric' \| 'alpha' \| 'digit' \| 'ascii' \| RegExp` | `'alphanumeric'` | What to wrap. `alphanumeric` matches `[0-9A-Za-z]`; `ascii` matches the full printable ASCII including marks |
| `combine`      | `boolean`                                                   | `true`           | Merge consecutive target characters into one span. Set `false` to wrap each character individually           |
| `include`      | `string \| string[]`                                        | `undefined`      | Extra characters to treat as targets regardless of `target`                                                  |
| `exclude`      | `string \| string[]`                                        | `undefined`      | Characters to exclude. Takes precedence over `include`                                                       |
| `maxLength`    | `number`                                                    | `undefined`      | Maximum length for a tcy segment. Segments longer than this are left as plain text                           |
| `excludeWords` | `string[]`                                                  | `undefined`      | Exact words to exclude from tcy wrapping even when they match `target`                                       |

Component-only props (React / Vue):

| Prop        | Type     | Default  | Description                                                       |
| ----------- | -------- | -------- | ----------------------------------------------------------------- |
| `className` | `string` | `'tcy'`  | Class applied to each generated span                              |
| `as`        | `string` | `'span'` | Tag name used for wrapping (React: `keyof JSX.IntrinsicElements`) |

Plugin-only options (rehype):

| Option      | Type                 | Default                              | Description                                     |
| ----------- | -------------------- | ------------------------------------ | ----------------------------------------------- |
| `tagName`   | `string`             | `'span'`                             | Tag name used for wrapping                      |
| `className` | `string \| string[]` | `'tcy'`                              | Class name(s) applied to each generated element |
| `skipTags`  | `string[]`           | `['code', 'pre', 'script', 'style']` | Tag names whose subtrees are left untouched     |

## Examples

```tsx
// Digits only; leave letters alone
<Tcy target="digit">ABC 123</Tcy>
// → ABC <span class="tcy">123</span>

// Also treat "." as a target character
<Tcy include=".">Ver.2</Tcy>
// → <span class="tcy">Ver.2</span>

// Wrap one character at a time (useful for per-glyph rotation)
<Tcy combine={false}>ABC</Tcy>
// → <span class="tcy">A</span><span class="tcy">B</span><span class="tcy">C</span>

// Limit wrapping to segments of 2 characters or fewer
<Tcy maxLength={2}>第1章 2026年4月</Tcy>
// → 第<span class="tcy">1</span>章 2026年<span class="tcy">4</span>月

// Exclude specific words from wrapping
<Tcy excludeWords={['2026']}>第1章 2026年4月</Tcy>
// → 第<span class="tcy">1</span>章 2026年<span class="tcy">4</span>月

// Nested elements are traversed transparently
<Tcy>
  前書き<strong>ABC123</strong>後書き
</Tcy>
// → 前書き<strong><span class="tcy">ABC123</span></strong>後書き
```

## Behavior notes

- Runs are not joined across element boundaries (`<em>12</em>34` produces two separate spans)
- Full-width alphanumerics (`Ａ－Ｚ` / `０－９`) are not wrapped by default — they already render upright in vertical text
- SSR-safe (both React and Vue wrappers produce deterministic output)

## Development

```bash
pnpm install
pnpm build       # Build all packages with tsc
pnpm test        # Run Vitest across every workspace
pnpm typecheck   # Type-check
pnpm lint        # oxlint
pnpm format      # oxfmt
```

Lint and format are handled by [Oxc](https://oxc.rs) (oxlint + oxfmt).

## License

MIT
