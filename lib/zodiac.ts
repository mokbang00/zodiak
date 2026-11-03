import type { Zodiac, Period } from '@/app/types/content';
const entries = [
  ['aries','Aries','03-21','04-19','21 Mar – 19 Apr','Api','Penuh keberanian dan semangat, Aries senang membuka jalan baru. Beri ruang untuk berhenti sejenak dan mendengarkan dirimu.'],
  ['taurus','Taurus','04-20','05-20','20 Apr – 20 Mei','Tanah','Taurus menghargai ketenangan, kesetiaan, dan kenyamanan sederhana. Temukan ritme yang membuatmu merasa aman dan bertumbuh.'],
  ['gemini','Gemini','05-21','06-20','21 Mei – 20 Jun','Udara','Rasa ingin tahu dan keluwesan membuat Gemini mudah terhubung. Percakapan yang jujur bisa membuka sudut pandang baru.'],
  ['cancer','Cancer','06-21','07-22','21 Jun – 22 Jul','Air','Cancer dikenal hangat, intuitif, dan penuh perhatian. Rawat hubunganmu sambil tetap menjaga batas dan kebutuhan pribadi.'],
  ['leo','Leo','07-23','08-22','23 Jul – 22 Agu','Api','Leo membawa kehangatan dan kreativitas ke mana pun melangkah. Kepercayaan diri tumbuh ketika kamu berani menjadi diri sendiri.'],
  ['virgo','Virgo','08-23','09-22','23 Agu – 22 Sep','Tanah','Virgo teliti dan senang membantu melalui hal-hal kecil. Tidak semua harus sempurna agar tetap bermakna.'],
  ['libra','Libra','09-23','10-22','23 Sep – 22 Okt','Udara','Dikenal sebagai sang penyeimbang yang cinta damai, penuh pesona, dan berintelek tinggi. Simak bagaimana energi kosmik memandu langkahmu menuju keharmonisan asmara, karier, dan ketenangan batin.'],
  ['scorpio','Scorpio','10-23','11-21','23 Okt – 21 Nov','Air','Scorpio mendekati hidup dengan ketulusan dan kedalaman emosi. Percayai proses perubahan tanpa harus mengendalikan semuanya.'],
  ['sagitarius','Sagittarius','11-22','12-21','22 Nov – 21 Des','Api','Sagittarius menyukai kebebasan dan pengalaman baru. Petualangan paling berharga bisa dimulai dari pertanyaan sederhana.'],
  ['capricorn','Capricorn','12-22','01-19','22 Des – 19 Jan','Tanah','Capricorn tekun membangun tujuan dengan langkah nyata. Istirahat adalah bagian dari perjalanan, bukan hambatan untuk maju.'],
  ['aquarius','Aquarius','01-20','02-18','20 Jan – 18 Feb','Udara','Aquarius terbuka pada ide baru dan peduli pada komunitas. Pertahankan keunikanmu sambil memberi ruang bagi orang lain.'],
  ['pisces','Pisces','02-19','03-20','19 Feb – 20 Mar','Air','Pisces memiliki imajinasi yang kaya dan empati yang lembut. Jadikan intuisi sebagai teman, lalu lengkapi dengan langkah yang membumi.'],
];
export const zodiacs: Zodiac[] = entries.map(([slug,name,dateRangeStart,dateRangeEnd,range,element,profile]) => ({slug,name,dateRangeStart,dateRangeEnd,range,element,profile,asset:`/assets/zodiac-${slug}.png`}));
export const getZodiac = (slug: string) => zodiacs.find(z => z.slug === slug);
export const periods: { key: Period; label: string; suffix: string }[] = [
  {key:'today',label:'Hari Ini',suffix:''}, {key:'tomorrow',label:'Besok',suffix:'besok'},
  {key:'week',label:'Minggu Ini',suffix:'minggu-ini'}, {key:'month',label:'Bulan Ini',suffix:'bulan-ini'}, {key:'year',label:'Tahun Ini',suffix:'tahun-ini'},
];
export const periodFromSuffix = (suffix: string) => periods.find(p => p.suffix === suffix)?.key;
export const zodiacUrl = (slug: string, period: Period = 'today') => `/zodiak/${slug}${period === 'today' ? '' : `/${periods.find(p=>p.key===period)!.suffix}`}`;
export const EMPTY_ERROR = 'Pilih tanggal dan bulan lahirmu.';
export const DATE_ERROR = 'Tanggal tidak tersedia pada bulan yang dipilih.';
export function findZodiac(day: string, month: string): { zodiac?: Zodiac; error?: string } {
  if (!day.trim() || !month) return {error: EMPTY_ERROR};
  const d = Number(day), m = Number(month);
  if (!/^\d{1,2}$/.test(day.trim()) || !Number.isInteger(m) || m<1 || m>12 || d<1 || d>[31,29,31,30,31,30,31,31,30,31,30,31][m-1]) return {error: DATE_ERROR};
  const value = `${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  return {zodiac: zodiacs.find(z => z.dateRangeStart <= z.dateRangeEnd ? value>=z.dateRangeStart && value<=z.dateRangeEnd : value>=z.dateRangeStart || value<=z.dateRangeEnd)};
}
