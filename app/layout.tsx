import type { Metadata } from 'next';
import {Suspense} from 'react';
import NextTopLoader from 'nextjs-toploader';
import Tracking from './components/Tracking';
import {pageConfig} from './lib/config';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL(pageConfig.baseUrl),title:{default:'Ramalan Zodiak',template:'%s'},description:'Temukan zodiakmu dan baca ramalan harian, mingguan, bulanan, dan tahunan.',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="id"><body><a href="#main" className="skip-link">Langsung ke konten</a><NextTopLoader color="#8C56A3" showSpinner={false}/><Suspense><Tracking/></Suspense>{children}<footer className="demo-footer">Prototipe Zodiak · Konten contoh untuk validasi · Tanggal acuan {pageConfig.referenceDate.split('-').reverse().join('/')} WIB</footer></body></html>; }
