import 'server-only';
import type { Forecast, Period, Scenario, EditorialArticle } from '@/app/types/content';
import { zodiacs, periods } from '@/lib/zodiac';
import { periodBounds, shiftDate, periodLabel } from '@/lib/calendar';
import { forecastState } from '@/lib/content-state';
import { pageConfig } from './config';
const ref=pageConfig.referenceDate;
const moods = { today:'hari ini',tomorrow:'besok',week:'pekan ini',month:'bulan ini',year:'tahun ini' };
const themes = ['keberanian','ketenangan','rasa ingin tahu','kehangatan','kreativitas','ketelitian','keseimbangan','ketulusan','kebebasan','ketekunan','keterbukaan','empati'];
export const forecasts: Forecast[] = zodiacs.flatMap((z,i)=>periods.map(({key})=>{
  const {start,end}=periodBounds(ref,key), when=moods[key];
  return {id:`${z.slug}-${key}-${start}`,zodiacSlug:z.slug,period:key,periodStart:start,periodEnd:end,
    summary:`${z.name}, ${when} mengajakmu merawat ${themes[i]} dengan langkah yang membumi. Pilih satu hal yang paling berarti dan berikan perhatianmu di sana. ${key==='today'?'Percakapan sederhana bisa membawa kejernihan.':`Gunakan rentang ${periodLabel(ref,key)} untuk menata niat dan memberi ruang bagi perubahan.`}`,
    sections:[
      {key:'love',heading:'Asmara: Membuka Ruang Dialog yang Setara',body:[`Bagi yang berpasangan: Getaran Venus ${when} mengajakmu untuk membicarakan ekspektasi yang selama ini tersimpan rapi. Hubungan yang sehat bukan tentang menghindari perbedaan demi kedamaian semu, melainkan kemampuan mendengar dengan empati dan merumuskan kompromi bersama.`, `Bagi yang single: Daya pikatmu memancar kuat melalui percakapan mendalam dan ketertarikan intelektual yang sama. Jangan tergesa-gesa menilai seseorang dari citra luarnya semata; berikan kesempatan pada mereka yang konsisten menghormati ruang pribadimu.`]},
      {key:'career',heading:`Karier: ${z.name}, Beri Ruang untuk Langkah Baru`,body:[`Di tengah ritme ${when}, ${themes[i]} menjadi bekal untuk menyampaikan gagasan dengan jelas. Tentukan prioritas sebelum menerima tanggung jawab tambahan.`, `Bicarakan kebutuhan dan batas waktumu dengan rekan kerja. Kemajuan kecil yang konsisten lebih berarti daripada memaksakan semua selesai sekaligus.`]},
      {key:'finance',heading:'Keuangan: Keseimbangan Antara Kebutuhan dan Keinginan Estetik',body:[`Kondisi finansial berada pada jalur yang cukup stabil, namun hasratmu untuk mempercantik hunian atau berbelanja barang bernilai seni tinggi sedang meningkat. Berikan waktu jeda 24 jam sebelum melakukan transaksi impulsif untuk memastikan barang tersebut benar-benar esensial.`, `Ini adalah saat yang tepat untuk menata kembali portofolio tabungan atau dana darurat. Prioritaskan instrumen keuangan berisiko rendah yang memberikan ketenangan jangka panjang bagi rencana finansialmu.`]},
      {key:'health',heading:'Kesehatan: Rawat Keseimbangan Postur dan Kualitas Tidur',body:[`Area tubuh yang dinaungi ${z.name} berfokus pada keseimbangan dan ritme istirahat. Pastikan asupan air putihmu mencukupi, terutama bila kamu menghabiskan sebagian besar waktu duduk di depan layar komputer.`, `Untuk kesehatan mental, ritual hening seperti journaling sebelum tidur atau peregangan ringan (stretching) akan sangat membantu meredakan ketegangan setelah seharian berinteraksi sosial dengan ritme tinggi.`]},
    ], author:'Redaksi Demo Zodiak',publishedAt:`${shiftDate(start,-1)}T05:00:00+07:00`,updatedAt:`${ref}T06:00:00+07:00`,status:'published',image:'/assets/forecast-cover.png'};
}));
export const scenarios: Scenario[]=['normal','unavailable','failed','expired','draft','empty-articles'];
export async function getForecast(slug: string, period: Period, scenario: Scenario='normal') {
  const original=forecasts.find(f=>f.zodiacSlug===slug && f.period===period);
  if (!original) return {state:'unavailable' as const};
  const record={...original};
  if (scenario==='failed') return {state:'failed' as const};
  if (scenario==='draft'||scenario==='unavailable'||scenario==='expired') record.status=scenario;
  const state=forecastState(record,ref,period);
  return {state,record:state==='published'?record:undefined};
}
const articleData = [
 ['transit','Transit Planet Minggu Ini: Waktunya 3 Zodiak Ini Mengambil Keputusan Karier Krusial','2026-10-27','Pergerakan Merkurius dan Mars membawa dinamika baru dalam komunikasi kerja dan negosiasi finansial bagi Gemini, Virgo, dan Capricorn. Saatnya meninjau kembali batasan profesionalmu.','latest','/assets/article-transit.png'],
 ['bulan','Energi Bulan Purnama di Taurus: Refleksi Stabilitas dan Self-Care Finansial','2026-10-26','','latest',''],
 ['asmara','Prediksi Asmara Akhir Bulan: Siapa yang Siap Membuka Hati Kembali?','2026-10-25','','latest',''],
 ['elemen','Mengenal Elemen Api, Tanah, Udara, dan Air: Mengapa Peta Kelahiranmu Begitu Unik?','2026-10-24','Pahami bagaimana perpaduan elemen dalam zodiak membentuk caramu merespons stres, menentukan ritme istirahat, dan membangun relasi bermakna.','evergreen','/assets/article-elements.png'],
 ['hubungan','Panduan Cocok Logika vs Perasaan: Dinamika Hubungan Pasangan Zodiak Berbeda Elemen','2026-10-22','Ketika zodiak berelemen Air bertemu Api atau Udara bertemu Tanah, ini rahasia menjaga harmoni komunikasi tanpa kehilangan jati diri.','evergreen','/assets/article-compatibility.png'],
 ['ritual','Ritual Self-Care yang Paling Pas Berdasarkan Elemen Zodiakmu','2026-10-20','Mulai dari journaling reflektif hingga grounding walk, sesuaikan rutinitas pemulihan energimu dengan ritme astrologi tubuhmu.','evergreen','/assets/article-self-care.png'],
 ['refleksi','Ruang untuk Refleksi: Mengenal Dirimu Lewat Zodiak','2026-10-18','Luangkan waktu untuk memahami kebutuhanmu dan menyusun kebiasaan kecil yang membuat hari terasa lebih ringan.','evergreen','/assets/article-elements.png'],
];
// References contain no existing editorial URLs: these explicit demo destinations open
// an on-page editorial preview rather than inventing CMS routes or production URLs.
export const articles: EditorialArticle[]=articleData.map(([id,title,publishedAt,description,category,image])=>({id,title,publishedAt:`${publishedAt}T06:00:00+07:00`,description,category:category as 'latest'|'evergreen',image:image||undefined,url:`#artikel-${id}`,demoDestination:true}));
export function getArticles(category:'latest'|'evergreen', scenario:Scenario='normal') { return scenario==='empty-articles'?[]:articles.filter(a=>a.category===category).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)); }
