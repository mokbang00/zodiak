# PRD — Slash Page Zodiak

**Status:** Draft untuk page development dan validation  
**Tanggal:** 23 Oktober 2026 · **Versi:** 1.0  
**PIC tahap ini:** Product Designer  
**Deliverable implementasi:** Working Slash Page berbasis HTML, CSS, dan JavaScript dengan data contoh, siap diuji.  
**Sumber utama:** Content & Page Architecture (1).md dan klarifikasi pemilik produk.  
**Batasan:** Stack produksi, deadline, resource, dan kontrak API masih TBD.

## 1. Executive Summary

### Problem Statement

Pembaca membutuhkan informasi zodiak yang tersusun berdasarkan tanda dan periode agar dapat langsung menemukan ramalan yang dicari. Proyek ini bertujuan menyediakan halaman direktori dengan struktur konten yang mendukung kebutuhan tersebut sekaligus membuka potensi akuisisi organik dan visibility pada pencarian.

### Proposed Solution

Bangun prototipe HTML responsif berbahasa Indonesia untuk direktori Zodiak, finder tanggal lahir, dan ramalan 12 zodiak dalam lima periode: hari ini, besok, minggu ini, bulan ini, dan tahun ini. Prototipe menggunakan data contoh dengan kontrak data yang dapat dihubungkan ke konten editorial dari CMS dan/atau workflow n8n existing pada tahap produksi.

Scope berisi **1 direktori + 60 halaman ramalan**, menggunakan dua template utama: direktori dan detail ramalan. Artikel editorial mempertahankan URL CMS existing; template artikel tersebut tidak dibangun ulang.

### Success Criteria

Tujuan bisnis mengikuti dokumen sumber. Target kesiapan prototipe di bawah merupakan rekomendasi PRD, bukan hasil pengujian yang sudah tercapai.

| KPI | Definisi dan pengukuran | Target / tahap |
|---|---|---|
| Kesiapan prototipe | Seluruh 61 rute berfungsi; semua acceptance criteria wajib lolos; tidak ada blocker pada alur utama | 100% sebelum validation |
| Keberhasilan tugas pengguna | Tugas selesai tanpa bantuan: menemukan zodiak, membuka ramalan, dan berpindah periode; dihitung per tugas | Rekomendasi ≥80% pada validation; jumlah peserta ditetapkan UXR |
| Organic traffic | Sesi organic search yang landing di kelompok URL /zodiak, melalui analytics produksi | Baseline 28 hari pertama setelah rilis; target pertumbuhan TBD oleh PM |
| SEO visibility dan relevansi intent | Halaman valid yang terindeks, impressions, clicks, CTR; proporsi klik dari query zodiak relevan terhadap seluruh klik query yang tersedia di Search Console | Audit mingguan; target TBD setelah baseline. Query tersembunyi membatasi cakupan analisis |
| Generative-search visibility | Persentase prompt sampel yang menampilkan rujukan ke URL Zodiak; catat platform, prompt, tanggal, dan URL | Benchmark eksploratif bulanan setelah rilis; bukan jaminan kemunculan |

Traffic, indexing, dan rujukan AI tidak dapat dibuktikan dari prototipe lokal. Google menyatakan fitur AI Search mengikuti fondasi SEO yang sama, tanpa schema khusus tambahan; pemenuhan persyaratan juga tidak menjamin indexing atau penayangan. [R1]

## 2. User Experience & Functionality

### User Personas

Persona berikut adalah hipotesis kebutuhan untuk pengujian, bukan temuan riset:

- **Pembaca dengan tujuan spesifik:** sudah mengetahui zodiaknya dan ingin membaca ramalan untuk periode tertentu, termasuk masuk langsung dari pencarian.
- **Pembaca yang belum mengetahui zodiaknya:** membutuhkan bantuan tanggal dan bulan lahir untuk menemukan halaman yang tepat.
- **Pembaca eksploratif:** ingin berpindah tanda atau membaca karakteristik dan artikel terkait.

### User Flow

1. Dari direktori: pilih kartu zodiak → baca ramalan hari ini → pilih periode lain atau artikel terkait.
2. Dari finder: pilih tanggal dan bulan → tampilkan hasil zodiak → pilih “Baca ramalan” → halaman hari ini.
3. Dari search/deep link: masuk langsung ke ramalan → pahami tanda dan periode → ganti periode, ganti zodiak, atau kembali ke direktori.

