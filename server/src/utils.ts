/**
 * Converte um nome em slug: sem acentos, minúsculas, não-alfanumérico vira
 * `-`, sem hífens nas pontas. Ex.: "São Paulo" -> "sao-paulo".
 */
export function slug(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Extrai o dia (YYYY-MM-DD) de uma data ISO. */
export function dayOf(iso: string): string {
  return iso.slice(0, 10);
}
