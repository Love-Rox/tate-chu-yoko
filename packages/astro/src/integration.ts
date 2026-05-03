import type { AstroIntegration } from 'astro';
import rehypeTcy, { type RehypeTcyOptions } from '@love-rox/tcy-rehype';

/** Options for the {@link tcy} Astro integration. Extends {@link RehypeTcyOptions}. */
export interface TcyIntegrationOptions extends RehypeTcyOptions {
  /**
   * When `true`, register `rehype-tcy` on the Markdown pipeline.
   * @defaultValue `true`
   */
  markdown?: boolean;
}

/**
 * Astro integration that registers `rehype-tcy` on the Markdown (and MDX,
 * which inherits Markdown's rehype config) pipeline so half-width alphanumeric
 * runs are wrapped in `<span class="tcy">` for vertical typesetting.
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import tcy from '@love-rox/tcy-astro';
 *
 * export default defineConfig({
 *   integrations: [tcy()],
 * });
 * ```
 */
export function tcy(options: TcyIntegrationOptions = {}): AstroIntegration {
  const { markdown = true, ...rehypeOptions } = options;

  return {
    name: '@love-rox/tcy-astro',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        if (!markdown) return;
        updateConfig({
          markdown: {
            rehypePlugins: [[rehypeTcy, rehypeOptions]],
          },
        });
      },
    },
  };
}

export default tcy;
