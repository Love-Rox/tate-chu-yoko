---
"@love-rox/tcy-astro": patch
"@love-rox/tcy-core": patch
"@love-rox/tcy-react": patch
"@love-rox/tcy-rehype": patch
"@love-rox/tcy-vue": patch
---

Republish to fix broken `workspace:*` dependency specifiers in `@love-rox/tcy-astro@0.3.0`.

The 0.3.0 release of `@love-rox/tcy-astro` was published manually via `npm publish` after the OIDC trusted-publishing flow returned 404 for the brand-new package on npmjs.com. Because `npm publish` (unlike `pnpm publish`) does not rewrite pnpm's `workspace:*` protocol, the published manifest left dependency specifiers as `workspace:*`, causing `npm install @love-rox/tcy-astro` to fail with `EUNSUPPORTEDPROTOCOL`.

This release republishes the affected package family through the standard `pnpm publish` flow (changesets/action), restoring proper version-pinned dependencies.

Refs: #25
