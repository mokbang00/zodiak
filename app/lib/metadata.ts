import 'server-only';
import type { Metadata } from 'next';
import type { Forecast, Period, Zodiac } from '@/app/types/content';
import { zodiacUrl } from '@/lib/zodiac';
import { headingSuffix } from '@/lib/calendar';
import { pageConfig } from './config';
export const absolute = (path: string) => new URL(path,pageConfig.baseUrl).href;
export const forecastHeading = (z: Zodiac,p: Period) => `Ramalan Zodiak ${z.name} ${headingSuffix(pageConfig.referenceDate,p)}`;
export function detailMetadata(z: Zodiac,p: Period): Metadata { const title=forecastHeading(z,p);return {title,description:`${title}. Baca ramalan asmara, karier, keuangan, dan kesehatan.`,alternates:{canonical:absolute(zodiacUrl(z.slug,p))}}; }
export function breadcrumbs(items:{name:string;path:string}[]) { return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:absolute(item.path)}))}; }
export function articleSchema(z:Zodiac,p:Period,f:Forecast) { return {'@context':'https://schema.org','@type':'Article',headline:forecastHeading(z,p),description:f.summary,author:{'@type':'Organization',name:f.author},publisher:{'@type':'Organization',name:pageConfig.publisher},datePublished:f.publishedAt,dateModified:f.updatedAt,image:absolute(f.image),mainEntityOfPage:absolute(zodiacUrl(z.slug,p))}; }
