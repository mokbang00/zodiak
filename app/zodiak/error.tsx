'use client';
import Link from 'next/link';
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main" className="not-found"><h1>Ramalan belum dapat dimuat.</h1><button className="primary-button" onClick={()=>reset()}>Coba lagi</button><Link href="/zodiak">Kembali ke direktori zodiak</Link></main>;}
