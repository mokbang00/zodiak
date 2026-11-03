export type EventName = 'zodiac_page_view'|'zodiac_select'|'zodiac_finder_submit'|'zodiac_finder_result_click'|'zodiac_period_select'|'zodiac_article_click'|'zodiac_content_state';
export interface AnalyticsEvent { event_name: EventName; page_path:string; timestamp:string; environment:'demo'; [key:string]: string|number; }
declare global { interface Window { __zodiacEvents?: AnalyticsEvent[]; } }
const allowed = new Set(['page_type','zodiac','period','target_zodiac','source','result','error_type','from_period','to_period','article_id','section','position','state']);
export function track(name:EventName, params:Record<string,string|number>={}) {
  if (typeof window==='undefined') return;
  const clean=Object.fromEntries(Object.entries(params).filter(([key])=>allowed.has(key)));
  const event:AnalyticsEvent={...clean,event_name:name,page_path:window.location.pathname,timestamp:new Date().toISOString(),environment:'demo'};
  (window.__zodiacEvents ??=[]).push(event);
  window.dispatchEvent(new CustomEvent('zodiac:analytics',{detail:event}));
}
