# Contributing

tt-chu-yk への貢献を歓迎します。このドキュメントでは開発の進め方をまとめています。

## 開発環境

- Node.js 18 以降
- pnpm 10.x
- Oxc（`oxlint` / `oxfmt`）を lint/format に使用

```bash
pnpm install
```

## よく使うコマンド

```bash
pnpm build        # 全パッケージを tsc でビルド
pnpm test         # Vitest を全ワークスペースで実行
pnpm typecheck    # 型チェック
pnpm lint         # oxlint
pnpm lint:fix     # oxlint --fix
pnpm format       # oxfmt で整形
pnpm format:check # 整形差分を検出
```

## パッケージ構成

| パッケージ         | 役割                                               |
| ------------------ | -------------------------------------------------- |
| `@tt-chu-yk/core`  | フレームワーク非依存のトークナイザ（`tokenize()`） |
| `@tt-chu-yk/react` | React 用 `<Tcy>` コンポーネント                    |
| `@tt-chu-yk/vue`   | Vue 3 用 `<Tcy>` コンポーネント                    |

新しいフレームワーク向けのラッパーを追加する場合は、`@tt-chu-yk/core` の `tokenize()` を呼び出してフレームワーク固有の子要素走査を書く、という構成に揃えてください。

## Pull Request

1. 変更の目的が分かるブランチ名を付ける（例: `feat/svelte-wrapper`, `fix/combine-false-edge-case`）
2. テストを追加／更新する
3. `pnpm test`・`pnpm lint`・`pnpm format:check`・`pnpm typecheck` をローカルで通す
4. PR 説明に変更点と動作確認内容を書く

## コミットメッセージ

Conventional Commits 風（`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`）を推奨しますが必須ではありません。

## バグ報告 / 機能提案

[Issue](https://github.com/Love-Rox/tate-chu-yoko/issues) からテンプレートに沿って報告してください。

## 行動規範

本プロジェクトは [Code of Conduct](CODE_OF_CONDUCT.md) を採用しています。参加する全員に遵守をお願いします。
