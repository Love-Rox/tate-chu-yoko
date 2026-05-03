# @love-rox/tcy-rehype

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

## 0.2.1

### Patch Changes

- 0a5c247: Re-publish via the standard changesets/OIDC release flow so the package
  ships with provenance attestations (the initial 0.2.0 was published via
  a one-off bootstrap and lacks attestations). No source changes; ships an
  example `examples/demo.mjs` alongside the package.
