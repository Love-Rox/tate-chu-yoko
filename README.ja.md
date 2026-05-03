# tate-chu-yoko

[English](README.md) | **日本語**

日本語縦書きの **縦中横（たてちゅうよこ）** を自動化するライブラリ群。半角英数字を自動的に `<span>` で囲み、CSS の `text-combine-upright: all` と組み合わせて縦書き組版を整えます。

- **`@love-rox/tcy-core`** — フレームワーク非依存のトークナイザ
- **`@love-rox/tcy-react`** — React 用 `<Tcy>` コンポーネント
- **`@love-rox/tcy-vue`** — Vue 3 用 `<Tcy>` コンポーネント
- **`@love-rox/tcy-rehype`** — `unified` の HAST パイプライン用 rehype プラグイン
- **`@love-rox/tcy-astro`** — Astro 用 integration および `<Tcy>` コンポーネント

## なぜ必要か

縦書き HTML で半角英数字をきれいに組むには、該当箇所を逐一 `<span class="tcy">…</span>` で囲む必要があります。原稿に手を入れる運用は事故の温床になりがちで、CMS や Markdown ワークフローとも相性が悪いものです。本ライブラリはプレーンテキストを渡すだけでこの前処理を自動化します。

## インストール

```bash
# React
pnpm add @love-rox/tcy-react

# Vue
pnpm add @love-rox/tcy-vue

# rehype（Markdown / HAST パイプライン用）
pnpm add @love-rox/tcy-rehype

# Astro
pnpm add @love-rox/tcy-astro

# コアのみ（独自ラッパーを書く場合）
pnpm add @love-rox/tcy-core
```

## CSS

縦中横として実際に組版されるのは `.tcy` に当てる CSS 次第です。以下を推奨します。

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

## 使い方

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

レンダリング結果（DOM）:

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

### Astro

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tcy from '@love-rox/tcy-astro';

export default defineConfig({
  integrations: [tcy()],
});
```

これだけで `.md` / `.mdx` の本文すべてに `rehype-tcy` が適用されます。`.astro` ファイル内で明示的に囲みたい場合は次のコンポーネントを使います。

```astro
---
import Tcy from '@love-rox/tcy-astro/Tcy.astro';
---

<p style="writing-mode: vertical-rl">
  <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
</p>
```

### rehype（unified パイプライン）

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

`<code>` / `<pre>` / `<script>` / `<style>` の中は既定で対象外（`skipTags` で変更可）。プラグイン固有のオプションは `tagName` / `className` / `skipTags` のみで、その他は[オプション](#オプション)と共通です。

### Core（文字列トークナイズ）

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

## オプション

React / Vue の `<Tcy>` および `tokenize()` 共通:

| オプション     | 型                                                          | 既定値           | 内容                                                                                  |
| -------------- | ----------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| `target`       | `'alphanumeric' \| 'alpha' \| 'digit' \| 'ascii' \| RegExp` | `'alphanumeric'` | span で囲む対象。`alphanumeric` は `[0-9A-Za-z]`、`ascii` は記号込みの ASCII 可視文字 |
| `combine`      | `boolean`                                                   | `true`           | 連続する対象文字を 1 つの span にまとめる。`false` で 1 文字ずつ個別ラップ            |
| `include`      | `string \| string[]`                                        | `undefined`      | `target` に追加で含める文字。例: `'.'`                                                |
| `exclude`      | `string \| string[]`                                        | `undefined`      | `target` から除外する文字。`include` より優先                                         |
| `maxLength`    | `number`                                                    | `undefined`      | tcy セグメントの最大文字数。超過分はラップせずプレーンテキストとして扱う              |
| `excludeWords` | `string[]`                                                  | `undefined`      | `target` に合致しても除外する単語のリスト（完全一致）                                 |

React / Vue コンポーネント固有:

| プロパティ  | 型       | 既定値   | 内容                                                         |
| ----------- | -------- | -------- | ------------------------------------------------------------ |
| `className` | `string` | `'tcy'`  | 生成する span に付くクラス名                                 |
| `as`        | `string` | `'span'` | ラップ要素のタグ名（React は `keyof JSX.IntrinsicElements`） |

rehype プラグイン固有:

| オプション  | 型                   | 既定値                               | 内容                                           |
| ----------- | -------------------- | ------------------------------------ | ---------------------------------------------- |
| `tagName`   | `string`             | `'span'`                             | ラップ要素のタグ名                             |
| `className` | `string \| string[]` | `'tcy'`                              | 生成する要素に付くクラス名                     |
| `skipTags`  | `string[]`           | `['code', 'pre', 'script', 'style']` | サブツリーを処理せずそのまま残すタグ名のリスト |

## 例

```tsx
// 数字のみ縦中横、英字はそのまま
<Tcy target="digit">ABC 123</Tcy>
// → ABC <span class="tcy">123</span>

// 「.」も対象に追加
<Tcy include=".">Ver.2</Tcy>
// → <span class="tcy">Ver.2</span>

// 1 文字ずつ個別 span（個別に回転を当てたい場合など）
<Tcy combine={false}>ABC</Tcy>
// → <span class="tcy">A</span><span class="tcy">B</span><span class="tcy">C</span>

// 2 文字以下のみラップ
<Tcy maxLength={2}>第1章 2026年4月</Tcy>
// → 第<span class="tcy">1</span>章 2026年<span class="tcy">4</span>月

// 特定の単語を除外
<Tcy excludeWords={['2026']}>第1章 2026年4月</Tcy>
// → 第<span class="tcy">1</span>章 2026年<span class="tcy">4</span>月

// ネストした要素も透過
<Tcy>
  前書き<strong>ABC123</strong>後書き
</Tcy>
// → 前書き<strong><span class="tcy">ABC123</span></strong>後書き
```

## 挙動メモ

- 要素境界をまたいだ連結は行いません（`<em>12</em>34` は 2 つの span に分かれます）
- 全角英数字（`Ａ－Ｚ` / `０－９`）は既定で対象外。既に縦書きで正立するためです
- SSR 互換（React / Vue どちらも決定論的な出力）

## 開発

```bash
pnpm install
pnpm build       # 全パッケージを tsc でビルド
pnpm test        # Vitest を全ワークスペースで実行
pnpm typecheck   # 型チェック
pnpm lint        # oxlint
pnpm format      # oxfmt
```

Lint / format には [Oxc](https://oxc.rs)（oxlint + oxfmt）を採用しています。

## ライセンス

MIT
