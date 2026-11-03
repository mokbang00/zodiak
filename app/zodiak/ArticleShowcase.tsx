'use client';
import { useEffect, useRef, useState } from 'react';
import type { EditorialArticle } from '@/app/types/content';
import { track } from '@/lib/analytics';
export default function ArticleShowcase({articles,kind='evergreen',title}:{articles:EditorialArticle[];kind?:'latest'|'evergreen'|'related';title:string}) {
 const row=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const [selected,setSelected]=useState<EditorialArticle>(),[bounds,setBounds]=useState({previous:false,next:articles.length>3});
 const section=kind==='related'?'related':kind;
 useEffect(()=>{const el=row.current;if(!el)return;const update=()=>setBounds({previous:el.scrollLeft>1,next:el.scrollLeft+el.clientWidth<el.scrollWidth-2});update();const observer=new ResizeObserver(update);observer.observe(el);el.addEventListener('scroll',update,{passive:true});return ()=>{observer.disconnect();el.removeEventListener('scroll',update);};},[articles.length]);
 function move(direction:number) { const el=row.current;if(el){const card=el.children[0] as HTMLElement;el.scrollBy({left:direction*(card.offsetWidth+24),behavior:'smooth'});} }
 if(!articles.length) return null;
 return <section className={`article-section ${kind}`} aria-labelledby={`${kind}-title`}>
  <div className="section-heading"><div><h2 id={`${kind}-title`}>{title}</h2><img className="wave" src="/assets/wave.png" alt=""/></div>{kind!=='latest'&&<div className="carousel-buttons"><button type="button" aria-label="Artikel sebelumnya" disabled={!bounds.previous} onClick={()=>move(-1)}><span aria-hidden="true">←</span></button><button type="button" aria-label="Artikel berikutnya" disabled={!bounds.next} onClick={()=>move(1)}><span aria-hidden="true">→</span></button></div>}</div>
  <div className={kind==='latest'?'latest-grid':'article-carousel'} ref={row} aria-label={title} tabIndex={kind==='latest'?undefined:0}>
   {articles.map((article,i)=><a key={article.id} href={article.url} className={`editorial-card card-${i}`} onClick={e=>{track('zodiac_article_click',{article_id:article.id,section,position:i+1});if(article.demoDestination){e.preventDefault();setSelected(article);dialog.current?.showModal();}}}>
    {article.image&&<img className="article-image" src={article.image} alt="" loading="lazy"/>}<div className="article-card-body"><time dateTime={article.publishedAt}>{new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Jakarta'}).format(new Date(article.publishedAt))}</time><h3>{article.title}</h3>{article.description&&<p>{article.description}</p>}</div>
   </a>)}
  </div>
  <dialog ref={dialog} className="article-dialog" aria-labelledby={`${kind}-dialog-title`}><button className="dialog-close" onClick={()=>dialog.current?.close()} aria-label="Tutup pratinjau">×</button><p className="preview-label">Pratinjau artikel demo</p><h2 id={`${kind}-dialog-title`}>{selected?.title}</h2><p>{selected?.description||'Bacaan seputar zodiak, hubungan, dan ruang untuk merawat diri.'}</p><p className="muted">Artikel lengkap akan tersedia melalui tautan editorial.</p><button className="primary-button" onClick={()=>dialog.current?.close()}>Kembali membaca</button></dialog>
 </section>;
}
