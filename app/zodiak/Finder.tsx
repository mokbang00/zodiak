'use client';
import { useState } from 'react';
import Link from 'next/link';
import { findZodiac, zodiacUrl, EMPTY_ERROR } from '@/lib/zodiac';
import { track } from '@/lib/analytics';
import type { Zodiac } from '@/app/types/content';
export default function Finder() {
 const [day,setDay]=useState(''),[month,setMonth]=useState(''),[error,setError]=useState(''),[result,setResult]=useState<Zodiac>(),[submitted,setSubmitted]=useState(false);
 function validate(d:string,m:string) { const found=findZodiac(d,m);setError(found.error||'');setResult(found.zodiac);return found; }
 return <div className="finder-wrap" id="finder">
  <img className="finder-tape" src="/assets/tape.png" alt=""/><img className="finder-star" src="/assets/star-pink.png" alt=""/>
  <div className="finder-paper"><h2>Belum tahu zodiakmu?</h2><p>Masukkan tanggal dan bulan lahirmu untuk mengetahui zodiak dan elemen dasarmu</p>
  <form noValidate onSubmit={e=>{e.preventDefault();setSubmitted(true);const found=validate(day,month);track('zodiac_finder_submit',{result:found.error?'invalid':'valid',...(found.error?{error_type:found.error===EMPTY_ERROR?'empty':'invalid_date'}:{})});}}>
   <div className="finder-fields"><div><label htmlFor="birth-day">Tanggal</label><input id="birth-day" type="text" inputMode="numeric" autoComplete="off" placeholder="Isi tanggal lahir..." value={day} aria-invalid={!!error} aria-describedby={error?'finder-error':undefined} onChange={e=>{setDay(e.target.value);if(submitted)validate(e.target.value,month);}}/></div>
   <div><label htmlFor="birth-month">Bulan</label><select id="birth-month" value={month} aria-invalid={!!error} aria-describedby={error?'finder-error':undefined} onChange={e=>{setMonth(e.target.value);if(submitted)validate(day,e.target.value);else if(day)setError(findZodiac(day,e.target.value).error||'');}}><option value="">Isi bulan lahir...</option>{['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'].map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select></div></div>
   <div aria-live="polite" aria-atomic="true">{error&&<p className="form-error" id="finder-error" role="alert">{error}</p>}{result&&<div className="finder-result">
    <img className="finder-result__image" src={result.asset} alt="" width="80" height="80"/>
    <div className="finder-result__details">
     <div className="finder-result__heading"><h3>{result.name}</h3><p>{result.range}</p></div>
     <div className="finder-result__footer">
      <span className="finder-result__element">Elemen: {result.element}</span>
      <Link className="finder-result__link" href={zodiacUrl(result.slug)} aria-label={`Lihat ramalan ${result.name}`} onClick={()=>track('zodiac_finder_result_click',{target_zodiac:result.slug})}>Lihat <span aria-hidden="true">→</span></Link>
     </div>
    </div>
   </div>}</div>
   <button className="primary-button" type="submit">Cari Zodiak</button>
  </form></div></div>;
}
