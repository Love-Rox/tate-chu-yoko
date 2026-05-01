# @love-rox/tcy-react

React `<Tcy>` component for Japanese **tate-chu-yoko (縦中横)** auto-wrap.

Wrap a subtree and half-width alphanumerics inside it are automatically wrapped in `<span>` tags so that CSS `text-combine-upright: all` composes them uprightly within vertical text.

Built on top of [`@love-rox/tcy-core`](https://www.npmjs.com/package/@love-rox/tcy-core).

## Install

```bash
pnpm add @love-rox/tcy-react
```

Peer dependency: `react >= 17`.

## CSS

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

## Usage

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

## Props

| Prop        | Type                                                        | Default          | Description                                                                                  |
| ----------- | ----------------------------------------------------------- | ---------------- | -------------------------------------------------------------------------------------------- |
| `target`    | `'alphanumeric' \| 'alpha' \| 'digit' \| 'ascii' \| RegExp` | `'alphanumeric'` | What to wrap                                                                                 |
| `combine`   | `boolean`                                                   | `true`           | Merge consecutive target characters into one span. `false` wraps each character individually |
| `include`   | `string \| string[]`                                        | `undefined`      | Extra characters to treat as targets                                                         |
| `exclude`   | `string \| string[]`                                        | `undefined`      | Characters to exclude. Takes precedence over `include`                                       |
| `maxLength`    | `number`                                                    | `undefined`      | Maximum length for a tcy segment. Segments longer than this are left as plain text           |
| `excludeWords` | `string[]`                                                  | `undefined`      | Exact words to exclude from tcy wrapping                                                     |
| `className` | `string`                                                    | `'tcy'`          | Class applied to each generated span                                                         |
| `as`        | `keyof JSX.IntrinsicElements`                               | `'span'`         | Tag name used for wrapping                                                                   |

Nested elements are traversed transparently. Runs are not joined across element boundaries.

## Links

- Full documentation: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko#readme) ([日本語](https://github.com/Love-Rox/tate-chu-yoko/blob/main/README.ja.md))
- Issues: https://github.com/Love-Rox/tate-chu-yoko/issues

## License

MIT
