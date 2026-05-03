import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeTcy, { type RehypeTcyOptions } from '@love-rox/tcy-rehype';

/** Options for {@link transformHtml}. Identical to {@link RehypeTcyOptions}. */
export type TcyAstroOptions = RehypeTcyOptions;

/**
 * Run an HTML fragment through the rehype-tcy pipeline and return the
 * transformed HTML string. Used internally by the `<Tcy>` Astro component to
 * process the rendered slot content.
 */
export async function transformHtml(html: string, options: TcyAstroOptions = {}): Promise<string> {
  const file = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTcy, options)
    .use(rehypeStringify)
    .process(html);
  return String(file);
}
