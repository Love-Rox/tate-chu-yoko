import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { Tcy } from '../src/Tcy.js';

function render(slot: () => unknown, props: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    setup() {
      return () => h('div', {}, h(Tcy, props, { default: slot }));
    },
  });
  const wrapper = mount(Wrapper);
  return (wrapper.element as HTMLElement).innerHTML;
}

describe('Tcy (Vue)', () => {
  it('wraps alphanumerics in span with default class "tcy"', () => {
    expect(render(() => '第1章 2026年4月')).toBe(
      '第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月',
    );
  });

  it('respects custom className', () => {
    expect(render(() => '2026', { className: 'my-tcy' })).toBe('<span class="my-tcy">2026</span>');
  });

  it('uses custom tag via `as` prop', () => {
    expect(render(() => 'AB', { as: 'b', className: 'x' })).toBe('<b class="x">AB</b>');
  });

  it('recurses into nested elements', () => {
    expect(render(() => ['前書き', h('strong', {}, 'ABC123'), '後書き'])).toBe(
      '前書き<strong><span class="tcy">ABC123</span></strong>後書き',
    );
  });

  it('supports combine:false for per-character wrapping', () => {
    expect(render(() => 'ABC', { combine: false })).toBe(
      '<span class="tcy">A</span><span class="tcy">B</span><span class="tcy">C</span>',
    );
  });

  it('forwards include option', () => {
    expect(render(() => 'A.B', { include: '.' })).toBe('<span class="tcy">A.B</span>');
  });
});
