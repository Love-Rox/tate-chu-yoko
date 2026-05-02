import type { Plugin } from 'unified';
import type { Element, ElementContent, Parent, Root, RootContent, Text } from 'hast';
import { SKIP, visit } from 'unist-util-visit';
import { tokenize, type TcyOptions } from '@love-rox/tcy-core';

/**
 * Options for the {@link rehypeTcy} plugin. Extends {@link TcyOptions} from
 * `@love-rox/tcy-core` with HAST-rendering-specific knobs.
 */
export interface RehypeTcyOptions extends TcyOptions {
  /**
   * Tag name used to wrap each tcy segment.
   * @defaultValue `'span'`
   */
  tagName?: string;
  /**
   * Class name(s) applied to the wrapping element.
   * A string is treated as a single class; an array is applied as-is.
   * @defaultValue `'tcy'`
   */
  className?: string | string[];
  /**
   * Tag names whose subtrees are skipped (their text nodes are left untouched).
   * @defaultValue `['code', 'pre', 'script', 'style']`
   */
  skipTags?: string[];
}

const DEFAULT_SKIP_TAGS = ['code', 'pre', 'script', 'style'];

/**
 * rehype plugin that wraps tate-chu-yoko (縦中横) targets in HAST text nodes
 * with a configurable element (default `<span class="tcy">`).
 *
 * Built on top of `@love-rox/tcy-core`'s `tokenize`. Text inside `<code>`,
 * `<pre>`, `<script>`, and `<style>` is skipped by default; runs are not
 * joined across element boundaries.
 */
const rehypeTcy: Plugin<[RehypeTcyOptions?], Root, Root> = (options = {}) => {
  const {
    tagName = 'span',
    className = 'tcy',
    skipTags = DEFAULT_SKIP_TAGS,
    ...tcyOptions
  } = options;
  const classList = Array.isArray(className) ? [...className] : [className];
  const skipSet = new Set(skipTags);

  return (tree) => {
    visit(tree, 'text', (node: Text, index, parent: Parent | undefined) => {
      if (parent == null || index == null) return;
      if (parent.type === 'element' && skipSet.has((parent as Element).tagName)) {
        return SKIP;
      }

      const segments = tokenize(node.value, tcyOptions);
      if (segments.every((s) => s.type === 'text')) return;

      const replacement: ElementContent[] = segments.map((seg) =>
        seg.type === 'text'
          ? ({ type: 'text', value: seg.value } satisfies Text)
          : ({
              type: 'element',
              tagName,
              properties: { className: [...classList] },
              children: [{ type: 'text', value: seg.value }],
            } satisfies Element),
      );

      (parent.children as RootContent[]).splice(index, 1, ...(replacement as RootContent[]));
      return [SKIP, index + replacement.length];
    });
  };
};

export default rehypeTcy;
