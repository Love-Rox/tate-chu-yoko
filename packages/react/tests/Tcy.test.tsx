import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Tcy } from '../src/Tcy.js';

describe('<Tcy>', () => {
  it('wraps alphanumerics in span with default class "tcy"', () => {
    const { container } = render(<Tcy>第1章 2026年4月</Tcy>);
    expect(container.innerHTML).toBe(
      '第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月',
    );
  });

  it('respects custom className', () => {
    const { container } = render(<Tcy className="my-tcy">2026</Tcy>);
    expect(container.innerHTML).toBe('<span class="my-tcy">2026</span>');
  });

  it('uses custom tag via `as` prop', () => {
    const { container } = render(
      <Tcy as="b" className="x">
        AB
      </Tcy>,
    );
    expect(container.innerHTML).toBe('<b class="x">AB</b>');
  });

  it('recurses into nested elements', () => {
    const { container } = render(
      <Tcy>
        前書き<strong>ABC123</strong>後書き
      </Tcy>,
    );
    expect(container.innerHTML).toBe(
      '前書き<strong><span class="tcy">ABC123</span></strong>後書き',
    );
  });

  it('does not bridge text across element boundaries', () => {
    const { container } = render(
      <Tcy>
        <em>12</em>34
      </Tcy>,
    );
    expect(container.innerHTML).toBe(
      '<em><span class="tcy">12</span></em><span class="tcy">34</span>',
    );
  });

  it('supports combine:false for per-character wrapping', () => {
    const { container } = render(<Tcy combine={false}>ABC</Tcy>);
    expect(container.innerHTML).toBe(
      '<span class="tcy">A</span><span class="tcy">B</span><span class="tcy">C</span>',
    );
  });

  it('forwards include option', () => {
    const { container } = render(<Tcy include=".">A.B</Tcy>);
    expect(container.innerHTML).toBe('<span class="tcy">A.B</span>');
  });
});
