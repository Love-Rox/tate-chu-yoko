# @love-rox/tcy-react

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
