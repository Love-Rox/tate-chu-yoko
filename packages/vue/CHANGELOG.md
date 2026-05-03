# @love-rox/tcy-vue

## 0.3.1

### Patch Changes

- 4691598: Republish to fix broken `workspace:*` dependency specifiers in `@love-rox/tcy-astro@0.3.0`.

  The 0.3.0 release of `@love-rox/tcy-astro` was published manually via `npm publish` after the OIDC trusted-publishing flow returned 404 for the brand-new package on npmjs.com. Because `npm publish` (unlike `pnpm publish`) does not rewrite pnpm's `workspace:*` protocol, the published manifest left dependency specifiers as `workspace:*`, causing `npm install @love-rox/tcy-astro` to fail with `EUNSUPPORTEDPROTOCOL`.

  This release republishes the affected package family through the standard `pnpm publish` flow (changesets/action), restoring proper version-pinned dependencies.

  Refs: #25

- Updated dependencies [4691598]
  - @love-rox/tcy-core@0.3.1

## 0.3.0

### Minor Changes

- 666b438: Add `@love-rox/tcy-astro`: an Astro integration plus a `<Tcy>` Astro component.

  - `tcy()` integration registers `rehype-tcy` on Astro's Markdown / MDX pipeline so half-width alphanumerics are wrapped automatically in `.md` and `.mdx` content.
  - `<Tcy>` Astro component (imported from `@love-rox/tcy-astro/Tcy.astro`) wraps a slot inside `.astro` files for explicit usage.

  Both accept the same options as `@love-rox/tcy-rehype`. The package joins the existing fixed-version line, so all five publishable packages bump together.

### Patch Changes

- Updated dependencies [666b438]
  - @love-rox/tcy-core@0.3.0

## 0.2.2

### Patch Changes

- c30eeb9: Sync all packages to the same version. Going forward, the four
  publishable packages (`@love-rox/tcy-core`, `@love-rox/tcy-react`,
  `@love-rox/tcy-vue`, `@love-rox/tcy-rehype`) are kept on a single fixed
  version line via changesets `fixed` configuration.
- Updated dependencies [c30eeb9]
  - @love-rox/tcy-core@0.2.2

## 0.2.0

### Minor Changes

- Add `maxLength` and `excludeWords` options for segment-level filtering

### Patch Changes

- Updated dependencies
  - @love-rox/tcy-core@0.2.0

## 0.1.2

### Patch Changes

- e1a0b82: Add per-package README so the npm package pages show usage docs instead of the "No README" fallback.
- Updated dependencies [e1a0b82]
  - @love-rox/tcy-core@0.1.2

## 0.1.1

### Patch Changes

- 69e239e: Declare `sideEffects: false` so bundlers can tree-shake unused exports.
- Updated dependencies [69e239e]
  - @love-rox/tcy-core@0.1.1

## 0.1.0

### Minor Changes

- 70bd02d: Initial public release.

  - `@love-rox/tcy-core`: framework-agnostic `tokenize()` for Japanese tate-chu-yoko span wrapping
  - `@love-rox/tcy-react`: `<Tcy>` component for React
  - `@love-rox/tcy-vue`: `<Tcy>` component for Vue 3

### Patch Changes

- Updated dependencies [70bd02d]
  - @love-rox/tcy-core@0.1.0
