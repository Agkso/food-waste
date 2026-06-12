import { ExpirationStatus } from '@/types';

// Extrai datas em formatos comuns: dd/mm/yyyy, dd-mm-yyyy, dd.mm.yy, yyyy-mm-dd
const DATE_REGEXES: RegExp[] = [
  /\b(\d{2})[\/\-.](\d{2})[\/\-.](\d{4})\b/,
  /\b(\d{2})[\/\-.](\d{2})[\/\-.](\d{2})\b/,
  /\b(\d{4})[\/\-.](\d{2})[\/\-.](\d{2})\b/,
];

export function extractDateFromText(text: string): Date | null {
  for (const re of DATE_REGEXES) {
    const m = text.match(re);
    if (!m) continue;
    let day: number, month: number, year: number;
    if (m[1].length === 4) {
      year = +m[1]; month = +m[2]; day = +m[3];
    } else {
      day = +m[1]; month = +m[2]; year = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    }
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

export function daysUntil(dateIso: string): number {
  const target = new Date(dateIso).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export function getStatus(dateIso: string): ExpirationStatus {
  const d = daysUntil(dateIso);
  if (d < 0) return 'expired';
  if (d <= 3) return 'soon';
  return 'fresh';
}

export function formatDateBR(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}
