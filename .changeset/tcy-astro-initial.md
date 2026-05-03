---
'@love-rox/tcy-core': minor
'@love-rox/tcy-react': minor
'@love-rox/tcy-vue': minor
'@love-rox/tcy-rehype': minor
'@love-rox/tcy-astro': minor
---

Add `@love-rox/tcy-astro`: an Astro integration plus a `<Tcy>` Astro component.

- `tcy()` integration registers `rehype-tcy` on Astro's Markdown / MDX pipeline so half-width alphanumerics are wrapped automatically in `.md` and `.mdx` content.
- `<Tcy>` Astro component (imported from `@love-rox/tcy-astro/Tcy.astro`) wraps a slot inside `.astro` files for explicit usage.

Both accept the same options as `@love-rox/tcy-rehype`. The package joins the existing fixed-version line, so all five publishable packages bump together.
