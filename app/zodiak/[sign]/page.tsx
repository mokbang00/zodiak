export const dynamicParams = false;
import {notFound} from 'next/navigation';
import {getZodiac,zodiacs} from '@/lib/zodiac';
import {detailMetadata} from '@/app/lib/metadata';
import ForecastPage from '../ForecastPage';
export function generateStaticParams(){return zodiacs.map(z=>({sign:z.slug}));}
export async function generateMetadata({params}:{params:Promise<{sign:string}>}){const {sign}=await params;const z=getZodiac(sign);if(!z)notFound();return detailMetadata(z,'today');}
export default async function Page({params,searchParams}:{params:Promise<{sign:string}>;searchParams:Promise<{scenario?:string}>}){const {sign}=await params;return <ForecastPage slug={sign} period="today" scenario={(await searchParams).scenario}/>;}
