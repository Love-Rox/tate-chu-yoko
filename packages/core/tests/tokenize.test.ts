import { describe, it, expect } from 'vitest';
import { tokenize } from '../src/tokenize.js';

describe('tokenize', () => {
  it('wraps consecutive alphanumerics into one tcy segment by default', () => {
    expect(tokenize('第1章 2026年4月')).toEqual([
      { type: 'text', value: '第' },
      { type: 'tcy', value: '1' },
      { type: 'text', value: '章 ' },
      { type: 'tcy', value: '2026' },
      { type: 'text', value: '年' },
      { type: 'tcy', value: '4' },
      { type: 'text', value: '月' },
    ]);
  });

  it('excludes symbols by default (alphanumeric preset)', () => {
    expect(tokenize('AB-CD')).toEqual([
      { type: 'tcy', value: 'AB' },
      { type: 'text', value: '-' },
      { type: 'tcy', value: 'CD' },
    ]);
  });

  it('splits each character when combine is false', () => {
    expect(tokenize('abc-123', { combine: false })).toEqual([
      { type: 'tcy', value: 'a' },
      { type: 'tcy', value: 'b' },
      { type: 'tcy', value: 'c' },
      { type: 'text', value: '-' },
      { type: 'tcy', value: '1' },
      { type: 'tcy', value: '2' },
      { type: 'tcy', value: '3' },
    ]);
  });

  it('respects include option', () => {
    expect(tokenize('A.B', { include: '.' })).toEqual([{ type: 'tcy', value: 'A.B' }]);
  });

  it('respects exclude option', () => {
    expect(tokenize('A1B2', { exclude: '1' })).toEqual([
      { type: 'tcy', value: 'A' },
      { type: 'text', value: '1' },
      { type: 'tcy', value: 'B2' },
    ]);
  });

  it('supports alpha-only preset', () => {
    expect(tokenize('abc123', { target: 'alpha' })).toEqual([
      { type: 'tcy', value: 'abc' },
      { type: 'text', value: '123' },
    ]);
  });

  it('supports digit-only preset', () => {
    expect(tokenize('abc123', { target: 'digit' })).toEqual([
      { type: 'text', value: 'abc' },
      { type: 'tcy', value: '123' },
    ]);
  });

  it('supports ascii preset which includes symbols', () => {
    expect(tokenize('A-B', { target: 'ascii' })).toEqual([{ type: 'tcy', value: 'A-B' }]);
  });

  it('supports custom RegExp as target', () => {
    expect(tokenize('あaいb', { target: /[a-z]/ })).toEqual([
      { type: 'text', value: 'あ' },
      { type: 'tcy', value: 'a' },
      { type: 'text', value: 'い' },
      { type: 'tcy', value: 'b' },
    ]);
  });

  it('handles empty string', () => {
    expect(tokenize('')).toEqual([]);
  });

  it('does not wrap full-width alphanumerics by default', () => {
    expect(tokenize('Ａ１')).toEqual([{ type: 'text', value: 'Ａ１' }]);
  });

  it('exclude overrides include', () => {
    expect(tokenize('A.B', { include: '.', exclude: '.' })).toEqual([
      { type: 'tcy', value: 'A' },
      { type: 'text', value: '.' },
      { type: 'tcy', value: 'B' },
    ]);
  });

  describe('maxLength', () => {
    it('demotes tcy segments exceeding maxLength to text', () => {
      expect(tokenize('第1章 2026年4月', { maxLength: 2 })).toEqual([
        { type: 'text', value: '第' },
        { type: 'tcy', value: '1' },
        { type: 'text', value: '章 2026年' },
        { type: 'tcy', value: '4' },
        { type: 'text', value: '月' },
      ]);
    });

    it('keeps tcy segments exactly at maxLength', () => {
      expect(tokenize('AB-ABC', { maxLength: 2 })).toEqual([
        { type: 'tcy', value: 'AB' },
        { type: 'text', value: '-ABC' },
      ]);
    });

    it('has no effect when all segments are within maxLength', () => {
      expect(tokenize('A1B2', { maxLength: 10 })).toEqual([
        { type: 'tcy', value: 'A1B2' },
      ]);
    });
  });

  describe('excludeWords', () => {
    it('demotes exact-matching tcy segments to text', () => {
      expect(tokenize('第1章 2026年4月', { excludeWords: ['2026'] })).toEqual([
        { type: 'text', value: '第' },
        { type: 'tcy', value: '1' },
        { type: 'text', value: '章 2026年' },
        { type: 'tcy', value: '4' },
        { type: 'text', value: '月' },
      ]);
    });

    it('does not demote partial matches', () => {
      expect(tokenize('ABC', { excludeWords: ['AB'] })).toEqual([
        { type: 'tcy', value: 'ABC' },
      ]);
    });

    it('demotes multiple excluded words', () => {
      expect(tokenize('AB-CD-EF', { excludeWords: ['AB', 'EF'] })).toEqual([
        { type: 'text', value: 'AB-' },
        { type: 'tcy', value: 'CD' },
        { type: 'text', value: '-EF' },
      ]);
    });
  });

  describe('maxLength + excludeWords combined', () => {
    it('demotes by either condition (OR)', () => {
      expect(tokenize('第1章 2026年AB月', { maxLength: 2, excludeWords: ['AB'] })).toEqual([
        { type: 'text', value: '第' },
        { type: 'tcy', value: '1' },
        { type: 'text', value: '章 2026年AB月' },
      ]);
    });

    it('works with character-level exclude option', () => {
      expect(tokenize('A1B2C', { exclude: 'B', maxLength: 1 })).toEqual([
        { type: 'text', value: 'A1B2C' },
      ]);
    });

    it('character-level exclude splits segments before maxLength applies', () => {
      expect(tokenize('A-BC', { exclude: '-', maxLength: 1 })).toEqual([
        { type: 'tcy', value: 'A' },
        { type: 'text', value: '-BC' },
      ]);
    });
  });
});
