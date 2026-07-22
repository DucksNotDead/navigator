import { describe, expect, it } from 'vitest';
import {
  isNotFutureDate,
  li,
  link,
  normalize,
  normalizedDate,
  snake,
  tags,
  text,
} from './utils.ts';

describe('normalizedDate', () => {
  it('keeps already normalized DD.MM.YYYY dates', () => {
    expect(normalizedDate('15.03.2025')).toBe('15.03.2025');
  });

  it('parses Russian month names', () => {
    expect(normalizedDate('5 марта 2024')).toBe('05.03.2024');
  });

  it('falls back for invalid input', () => {
    expect(normalizedDate('not-a-date')).toBe('01.01.2025');
  });
});

describe('format helpers', () => {
  it('builds snake ids and telegram tags', () => {
    expect(snake('РНФ', 'Конкурс 1')).toBe('РНФ_Конкурс_1');
    expect(tags('Гранты', 'РНФ')).toBe('#Гранты #РНФ');
  });

  it('formats list items and links', () => {
    expect(li('Срок', '01.01.2025')).toBe('<b>Срок:</b>\n– 01.01.2025');
    expect(link('Сайт', 'https://example.com')).toBe(
      '<a href="https://example.com">Сайт</a>',
    );
  });

  it('normalizes whitespace and nbsp', () => {
    expect(normalize('  a\t\n&nbsp;b  ')).toBe('a\n b');
  });
});

describe('text truncation', () => {
  it('keeps short content as-is', () => {
    expect(text(10, ['hello', ' world'])).toBe('hello world');
  });

  it('cuts oversized first block', () => {
    const long = 'x'.repeat(900);
    const result = text(0, [long]);
    expect(result.endsWith('...\n')).toBe(true);
    expect(result.length).toBeLessThan(long.length);
  });
});

describe('isNotFutureDate', () => {
  it('accepts past and today, rejects future', () => {
    expect(isNotFutureDate('01.01.2020')).toBe(true);
    expect(isNotFutureDate('01.01.2099')).toBe(false);
  });
});
