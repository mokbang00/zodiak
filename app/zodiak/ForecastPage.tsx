import PageView from '@/app/components/PageView';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getZodiac,zodiacs,zodiacUrl,periods} from '@/lib/zodiac';
import {formatUpdate,headingSuffix,periodLabel} from '@/lib/calendar';
import {getForecast,getArticles,scenarios} from '@/app/lib/fixtures';
import {pageConfig} from '@/app/lib/config';
import {breadcrumbs,articleSchema} from '@/app/lib/metadata';
import type {Period,Scenario} from '@/app/types/content';
import JsonLd from '@/app/components/JsonLd';
import Unavailable from '@/app/components/Unavailable';
import PeriodNavigation from './PeriodNavigation';
import ArticleShowcase from './ArticleShowcase';
export default async function ForecastPage({slug,period,scenario:requested}:{slug:string;period:Period;scenario?:string}) {
 const zodiac=getZodiac(slug);if(!zodiac)notFound();
 const scenario:Scenario=scenarios.includes(requested as Scenario)?requested as Scenario:'normal';
 const {record,state}=await getForecast(slug,period,scenario);
 const crumb=[{name:'Zodiak',path:'/zodiak'},{name:zodiac.name,path:zodiacUrl(slug)}];
 if(period!=='today')crumb.push({name:periods.find(p=>p.key===period)!.label,path:zodiacUrl(slug,period)});
 return <main id="main" className="detail-page" data-zodiac-page="detail" data-content-state={state}>
  <PageView zodiac={slug} period={period} scenario={scenario} state={state}/><JsonLd data={breadcrumbs(crumb)}/>{record&&<JsonLd data={articleSchema(zodiac,period,record)}/>}
  <div className="breadcrumb-band"><nav aria-label="Breadcrumb"><Link href="/zodiak">← Kembali ke Direktori Zodiak</Link><span aria-hidden="true">/</span>{period==='today'?<span className="breadcrumb-sign" aria-current="page">{zodiac.name}</span>:<><Link className="breadcrumb-sign" href={zodiacUrl(slug)}>{zodiac.name}</Link><span aria-hidden="true">/</span><span aria-current="page">{periods.find(p=>p.key===period)!.label}</span></>}</nav></div>
  <div className="detail-container"><section className="detail-hero"><img className="detail-star" src="/assets/star-detail.png" alt=""/><div className="detail-hero-paper"><div className="detail-intro"><h1>Ramalan Zodiak <em>{zodiac.name}</em><span className="period-heading">{headingSuffix(pageConfig.referenceDate,period)}</span></h1><p>{zodiac.profile}</p></div><div className="sign-paper"><img className="sign-illustration" src={zodiac.asset} alt=""/><div className="sign-paper-footer"><span>Elemen · {zodiac.element}</span><span>{zodiac.range}</span></div></div></div></section>
  <div className="cosmic-ribbon" aria-hidden="true"><div><span>FYI! THE SUN IS IN HARMONY</span><b>{zodiac.name}</b><img src="/assets/star-purple.png" alt=""/><span>{slug==='libra'?'VENUS RULES BALANCE & BEAUTY':'A MOMENT TO REFLECT'}</span><span className="ribbon-stamp">EDISI {pageConfig.referenceDate.slice(0,4)}</span><img src="/assets/star-pink.png" alt=""/><span>ELEMEN {zodiac.element}</span></div></div>
  <PeriodNavigation slug={slug} active={period} scenario={scenario}/>
  <article className="forecast-article"><header className="forecast-date"><p>{periodLabel(pageConfig.referenceDate,period)}</p>{record&&<span><span className="update-dot" aria-hidden="true"/>Diperbarui {formatUpdate(record.updatedAt)}</span>}</header>
  {record?<div className="reading-column"><figure className="forecast-figure"><img src={record.image} alt="Jam astronomi dengan lingkaran lambang zodiak berwarna biru dan emas" width="1024" height="576"/></figure><div className="forecast-summary"><p className="byline">Oleh {record.author}</p><p>{record.summary}</p></div>{record.sections.filter(s=>s.heading&&s.body.length).map((s,i)=><section className="reading-section" key={s.key}><h2>{s.heading}</h2>{s.body.filter(Boolean).map((paragraph,j)=><p key={j}>{paragraph}</p>)}{i<record.sections.length-1&&<img className="reading-divider" src="/assets/divider.png" alt=""/>}</section>)}{period==='today'&&<section className="reading-section profile"><h2>Mengenal {zodiac.name}</h2><p>{zodiac.profile}</p><p>Elemen {zodiac.element} · {zodiac.range}</p></section>}</div>:<Unavailable state={state}/>}
  </article>
  {period!=='today'&&<ArticleShowcase kind="related" title={`Bacaan untuk ${zodiac.name}`} articles={getArticles('evergreen',scenario).slice(0,3)}/>}
  <section className="sign-switcher" aria-label="Ganti zodiak"><div className="swap-label"><img src="/assets/swap-paper.png" alt=""/><h2><em>Swap</em><span>signs</span></h2></div><div className="switcher-grid">{zodiacs.filter(z=>z.slug!==slug).map(z=><Link href={zodiacUrl(z.slug,period)+(scenario==='normal'?'':`?scenario=${scenario}`)} key={z.slug} data-track="zodiac_select" data-params={JSON.stringify({target_zodiac:z.slug,source:'switcher'})}><img src={z.asset} alt="" loading="lazy"/><span>{z.name}</span></Link>)}</div></section>
  </div>
 </main>;
}
