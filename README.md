# tt-chu-yk

日本語縦書きの **縦中横（たてちゅうよこ）** を自動化するライブラリ群。半角英数字を自動的に `<span>` で囲み、CSS の `text-combine-upright: all` と組み合わせて縦書き組版を整えます。

- **`@tt-chu-yk/core`** — フレームワーク非依存のトークナイザ
- **`@tt-chu-yk/react`** — React 用 `<Tcy>` コンポーネント
- **`@tt-chu-yk/vue`** — Vue 3 用 `<Tcy>` コンポーネント

## なぜ必要か

縦書き HTML で半角英数字をきれいに組むには、該当箇所を逐一 `<span class="tcy">…</span>` で囲む必要があります。原稿に手を入れる運用は事故の温床になりがちで、CMS や Markdown ワークフローとも相性が悪いものです。本ライブラリはプレーンテキストを渡すだけでこの前処理を自動化します。

## インストール

```bash
# React
pnpm add @tt-chu-yk/react

# Vue
pnpm add @tt-chu-yk/vue

# コアのみ（独自ラッパーを書く場合）
pnpm add @tt-chu-yk/core
```

## CSS

縦中横として実際に組版されるのは `.tcy` に当てる CSS 次第です。README では以下を推奨します。

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

## 使い方

### React

```tsx
import { Tcy } from '@tt-chu-yk/react';

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
import { Tcy } from '@tt-chu-yk/vue';
</script>

<template>
  <p style="writing-mode: vertical-rl">
    <Tcy class-name="tcy">第1章 2026年4月、Webの縦書きは進化した。</Tcy>
  </p>
</template>
```

### Core（文字列トークナイズ）

```ts
import { tokenize } from '@tt-chu-yk/core';

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

| オプション | 型                                                          | 既定値           | 内容                                                                                  |
| ---------- | ----------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------- |
| `target`   | `'alphanumeric' \| 'alpha' \| 'digit' \| 'ascii' \| RegExp` | `'alphanumeric'` | span で囲む対象。`alphanumeric` は `[0-9A-Za-z]`、`ascii` は記号込みの ASCII 可視文字 |
| `combine`  | `boolean`                                                   | `true`           | 連続する対象文字を 1 つの span にまとめる。`false` で 1 文字ずつ個別ラップ            |
| `include`  | `string \| string[]`                                        | `undefined`      | `target` に追加で含める文字。例: `'.'`                                                |
| `exclude`  | `string \| string[]`                                        | `undefined`      | `target` から除外する文字。`include` より優先                                         |

React / Vue コンポーネント固有:

| プロパティ  | 型       | 既定値   | 内容                                                         |
| ----------- | -------- | -------- | ------------------------------------------------------------ |
| `className` | `string` | `'tcy'`  | 生成する span に付くクラス名                                 |
| `as`        | `string` | `'span'` | ラップ要素のタグ名（React は `keyof JSX.IntrinsicElements`） |

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
