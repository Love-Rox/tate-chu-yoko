# @love-rox/tcy-core

## 0.3.0

### Minor Changes

- 666b438: Add `@love-rox/tcy-astro`: an Astro integration plus a `<Tcy>` Astro component.

  - `tcy()` integration registers `rehype-tcy` on Astro's Markdown / MDX pipeline so half-width alphanumerics are wrapped automatically in `.md` and `.mdx` content.
  - `<Tcy>` Astro component (imported from `@love-rox/tcy-astro/Tcy.astro`) wraps a slot inside `.astro` files for explicit usage.

  Both accept the same options as `@love-rox/tcy-rehype`. The package joins the existing fixed-version line, so all five publishable packages bump together.

## 0.2.2

### Patch Changes

- c30eeb9: Sync all packages to the same version. Going forward, the four
  publishable packages (`@love-rox/tcy-core`, `@love-rox/tcy-react`,
  `@love-rox/tcy-vue`, `@love-rox/tcy-rehype`) are kept on a single fixed
  version line via changesets `fixed` configuration.

## 0.2.0

### Minor Changes

- Add `maxLength` and `excludeWords` options for segment-level filtering

## 0.1.2

### Patch Changes

- e1a0b82: Add per-package README so the npm package pages show usage docs instead of the "No README" fallback.

## 0.1.1

### Patch Changes

- 69e239e: Declare `sideEffects: false` so bundlers can tree-shake unused exports.

## 0.1.0

### Minor Changes

- 70bd02d: Initial public release.

  - `@love-rox/tcy-core`: framework-agnostic `tokenize()` for Japanese tate-chu-yoko span wrapping
  - `@love-rox/tcy-react`: `<Tcy>` component for React
  - `@love-rox/tcy-vue`: `<Tcy>` component for Vue 3