Pergantian zodiak mempertahankan periode aktif. Pergantian periode mempertahankan zodiak aktif. Breadcrumb kembali ke halaman induk yang sesuai.

### Page Structure

| Halaman / urutan | Konten dan komponen |
|---|---|
| Direktori: pembuka | Breadcrumb, H1 “Zodiak”, label pembaruan, deskripsi “Cari tahu zodiakmu dan persiapkan hari-harimu lewat ramalan harian, mingguan, bulanan, dan tahunan!” |
| Direktori: Pilih zodiakmu | Finder di atas grid; 12 kartu berurutan Aries–Pisces; simbol, nama, dan rentang tanggal; seluruh kartu dapat diklik |
| Direktori: Ramalan terbaru | 3–5 artikel harian terbaru jika tersedia; urutan tanggal terbit menurun. Bila feed artikel harian dihentikan, gunakan ringkasan singkat per tanda yang bersumber dari ramalan periode aktif |
| Direktori: Artikel seputar zodiak | Artikel evergreen kepribadian dan kecocokan; rekomendasi awal 3 kartu dari CMS |
| Detail: pembuka | Breadcrumb, H1 sesuai tanda/periode, simbol, rentang tanggal, elemen, penulis, periode berlaku, dan waktu pembaruan |
| Detail: navigasi dan isi | Lima tautan periode; ringkasan, Asmara, Karier, Keuangan, Kesehatan; kategori tambahan hanya jika tersedia dari editorial |
| Detail: kelanjutan | Profil/karakteristik hanya pada hari ini; artikel terkait pada empat periode lain; switcher ke 11 tanda lainnya pada seluruh detail |

### URL dan Heading

| Halaman | Rute | Pola H1 |
|---|---|---|
| Direktori | /zodiak | Zodiak |
| Hari ini | /zodiak/{zodiak} | Ramalan Zodiak {Nama} Hari Ini |
| Besok | /zodiak/{zodiak}/besok | Ramalan Zodiak {Nama} Besok, {hari tanggal bulan tahun} |
| Mingguan | /zodiak/{zodiak}/minggu-ini | Ramalan Zodiak {Nama} Minggu Ini, {rentang tanggal} |
| Bulanan | /zodiak/{zodiak}/bulan-ini | Ramalan Zodiak {Nama} Bulan Ini, {bulan tahun} |
| Tahunan | /zodiak/{zodiak}/tahun-ini | Ramalan Zodiak {Nama} Tahun {tahun} |

Slug valid: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagitarius, capricorn, aquarius, pisces. Ejaan merupakan konfigurasi awal; pemetaan ke taxonomy CMS dikonfirmasi sebelum integrasi. Hindari membuat URL alternatif untuk ejaan yang sama.

### User Stories & Acceptance Criteria

**US-01 — Memilih zodiak.** Sebagai pembaca, saya ingin melihat semua pilihan zodiak agar dapat langsung membuka ramalan saya.

- Grid menampilkan tepat 12 tanda dalam urutan Aries–Pisces; tiap kartu mempunyai simbol, label teks, dan rentang tanggal.
- Setiap kartu menuju rute hari ini yang sesuai; kartu dapat diakses melalui keyboard.
- Simbol dekoratif tidak menggandakan nama yang dibacakan screen reader.

**US-02 — Menggunakan finder.** Sebagai pembaca yang belum mengetahui zodiak saya, saya ingin memasukkan tanggal dan bulan lahir agar memperoleh pilihan yang sesuai.

- Gunakan dua field berlabel “Tanggal” dan “Bulan”, serta tombol “Cari zodiak”; tidak meminta tahun. Native input date mencakup tahun sehingga tidak cocok langsung dengan kebutuhan ini. [R4]
- Input kosong menampilkan “Pilih tanggal dan bulan lahirmu.”; tanggal tidak valid menampilkan “Tanggal tidak tersedia pada bulan yang dipilih.”
- 29 Februari diterima; 30 Februari dan 31 April ditolak. Perubahan bulan memvalidasi ulang tanggal.
- Hasil menampilkan nama, rentang tanggal, dan CTA “Baca ramalan”; tidak melakukan redirect otomatis.
- Mapping menggunakan tabel rentang editorial yang sama dengan kartu; uji tanggal awal/akhir seluruh tanda, pergantian tahun, dan 29 Februari.
- Tabel rentang tanggal ditetapkan sebagai konfigurasi sebelum validation; prototipe tidak membuat perhitungan astrologi astronomis.
- Nilai tanggal/bulan hanya berada dalam memori selama interaksi; tidak dikirim ke analytics, URL, penyimpanan browser, atau server.

