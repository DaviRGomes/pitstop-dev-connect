import { describe, expect, it } from 'vitest';
import { dayOf, slug } from '../src/utils';

describe('slug', () => {
  it('remove acentos e troca separadores por hífen', () => {
    expect(slug('São Paulo')).toBe('sao-paulo');
  });

  it('mantém nomes simples em minúsculas', () => {
    expect(slug('Singapore')).toBe('singapore');
  });

  it('comprime separadores repetidos e tira hífens das pontas', () => {
    expect(slug('  Yas Marina -- Circuit! ')).toBe('yas-marina-circuit');
    expect(slug('Autódromo José Carlos Pace')).toBe('autodromo-jose-carlos-pace');
  });
});

describe('dayOf', () => {
  it('extrai YYYY-MM-DD de uma data ISO com horário e offset', () => {
    expect(dayOf('2026-07-05T14:00:00+00:00')).toBe('2026-07-05');
  });

  it('aceita datas que já vêm sem horário', () => {
    expect(dayOf('2026-07-05')).toBe('2026-07-05');
  });
});
