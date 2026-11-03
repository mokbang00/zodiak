'use client';
import { useEffect,useRef } from 'react';
import Link from 'next/link';
import {periods,zodiacUrl} from '@/lib/zodiac';
import type {Period,Scenario} from '@/app/types/content';
export default function PeriodNavigation({slug,active,scenario}:{slug:string;active:Period;scenario:Scenario}) {
 const nav=useRef<HTMLElement>(null);
 useEffect(()=>{nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({block:'nearest',inline:'nearest'});},[active]);
 return <nav className="period-navigation" aria-label="Periode ramalan" ref={nav}>{periods.map(p=><Link key={p.key} href={zodiacUrl(slug,p.key)+(scenario==='normal'?'':`?scenario=${scenario}`)} aria-current={active===p.key?'page':undefined} data-track="zodiac_period_select" data-params={JSON.stringify({from_period:active,to_period:p.key,zodiac:slug})}>{p.label}</Link>)}</nav>;
}