**US-03 — Membaca dan berpindah periode.** Sebagai pembaca, saya ingin membuka ramalan periode tertentu agar informasi sesuai waktu yang saya cari.

- Semua 12 tanda memiliki lima tujuan periode; setiap tujuan dapat dibuka langsung, di-refresh, serta dinavigasi dengan Back/Forward.
- Navigasi periode berupa link dengan href nyata dan penanda halaman aktif, bukan filter yang hanya mengganti teks tanpa URL.
- H1, isi, periode berlaku, metadata, dan status link aktif selalu merujuk data yang sama.
- Ramalan hari ini memuat profil singkat; periode lain menampilkan artikel terkait ketika tersedia.
- Penulis dan waktu pembaruan berasal dari record konten; label diperluas menjadi “Diperbarui {tanggal}, {jam} WIB” untuk menghindari ambiguitas.

**US-04 — Melanjutkan eksplorasi.** Sebagai pembaca, saya ingin berpindah tanda atau artikel terkait agar dapat melanjutkan bacaan.

- Switcher menampilkan 11 tanda lain dan mempertahankan periode aktif.
- Breadcrumb detail hari ini: “Zodiak > {Nama}”; periode lain: “Zodiak > {Nama} > {Periode}”.
- Artikel menggunakan URL editorial existing; tidak membuat salinan artikel di bawah /zodiak.
- Jika artikel terkait kosong, section disembunyikan; grid dan navigasi tetap tersedia.

**US-05 — Memahami status konten.** Sebagai pembaca, saya ingin mengetahui saat ramalan belum tersedia agar tidak salah menganggap konten lama sebagai ramalan terkini.

- Loading menampilkan indikator/skeleton tanpa memblokir navigasi yang sudah siap.
- Konten belum tersedia menampilkan “Ramalan untuk periode ini belum tersedia.” dengan tautan ke direktori atau periode lain.
- Kegagalan mengambil data menampilkan “Ramalan belum dapat dimuat.” dan tombol “Coba lagi”.
- Ramalan kedaluwarsa tidak diberi label “hari ini” atau tanggal pembaruan palsu; tampilkan status belum tersedia untuk periode aktif. Jika konten lama ditampilkan sebagai referensi, periode lamanya harus eksplisit.
- Slug atau periode tidak valid menampilkan halaman tidak ditemukan dengan jalan kembali ke direktori; produksi mengembalikan HTTP 404.
- Mock state normal, kosong, gagal, dan kedaluwarsa tersedia untuk pengujian.

**US-06 — Mengakses di berbagai perangkat.** Sebagai pembaca mobile maupun desktop, saya ingin membaca dan menavigasi tanpa konten terpotong.

- Verifikasi lebar viewport 360, 390, 768, 1024, dan 1440 px; tidak ada scroll horizontal pada body.
- Grid rekomendasi: 2 kolom mobile, 3 tablet, 4 desktop; gunakan komponen/style existing bila tersedia.
- Lima link periode boleh scroll horizontal di mobile dengan indikasi ada pilihan lanjutan; label aktif tetap terlihat.
- Semua kontrol dapat diakses dengan keyboard, memiliki fokus terlihat, label yang jelas, dan target sentuh minimal 44 × 44 CSS px.
- Kontras teks normal minimal 4,5:1; error tidak disampaikan dengan warna saja; pembesaran teks 200% tidak menghilangkan fungsi.
- Gunakan satu H1, H2 per section, elemen main/nav/article, atribut lang="id", dan alt yang sesuai.

### Non-Goals

- Membangun CMS, workflow n8n baru, login, profil pengguna, notifikasi, atau rekomendasi personal.
- Membuat mesin generasi ramalan, kalkulator kecocokan, birth chart, atau ramalan berdasarkan jam/tempat lahir.
- Mengganti template artikel editorial existing atau melakukan deployment produksi pada tahap ini.
- Membuktikan pertumbuhan traffic dan ranking dari prototipe; pengukuran tersebut dilakukan setelah produksi.

