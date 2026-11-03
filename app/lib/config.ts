import 'server-only';
import type { PageConfig } from '@/app/types/content';
import { validDate } from '@/lib/calendar';
const reference = process.env.DEMO_REFERENCE_DATE || '2026-10-29';
if (!validDate(reference)) throw new Error('DEMO_REFERENCE_DATE must be a valid YYYY-MM-DD date.');
export const pageConfig: PageConfig = {locale:'id-ID',timezone:'Asia/Jakarta',referenceDate:reference,publisher:'Redaksi Demo Zodiak',baseUrl:process.env.SITE_URL || 'http://localhost:3001'};
