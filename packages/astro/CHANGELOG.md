# @love-rox/tcy-astro

## 0.3.0

### Minor Changes

- 666b438: Add `@love-rox/tcy-astro`: an Astro integration plus a `<Tcy>` Astro component.

  - `tcy()` integration registers `rehype-tcy` on Astro's Markdown / MDX pipeline so half-width alphanumerics are wrapped automatically in `.md` and `.mdx` content.
  - `<Tcy>` Astro component (imported from `@love-rox/tcy-astro/Tcy.astro`) wraps a slot inside `.astro` files for explicit usage.

  Both accept the same options as `@love-rox/tcy-rehype`. The package joins the existing fixed-version line, so all five publishable packages bump together.

### Patch Changes

- Updated dependencies [666b438]
  - @love-rox/tcy-core@0.3.0
  - @love-rox/tcy-rehype@0.3.0