## 3. AI System Requirements (If Applicable)

AI digunakan untuk membantu coding; prototipe tidak membutuhkan model AI saat digunakan pembaca. Finder bersifat deterministik berdasarkan konfigurasi editorial.

Jika workflow n8n existing menggunakan AI, mekanisme model, prompt, dan evaluasinya berada di luar scope page development. Halaman hanya mengonsumsi konten dengan status publikasi yang disepakati; PM dan editorial menetapkan penanggung jawab serta proses review sebelum produksi.

**Tool requirements:** editor/AI-assisted coding, browser untuk pengujian, local HTTP server, fixture JSON, dan validator markup. Context7 tidak tersedia pada sesi penyusunan ini; referensi teknis menggunakan dokumentasi resmi yang tercantum di bagian 5.

**Evaluation strategy:** hasil coding tetap diperiksa terhadap acceptance criteria; cek navigasi seluruh rute, akurasi mapping finder, state konten, metadata, dan payload tracking. Tidak ada klaim akurasi ramalan atau evaluasi model AI dalam deliverable ini.

## 4. Technical Specifications

### Architecture Overview

**Prototipe:** fixture JSON → adapter data → template direktori/detail → HTML + CSS + JavaScript → event collector untuk debugging.

Rekomendasi implementasi adalah static HTML per rute yang dihasilkan dari dua template. Sajikan melalui local HTTP server agar pola /zodiak/... dan refresh URL dapat diuji. Konten utama, tautan, title, dan JSON-LD sudah berada dalam HTML; JavaScript menangani finder dan tracking. Tidak wajib memuat seluruh implementasi dalam satu file.

Siapkan 60 record contoh untuk 12 tanda × 5 periode; gunakan konten berlabel demo dan tanggal acuan yang dapat diatur. Fixture mencakup konten pendek/panjang serta state kosong/gagal/kedaluwarsa. Data demo tidak masuk indeks publik atau analytics produksi.

**Produksi, desain awal:** CMS dan/atau n8n existing → sumber publikasi yang disepakati → adapter → halaman. Stack rendering, endpoint, authentication, caching, dan deployment TBD bersama engineering. Prototipe tidak memerlukan koneksi live.

### Data Contract

| Entitas | Field minimum |
|---|---|
| Zodiac | slug, name, symbol/asset, dateRangeStart, dateRangeEnd, element, profile |
| Forecast | id, zodiacSlug, period, periodStart, periodEnd, summary, sections, author, publishedAt, updatedAt, status |
| EditorialArticle | id, title, url, publishedAt, image opsional, kategori/tanda terkait |
| PageConfig | locale, timezone, referenceDate untuk demo, publisher, baseUrl per environment |

Enum period: today, tomorrow, week, month, year. sections berisi key, heading, dan body; field kosong tidak menghasilkan heading kosong. Nilai status diterjemahkan adapter menjadi published, unavailable, atau draft; draft tidak dirender ke pembaca. Struktur respons asli CMS/n8n masih TBD.

### Waktu, Pembaruan, dan Integrasi

- Rekomendasi zona waktu: Asia/Jakarta; minggu Senin–Minggu. Kedua keputusan dapat dikonfigurasi dan perlu dikonfirmasi PM/editorial sebelum produksi.
- Periode berlaku terpisah dari waktu publikasi/pembaruan. Konten besok dapat diterbitkan hari ini tanpa membuat updatedAt berada di masa depan.
- Saat tanggal berganti, pilih record periode baru; jangan sekadar mengganti tanggal pada isi lama.
- Title direktori mengikuti pola “Ramalan Zodiak Hari Ini, {tanggal}” untuk hari aktif; label “Diperbarui” mengikuti pembaruan data aktual. Bila tidak ada ramalan aktif, tampilkan status ketersediaan yang jelas.
- Uji pergantian hari, minggu, bulan, tahun, serta rentang minggu lintas bulan/tahun.
- Rekomendasi identitas konten: tanda + jenis periode + tanggal awal periode. Retry workflow harus memperbarui record yang sama, bukan membuat duplikasi.
- Sebelum integrasi, PM/engineering menetapkan sumber otoritatif, prioritas CMS vs n8n bila keduanya tersedia, jadwal publish, dan aturan invalidasi cache.

