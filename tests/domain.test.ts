import {describe,it,expect} from 'vitest';
import {zodiacs,findZodiac,DATE_ERROR,EMPTY_ERROR,zodiacUrl,periods} from '@/lib/zodiac';
import {periodBounds,jakartaDate,shiftDate,validDate,headingSuffix} from '@/lib/calendar';
import {forecastState} from '@/lib/content-state';
import {forecasts,getForecast,getArticles} from '@/app/lib/fixtures';
describe('editorial sign mapping',()=>{
 for(const z of zodiacs)for(const boundary of [z.dateRangeStart,z.dateRangeEnd])it(`${z.slug} ${boundary}`,()=>{const [m,d]=boundary.split('-');expect(findZodiac(d,m).zodiac?.slug).toBe(z.slug);});
 it('accepts leap day without a year',()=>expect(findZodiac('29','2').zodiac?.slug).toBe('pisces'));
 it.each([['30','2'],['31','4'],['0','1'],['32','1'],['1.5','4'],['-1','2'],['abc','1'],['1','13']])('rejects %s/%s',(d,m)=>expect(findZodiac(d,m).error).toBe(DATE_ERROR));
 it('requires both fields',()=>{expect(findZodiac('','1').error).toBe(EMPTY_ERROR);expect(findZodiac('3','').error).toBe(EMPTY_ERROR);});
 it('crosses the year at Capricorn',()=>{expect(findZodiac('31','12').zodiac?.slug).toBe('capricorn');expect(findZodiac('1','1').zodiac?.slug).toBe('capricorn');});
 it('covers every valid calendar day exactly once',()=>{for(let m=1;m<=12;m++)for(let d=1;d<=new Date(Date.UTC(2024,m,0)).getUTCDate();d++)expect(findZodiac(String(d),String(m)).zodiac).toBeDefined();});
 it('builds exactly 60 unique destinations',()=>expect(new Set(zodiacs.flatMap(z=>periods.map(p=>zodiacUrl(z.slug,p.key)))).size).toBe(60));
});
describe('period calendar',()=>{
 it('uses Jakarta midnight',()=>{expect(jakartaDate(new Date('2026-10-28T16:59:59Z'))).toBe('2026-10-28');expect(jakartaDate(new Date('2026-10-28T17:00:00Z'))).toBe('2026-10-29');});
 it('handles tomorrow at year end',()=>expect(periodBounds('2026-12-31','tomorrow')).toEqual({start:'2027-01-01',end:'2027-01-01'}));
 it('uses Monday–Sunday across years',()=>expect(periodBounds('2027-01-01','week')).toEqual({start:'2026-12-28',end:'2027-01-03'}));
 it('crosses months',()=>expect(periodBounds('2026-11-01','week')).toEqual({start:'2026-10-26',end:'2026-11-01'}));
 it('handles February in leap years',()=>expect(periodBounds('2024-02-29','month').end).toBe('2024-02-29'));
 it('handles a non-leap February',()=>expect(periodBounds('2026-02-01','month').end).toBe('2026-02-28'));
 it('sets annual bounds',()=>expect(periodBounds('2026-10-29','year')).toEqual({start:'2026-01-01',end:'2026-12-31'}));
 it('validates demo dates',()=>{expect(validDate('2026-02-30')).toBe(false);expect(validDate('2024-02-29')).toBe(true);expect(validDate('hello')).toBe(false);});
 it('formats tomorrow from its actual date',()=>expect(headingSuffix('2026-12-31','tomorrow')).toContain('1 Januari 2027'));
 it('shifts calendar days safely',()=>expect(shiftDate('2026-03-01',-1)).toBe('2026-02-28'));
});
describe('fixture adapter',()=>{
 it('supplies 60 unique records and summaries',()=>{expect(forecasts).toHaveLength(60);expect(new Set(forecasts.map(f=>f.id)).size).toBe(60);expect(new Set(forecasts.map(f=>f.summary)).size).toBe(60);});
 it('every record covers its period and has all four sections',()=>{for(const f of forecasts){expect(forecastState(f,'2026-10-29',f.period)).toBe('published');expect(f.sections.map(s=>s.key)).toEqual(['love','career','finance','health']);expect(Date.parse(f.publishedAt)).toBeLessThanOrEqual(Date.parse(f.updatedAt));}});
 it('does not relabel expired content',()=>expect(forecastState(forecasts[0],'2026-10-30','today')).toBe('expired'));
 it.each(['draft','expired','unavailable','failed'] as const)('does not expose %s content',async scenario=>{const result=await getForecast('libra','today',scenario);expect(result.record).toBeUndefined();expect(result.state).toBe(scenario==='draft'?'unavailable':scenario);});
 it('supports empty article feeds',()=>expect(getArticles('evergreen','empty-articles')).toEqual([]));
 it('orders articles newest first',()=>{const a=getArticles('latest');expect(a.map(x=>x.publishedAt)).toEqual(a.map(x=>x.publishedAt).sort().reverse());});
});
