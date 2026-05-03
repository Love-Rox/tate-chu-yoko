import { describe, expect, it, vi } from 'vitest';
import rehypeTcy from '@love-rox/tcy-rehype';
import { tcy } from '../src/integration.js';

type SetupHook = NonNullable<ReturnType<typeof tcy>['hooks']['astro:config:setup']>;

const callSetup = (
  integration: ReturnType<typeof tcy>,
): { updateConfig: ReturnType<typeof vi.fn> } => {
  const updateConfig = vi.fn();
  const hook = integration.hooks['astro:config:setup'] as SetupHook;
  // Only the fields we use are typed strictly; cast the rest.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  void hook({ updateConfig } as any);
  return { updateConfig };
};

describe('tcy() integration', () => {
  it('has the expected name', () => {
    expect(tcy().name).toBe('@love-rox/tcy-astro');
  });

  it('registers rehype-tcy on markdown.rehypePlugins', () => {
    const { updateConfig } = callSetup(tcy());
    expect(updateConfig).toHaveBeenCalledTimes(1);
    const arg = updateConfig.mock.calls[0]?.[0];
    expect(arg?.markdown?.rehypePlugins?.[0]?.[0]).toBe(rehypeTcy);
  });

  it('forwards rehype options through to the plugin tuple', () => {
    const { updateConfig } = callSetup(tcy({ className: 'cup', excludeWords: ['2026'] }));
    const arg = updateConfig.mock.calls[0]?.[0];
    expect(arg?.markdown?.rehypePlugins?.[0]?.[1]).toEqual({
      className: 'cup',
      excludeWords: ['2026'],
    });
  });

  it('skips updateConfig when markdown is disabled', () => {
    const { updateConfig } = callSetup(tcy({ markdown: false }));
    expect(updateConfig).not.toHaveBeenCalled();
  });

  it('does not leak the markdown flag into rehype options', () => {
    const { updateConfig } = callSetup(tcy({ markdown: true, className: 'cup' }));
    const arg = updateConfig.mock.calls[0]?.[0];
    expect(arg?.markdown?.rehypePlugins?.[0]?.[1]).toEqual({ className: 'cup' });
  });
});