### SEO / GEO dan Structured Data

Persyaratan berikut adalah keputusan implementasi untuk mendukung kesiapan produksi, bukan jaminan ranking.

| Area | Requirement |
|---|---|
| HTML dan navigasi | Teks utama tersedia di HTML; internal link memakai href; title dan deskripsi sesuai tanda/periode |
| Canonical | Setiap halaman periode memiliki canonical sendiri; jangan canonical-kan semua periode ke hari ini. Domain produksi TBD, tidak memakai domain rekaan |
| Direktori | JSON-LD CollectionPage + ItemList berisi 12 tanda dan URL + BreadcrumbList sesuai navigasi [R3] |
| Detail | Article + BreadcrumbList; headline sesuai H1, author/publisher faktual, datePublished/dateModified sesuai record, image jika tersedia, mainEntityOfPage sesuai URL [R2] |
| Periode | Tampilkan rentang berlaku sebagai teks; pertahankan dalam data. Jangan mengganti datePublished atau dateModified dengan tanggal ramalan |
| Konsistensi | JSON-LD sesuai konten terlihat; tidak membuat penulis, gambar, atau waktu pembaruan fiktif pada produksi |
| Preview | Lingkungan validation menggunakan noindex; jangan masukkan fixture/demo ke sitemap produksi |
| Produksi | Audit HTTP status, canonical, sitemap, crawl access, dan penghapusan noindex pada halaman yang siap dipublikasikan; kebijakan halaman kosong TBD bersama SEO |

Konten menggunakan ringkasan di awal, heading deskriptif, identitas penulis, dan periode yang jelas. Ini mendukung keterbacaan dan pemahaman informasi. Klaim dalam dokumen awal tentang tren query “besok” dan fitur yang tidak dimiliki kompetitor belum diverifikasi; keduanya diperlakukan sebagai hipotesis, bukan bukti business case.

### Tracking

Provider analytics produksi TBD. Pada prototipe, event masuk ke collector lokal yang dapat diperiksa tanpa mengirim ke properti produksi. Dokumentasikan pemicu dan payload; cegah pemasangan listener ganda.

| Event | Pemicu | Parameter khusus |
|---|---|---|
| zodiac_page_view | Halaman aktif selesai dirender, sekali per navigasi | page_type, zodiac bila detail, period bila detail |
| zodiac_select | Klik kartu atau sign switcher | target_zodiac, source: grid/switcher |
| zodiac_finder_submit | Submit finder | result: valid/invalid; error_type bila invalid |
| zodiac_finder_result_click | Klik CTA hasil | target_zodiac |
| zodiac_period_select | Klik link periode | from_period, to_period, zodiac |
| zodiac_article_click | Klik artikel terbaru/evergreen/terkait | article_id, section, position |
| zodiac_content_state | State kosong/gagal/kedaluwarsa terlihat | state, zodiac, period |

Parameter umum: event_name, page_path, timestamp, environment. Jangan merekam tanggal/bulan lahir, isi field mentah, atau query string yang berpotensi memuat data pribadi. Provider produksi harus mengikuti consent dan kebijakan tracking website existing.

### Security & Privacy

Finder diproses lokal; tidak meminta identitas atau menyimpan tanggal lahir. Sanitasi konten CMS sebelum dirender dan batasi protokol tautan yang diizinkan. Jangan menaruh API key, webhook rahasia n8n, atau credential CMS di HTML/JavaScript publik. Keputusan autentikasi dan akses API dibuat saat integrasi produksi.

### Validation & Handoff

Acceptance criteria wajib diperiksa sebelum sesi pengguna. Rekomendasi pengujian:

1. **Fungsional:** seluruh 61 rute, refresh/deep link, Back/Forward, link aktif, switcher, serta URL invalid.
2. **Finder:** seluruh batas awal/akhir tanda, input kosong, 29 Februari, tanggal tidak valid, dan pergantian tahun.
3. **Konten:** seluruh lima periode, record kedaluwarsa, artikel kosong, respons gagal, waktu pembaruan, dan boundary kalender.
4. **Tampilan:** viewport yang ditetapkan, keyboard, kontras, zoom 200%, serta pemeriksaan di Chrome dan Safari bila tersedia.
5. **Metadata dan tracking:** HTML/JSON-LD cocok dengan konten, payload sesuai tabel, dan tidak ada tanggal lahir terkirim.

