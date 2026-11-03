import type { Forecast, Period } from '@/app/types/content';
import { periodBounds } from './calendar';
export function forecastState(record: Forecast | undefined, reference: string, period: Period) {
  if (!record || record.status==='draft' || record.status==='unavailable') return 'unavailable' as const;
  if (record.status==='failed') return 'failed' as const;
  const bounds=periodBounds(reference,period);
  if (record.status==='expired' || record.periodStart!==bounds.start || record.periodEnd!==bounds.end) return 'expired' as const;
  return 'published' as const;
}
