'use client';
import {useLayoutEffect,useRef} from 'react';
import {track} from '@/lib/analytics';
import type {Period,Scenario} from '@/app/types/content';
export default function PageView({zodiac,period,scenario,state}:{zodiac?:string;period?:Period;scenario:Scenario;state?:string}) {
 const last=useRef('');
 useLayoutEffect(()=>{
  const key=[zodiac,period,scenario].join(':');if(last.current===key)return;last.current=key;
  track('zodiac_page_view',{page_type:zodiac?'detail':'directory',...(zodiac&&period?{zodiac,period}:{})});
  if(state&&state!=='published'&&zodiac&&period)track('zodiac_content_state',{state,zodiac,period});
 },[zodiac,period,scenario,state]);
 return null;
}