Validation pengguna menguji tiga tugas: cari zodiak dari tanggal lahir; baca ramalan besok lalu minggu ini; pindah ke tanda lain tanpa kehilangan periode. Tambahkan satu tugas masuk langsung ke detail dan menjelaskan periode yang sedang dibaca. Ukur penyelesaian tanpa bantuan, kesalahan navigasi, dan pemahaman tanggal.

Handoff berisi source prototipe, fixture, instruksi menjalankan server, peta rute, event dictionary, catatan pemeriksaan, serta daftar temuan dan keputusan TBD. Prototipe siap validation jika seluruh alur utama berjalan dan tidak ada bug yang menghalangi tugas; kelayakan produksi tetap melalui integrasi dan QA tersendiri.

## 5. Risks & Roadmap

### Phased Rollout

| Tahap | Scope | Exit criteria |
|---|---|---|
| MVP — Page development | Direktori, finder, 12 tanda × seluruh 5 periode, responsif, fixture, metadata, tracking lokal | Seluruh acceptance criteria wajib lolos; working prototype siap validation |
| v1.1 — Validation & iteration | Uji tugas pengguna dan perbaiki masalah struktur, navigasi, keterbacaan, serta state | Temuan blocker diselesaikan; keputusan desain dan integrasi tercatat |
| v2.0 — Production integration | Hubungkan sumber konten existing, analytics, SEO deployment, dan monitoring | Konten terverifikasi, integrasi dan QA produksi lolos; persetujuan rilis oleh owner |

Semua periode masuk MVP. Versi berikutnya meningkatkan validasi dan integrasi, tidak menunda periode yang sudah diminta.

### Risks & Dependencies

| Risiko | Dampak | Mitigasi / owner yang disarankan |
|---|---|---|
| Pasokan lima periode belum konsisten | Halaman kosong atau ramalan lama tampil sebagai baru | Kontrak periode dan status; uji fallback; PM + editorial |
| Bentuk data CMS/n8n berbeda | Handoff tertunda atau logika UI perlu diubah | Adapter dan fixture contract; engineering + PM |
| Kalender dan cache tidak sinkron | Judul/isi berbeda periode | Satu zona waktu, boundary tests, invalidasi; engineering |
| Isi tipis/seragam antarperiode | Manfaat halaman dan visibility rendah | Konten relevan per periode, review editorial, audit SEO |
| Preview terindeks atau tercampur analytics | Data palsu dan konten demo terlihat publik | noindex preview dan isolasi tracking; engineering |
| Mapping zodiak berbeda dengan editorial | Finder dan kartu tidak konsisten | Satu tabel konfigurasi disetujui editorial |
| Scope prototipe dianggap siap produksi | Integrasi, keamanan, dan operasi terlewat | Pisahkan gate validation dan gate produksi; PM |

### Keputusan Terbuka

Tidak menghalangi pembuatan prototipe: gunakan fixture dan konfigurasi yang ditandai. Sebelum validation, konfirmasi rentang tanggal zodiak, guideline visual existing, dan materi contoh. Sebelum produksi, tetapkan stack, resource, deadline, API/data owner, jadwal pembaruan, sumber otoritatif CMS/n8n, aturan URL konten kosong/arsip, analytics provider, baseline, serta target bisnis.

### Referensi

- **S1:** Content & Page Architecture (1).md, lampiran pengguna; sumber tujuan dan arsitektur halaman.
- **S2:** Klarifikasi pengguna, 23 Oktober 2026; seluruh periode pada rilis pertama, sumber editorial melalui CMS/n8n existing, output tahap ini prototipe HTML.
- **R1:** Google Search Central — [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features). Fondasi SEO dan batas klaim visibility AI.
- **R2:** Google Search Central — [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article). Identitas artikel dan tanggal publikasi/pembaruan.
- **R3:** Schema.org — [CollectionPage](https://schema.org/CollectionPage). Jenis halaman koleksi.
- **R4:** MDN — [Input date](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date). Nilai input tanggal mencakup tahun, bulan, dan hari.

Referensi web diperiksa 23 Oktober 2026. Context7 tidak digunakan karena tidak tersedia dalam sesi ini.
