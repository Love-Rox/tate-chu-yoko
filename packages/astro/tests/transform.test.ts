import { describe, expect, it } from 'vitest';
import { transformHtml } from '../src/transform.js';

describe('transformHtml', () => {
  it('wraps alphanumeric runs in <span class="tcy">', async () => {
    expect(await transformHtml('第1章 2026年4月')).toBe(
      '第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月',
    );
  });

  it('preserves nested element structure', async () => {
    expect(await transformHtml('<p>前<strong>ABC123</strong>後</p>')).toBe(
      '<p>前<strong><span class="tcy">ABC123</span></strong>後</p>',
    );
  });

  it('skips <code> by default', async () => {
    expect(await transformHtml('<code>123</code>4')).toBe(
      '<code>123</code><span class="tcy">4</span>',
    );
  });

  it('forwards rehype options (className, tagName)', async () => {
    expect(await transformHtml('1', { className: 'cup', tagName: 'i' })).toBe(
      '<i class="cup">1</i>',
    );
  });

  it('forwards core options (excludeWords)', async () => {
    expect(await transformHtml('2026 1', { excludeWords: ['2026'] })).toBe(
      '2026 <span class="tcy">1</span>',
    );
  });

  it('returns input unchanged when no targets are present', async () => {
    expect(await transformHtml('<p>第一章</p>')).toBe('<p>第一章</p>');
  });
});
