import { describe, expect, it } from 'vitest';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import rehypeTcy, { type RehypeTcyOptions } from '../src/rehype-tcy.js';

const run = async (html: string, opts?: RehypeTcyOptions): Promise<string> =>
  String(
    await unified()
      .use(rehypeParse, { fragment: true })
      .use(rehypeTcy, opts)
      .use(rehypeStringify)
      .process(html),
  );

describe('rehypeTcy', () => {
  it('wraps alphanumeric runs in <span class="tcy">', async () => {
    expect(await run('第1章 2026年4月')).toBe(
      '第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月',
    );
  });

  it('skips text inside <code> and <pre>', async () => {
    expect(await run('<p>1</p><code>123</code><pre>456</pre>')).toBe(
      '<p><span class="tcy">1</span></p><code>123</code><pre>456</pre>',
    );
  });

  it('descends into nested elements without bridging boundaries', async () => {
    expect(await run('<p>前<strong>ABC123</strong>後</p>')).toBe(
      '<p>前<strong><span class="tcy">ABC123</span></strong>後</p>',
    );
  });

  it('forwards core options (excludeWords)', async () => {
    expect(await run('2026 1', { excludeWords: ['2026'] })).toBe('2026 <span class="tcy">1</span>');
  });

  it('forwards core options (maxLength)', async () => {
    expect(await run('2026 1', { maxLength: 2 })).toBe('2026 <span class="tcy">1</span>');
  });

  it('honors custom tagName and className', async () => {
    expect(await run('AB', { tagName: 'b', className: ['x', 'y'] })).toBe('<b class="x y">AB</b>');
  });

  it('does not reprocess generated spans (idempotent)', async () => {
    const once = await run('A1B');
    const twice = String(
      await unified()
        .use(rehypeParse, { fragment: true })
        .use(rehypeTcy)
        .use(rehypeTcy)
        .use(rehypeStringify)
        .process('A1B'),
    );
    expect(twice).toBe(once);
  });

  it('respects custom skipTags', async () => {
    expect(await run('<kbd>1</kbd><p>1</p>', { skipTags: ['kbd'] })).toBe(
      '<kbd>1</kbd><p><span class="tcy">1</span></p>',
    );
  });
});
