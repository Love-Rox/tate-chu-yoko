# Contributing

tate-chu-yoko への貢献を歓迎します。このドキュメントでは開発の進め方をまとめています。

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

| パッケージ            | 役割                                               |
| --------------------- | -------------------------------------------------- |
| `@love-rox/tcy-core`  | フレームワーク非依存のトークナイザ（`tokenize()`） |
| `@love-rox/tcy-react` | React 用 `<Tcy>` コンポーネント                    |
| `@love-rox/tcy-vue`   | Vue 3 用 `<Tcy>` コンポーネント                    |

新しいフレームワーク向けのラッパーを追加する場合は、`@love-rox/tcy-core` の `tokenize()` を呼び出してフレームワーク固有の子要素走査を書く、という構成に揃えてください。

## Pull Request

1. 変更の目的が分かるブランチ名を付ける（例: `feat/svelte-wrapper`, `fix/combine-false-edge-case`）
2. テストを追加／更新する
3. `pnpm test`・`pnpm lint`・`pnpm format:check`・`pnpm typecheck` をローカルで通す
4. ユーザーに影響する変更なら `pnpm changeset` で changeset を追加する（変更種別と概要を記入）
5. PR 説明に変更点と動作確認内容を書く

## リリース

[Changesets](https://github.com/changesets/changesets) でバージョン管理しています。

- PR に changeset を同梱してマージすると、GitHub Actions が "chore(release): version packages" という Release PR を自動で作成／更新します
- Release PR をマージすると、`main` 上で Actions が npm に publish します（npm Trusted Publishing / OIDC 経由、トークン不要）
- publish 対象は changeset の種別（`patch` / `minor` / `major`）に応じて自動でバージョンアップされます

## コミットメッセージ

Conventional Commits 風（`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`）を推奨しますが必須ではありません。

## バグ報告 / 機能提案

[Issue](https://github.com/Love-Rox/tate-chu-yoko/issues) からテンプレートに沿って報告してください。

## 行動規範

本プロジェクトは [Code of Conduct](CODE_OF_CONDUCT.md) を採用しています。参加する全員に遵守をお願いします。
