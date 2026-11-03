'use client';

import type {Zodiac} from '@/app/types/content';

export default function ZodiacCard({zodiac}:{zodiac:Zodiac}) {
 return <details
  className="sign-paper sign-characteristics"
  onPointerEnter={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')event.currentTarget.open=true;}}
  onPointerLeave={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')event.currentTarget.open=false;}}
  onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.currentTarget.open=false;}}}
 >
  <summary>
   <span className="sign-characteristics__front" aria-hidden="true">
    <img className="sign-illustration" src={zodiac.asset} alt=""/>
    <span className="sign-paper-footer"><span>Elemen · {zodiac.element}</span><span>{zodiac.range}</span></span>
   </span>
   <span className="sign-characteristics__action sign-characteristics__action--closed">Mengenal Karakteristik {zodiac.name}</span>
   <span className="sign-characteristics__action sign-characteristics__action--open">Kembali ke ilustrasi {zodiac.name}</span>
  </summary>
  <section className="sign-characteristics__content" aria-labelledby={`characteristics-${zodiac.slug}`}>
   <h2 id={`characteristics-${zodiac.slug}`}>Mengenal Karakteristik {zodiac.name}</h2>
   <p>{zodiac.profile}</p>
   <p className="sign-characteristics__meta">Elemen {zodiac.element} · {zodiac.range}</p>
  </section>
 </details>;
}
