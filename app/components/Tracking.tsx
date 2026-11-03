'use client';
import {useEffect} from 'react';
import {track,type EventName} from '@/lib/analytics';
export default function Tracking(){
 useEffect(()=>{
  const handler=(event:MouseEvent)=>{const el=(event.target as Element).closest<HTMLElement>('[data-track]');if(el)track(el.dataset.track as EventName,JSON.parse(el.dataset.params||'{}') as Record<string,string|number>);};
  document.addEventListener('click',handler);return ()=>document.removeEventListener('click',handler);
 },[]);
 return null;
}
