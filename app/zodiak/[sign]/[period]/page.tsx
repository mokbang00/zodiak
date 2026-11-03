export const dynamicParams = false;
import {notFound} from 'next/navigation';
import {getZodiac,zodiacs,periods,periodFromSuffix} from '@/lib/zodiac';
import {detailMetadata} from '@/app/lib/metadata';
import ForecastPage from '../../ForecastPage';
export function generateStaticParams(){return zodiacs.flatMap(z=>periods.filter(p=>p.key!=='today').map(p=>({sign:z.slug,period:p.suffix})));}
export async function generateMetadata({params}:{params:Promise<{sign:string;period:string}>}){const p=await params,z=getZodiac(p.sign),period=periodFromSuffix(p.period);if(!z||!period)notFound();return detailMetadata(z,period);}
export default async function Page({params,searchParams}:{params:Promise<{sign:string;period:string}>;searchParams:Promise<{scenario?:string}>}){const p=await params,period=periodFromSuffix(p.period);if(!period)notFound();return <ForecastPage slug={p.sign} period={period} scenario={(await searchParams).scenario}/>;}
