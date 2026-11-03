import PageView from '@/app/components/PageView';
import Link from 'next/link';
import type {Metadata} from 'next';
import {zodiacs,zodiacUrl} from '@/lib/zodiac';
import {formatDate,formatUpdate} from '@/lib/calendar';
import {getArticles,forecasts,scenarios} from '@/app/lib/fixtures';
import {pageConfig} from '@/app/lib/config';
import {absolute,breadcrumbs} from '@/app/lib/metadata';
import JsonLd from '@/app/components/JsonLd';
import type {Scenario} from '@/app/types/content';
import Finder from './Finder';
import ArticleShowcase from './ArticleShowcase';
export const metadata:Metadata={title:`Ramalan Zodiak Hari Ini, ${formatDate(pageConfig.referenceDate)}`,alternates:{canonical:absolute('/zodiak')}};
export default async function Directory({searchParams}:{searchParams:Promise<{scenario?:string}>}) {
 const query=await searchParams,scenario=scenarios.includes(query.scenario as Scenario)?query.scenario as Scenario:'normal';
 const updated=forecasts.reduce((latest,f)=>f.updatedAt>latest?f.updatedAt:latest,forecasts[0].updatedAt);
 return <main id="main" className="directory" data-zodiac-page="directory">
  <JsonLd data={{'@context':'https://schema.org','@type':'CollectionPage',name:'Ramalan Zodiak Hari Ini',url:absolute('/zodiak'),mainEntity:{'@type':'ItemList',itemListElement:zodiacs.map((z,i)=>({'@type':'ListItem',position:i+1,name:z.name,url:absolute(zodiacUrl(z.slug))}))}}}/><JsonLd data={breadcrumbs([{name:'Zodiak',path:'/zodiak'}])}/>
  <PageView scenario={scenario}/><div className="directory-meta"><nav aria-label="Breadcrumb"><span aria-current="page">Zodiak</span></nav><span>Diperbarui {formatUpdate(updated)}</span></div>
  <section className="directory-hero" aria-labelledby="directory-title"><div className="hero-copy"><div className="hero-title-wrap"><h1 id="directory-title"><span className="outline-title">Ramalan</span><span>Zodiak Hari Ini</span></h1><img src="/assets/star-purple.png" className="hero-sparkle" alt=""/></div><img className="hero-wave" src="/assets/wave.png" alt=""/><p>Cari tahu zodiakmu dan persiapkan hari-harimu lewat ramalan harian, mingguan, bulanan, dan tahunan! Temukan pesan semesta yang membumi, penuh cinta, dan memberdayakan setiap langkahmu.</p></div><Finder/></section>
  <section className="zodiac-section" aria-labelledby="choose-title"><div className="section-heading"><div><h2 id="choose-title">Pilih Zodiakmu</h2><img className="wave" src="/assets/wave.png" alt=""/></div></div><div className="zodiac-grid">{zodiacs.map(z=><Link className="zodiac-card" href={zodiacUrl(z.slug)} key={z.slug} data-track="zodiac_select" data-params={JSON.stringify({target_zodiac:z.slug,source:'grid'})}><img src={z.asset} alt="" width="512" height="512"/><h3>{z.name}</h3><p>{z.range}</p></Link>)}</div></section>
  <ArticleShowcase title="Ramalan Terbaru" kind="latest" articles={getArticles('latest',scenario)}/>
  {scenario==='empty-articles'&&<section className="article-section"><h2>Ramalan Terbaru</h2><div className="summary-grid">{forecasts.filter(f=>f.period==='today').map(f=><Link key={f.id} href={zodiacUrl(f.zodiacSlug)}><h3>{zodiacs.find(z=>z.slug===f.zodiacSlug)!.name}</h3><p>{f.summary}</p></Link>)}</div></section>}
  <ArticleShowcase title="Artikel Seputar Zodiak" articles={getArticles('evergreen',scenario)}/>
 </main>;
}
