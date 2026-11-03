'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
export default function Unavailable({state}:{state:string}) {
 const router=useRouter();
 return <div className="content-unavailable" role="status"><h2>{state==='failed'?'Ramalan belum dapat dimuat.':'Ramalan untuk periode ini belum tersedia.'}</h2>{state==='expired'&&<p>Ramalan sebelumnya sudah melewati periode berlaku. Nantikan pembaruan berikutnya.</p>}{state==='failed'&&<button className="primary-button" onClick={()=>{const url=new URL(window.location.href);url.searchParams.delete('scenario');router.replace(url.pathname+url.search);router.refresh();}}>Coba lagi</button>}<Link href="/zodiak">Kembali ke direktori zodiak</Link></div>;
}
