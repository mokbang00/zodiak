import type { Period } from '@/app/types/content';
export const jakartaDate = (date: Date) => new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
export function validDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0,10) === value; }
export const shiftDate = (value: string, days: number) => { const date = new Date(`${value}T12:00:00Z`); date.setUTCDate(date.getUTCDate()+days); return date.toISOString().slice(0,10); };
export function periodBounds(reference: string, period: Period) {
  const date = new Date(`${reference}T12:00:00Z`), year = date.getUTCFullYear(), month = date.getUTCMonth();
  let start = reference, end = reference;
  if (period==='tomorrow') start=end=shiftDate(reference,1);
  if (period==='week') { start=shiftDate(reference,-((date.getUTCDay()+6)%7)); end=shiftDate(start,6); }
  if (period==='month') { start=`${year}-${String(month+1).padStart(2,'0')}-01`; end=new Date(Date.UTC(year,month+1,0,12)).toISOString().slice(0,10); }
  if (period==='year') { start=`${year}-01-01`; end=`${year}-12-31`; }
  return {start,end};
}
export const formatDate = (value: string, weekday=false) => new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',day:'numeric',month:'long',year:'numeric',...(weekday?{weekday:'long' as const}:{})}).format(new Date(value.length===10 ? `${value}T12:00:00Z` : value));
export const formatUpdate = (value: string) => `${formatDate(value)}, ${new Intl.DateTimeFormat('id-ID',{timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(new Date(value)).replace('.',':')} WIB`;
export function periodLabel(reference: string, period: Period) {
  const {start,end}=periodBounds(reference,period);
  if (period==='today'||period==='tomorrow') return formatDate(start,true);
  if (period==='week') return `${formatDate(start)} – ${formatDate(end)}`;
  if (period==='month') return new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric',timeZone:'Asia/Jakarta'}).format(new Date(`${start}T12:00:00Z`));
  return start.slice(0,4);
}
export function headingSuffix(reference: string, period: Period) {
  return {today:'Hari Ini',tomorrow:`Besok, ${periodLabel(reference,period)}`,week:`Minggu Ini, ${periodLabel(reference,period)}`,month:`Bulan Ini, ${periodLabel(reference,period)}`,year:`Tahun ${periodLabel(reference,period)}`}[period];
}
