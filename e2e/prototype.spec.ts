import {test,expect} from '@playwright/test';
const signs=['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagitarius','capricorn','aquarius','pisces'];
const suffixes=['','/besok','/minggu-ini','/bulan-ini','/tahun-ini'];
test('all 61 routes serve full content and matching metadata',async({request})=>{
 for(const url of ['/zodiak',...signs.flatMap(s=>suffixes.map(p=>`/zodiak/${s}${p}`))]){
  const response=await request.get(url);expect(response.status(),url).toBe(200);const html=await response.text();expect(html).toContain('noindex');expect(html).toContain('application/ld+json');expect(html).toContain(`href="http://localhost:3001${url}"`);if(url!=='/zodiak'){expect(html).toContain('Karier:');expect(html).toContain('Kesehatan:');}
 }
});
test('invalid signs, periods and extra segments return 404',async({request})=>{
 for(const url of ['/zodiak/ophiuchus','/zodiak/libra/kemarin','/zodiak/libra/besok/extra','/zodiak/sagittarius'])expect((await request.get(url)).status(),url).toBe(404);
});
test('finder validates locally and does not navigate until result CTA',async({page})=>{
 await page.goto('/zodiak');await page.getByRole('button',{name:'Cari Zodiak'}).click();await expect(page.locator('#finder-error')).toHaveText('Pilih tanggal dan bulan lahirmu.');
 await page.getByLabel('Tanggal',{exact:true}).fill('30');await page.getByLabel('Bulan',{exact:true}).selectOption('2');await page.getByRole('button',{name:'Cari Zodiak'}).click();await expect(page.locator('#finder-error')).toHaveText('Tanggal tidak tersedia pada bulan yang dipilih.');
 await page.getByLabel('Tanggal',{exact:true}).fill('29');await page.getByRole('button',{name:'Cari Zodiak'}).click();await expect(page.locator('.finder-result')).toContainText('Pisces');expect(new URL(page.url()).pathname).toBe('/zodiak');
 await page.getByRole('link',{name:/Lihat ramalan/}).click();await expect(page).toHaveURL(/\/zodiak\/pisces$/);
});
test('period navigation and switcher preserve context; back and refresh work',async({page})=>{
 await page.goto('/zodiak/libra');await page.getByRole('link',{name:'Besok',exact:true}).click();await expect(page.locator('h1')).toContainText('30 Oktober 2026');await page.getByRole('link',{name:'Minggu Ini',exact:true}).click();await expect(page).toHaveURL(/minggu-ini$/);
 await page.locator('.switcher-grid').getByRole('link',{name:'Aries',exact:true}).click();await expect(page).toHaveURL(/aries\/minggu-ini$/);await expect(page.locator('.switcher-grid a')).toHaveCount(11);await expect(page.locator('.period-navigation [aria-current]')).toHaveText('Minggu Ini');await page.reload();await expect(page.locator('h1')).toContainText('Aries');await page.goBack();await expect(page.locator('h1')).toContainText('Libra');await page.goForward();await expect(page.locator('h1')).toContainText('Aries');
});
test('content states hide drafts and support retry',async({page})=>{
 for(const scenario of ['unavailable','expired','draft']){await page.goto(`/zodiak/libra?scenario=${scenario}`);await expect(page.getByRole('heading',{name:'Ramalan untuk periode ini belum tersedia.'})).toBeVisible();await expect(page.locator('.reading-section')).toHaveCount(0);await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);}
 await page.goto('/zodiak/libra?scenario=failed');await page.getByRole('button',{name:'Coba lagi'}).click();await expect(page.getByRole('heading',{name:'Asmara: Membuka Ruang Dialog yang Setara'})).toBeVisible();
});
test('empty article feeds preserve navigation and latest summaries',async({page})=>{
 await page.goto('/zodiak?scenario=empty-articles');await expect(page.locator('.zodiac-grid a')).toHaveCount(12);await expect(page.locator('.summary-grid a')).toHaveCount(12);await expect(page.getByRole('heading',{name:'Artikel Seputar Zodiak'})).toHaveCount(0);await page.goto('/zodiak/libra/besok?scenario=empty-articles');await expect(page.locator('.related')).toHaveCount(0);await expect(page.locator('.switcher-grid a')).toHaveCount(11);
});
test('carousel, article previews and keyboard close work',async({page})=>{
 await page.goto('/zodiak');const row=page.locator('.article-carousel');await page.getByRole('button',{name:'Artikel berikutnya'}).click();await expect.poll(()=>row.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);await row.locator('a').first().click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('tracking emits once per navigation, excludes birth data and query strings',async({page})=>{
 await page.goto('/zodiak?secret=private');await page.getByLabel('Tanggal',{exact:true}).fill('29');await page.getByLabel('Bulan',{exact:true}).selectOption('2');await page.getByRole('button',{name:'Cari Zodiak'}).click();await page.getByRole('link',{name:/Lihat ramalan/}).click();await page.getByRole('link',{name:'Besok',exact:true}).click();
 await expect(page).toHaveURL(/pisces\/besok$/);await expect.poll(()=>page.evaluate(()=>(window.__zodiacEvents||[]).filter(e=>e.event_name==='zodiac_page_view').length)).toBe(3);
 const events=await page.evaluate(()=>window.__zodiacEvents||[]);expect(events.filter(e=>e.event_name==='zodiac_page_view')).toHaveLength(3);expect(events.some(e=>e.event_name==='zodiac_finder_submit')).toBe(true);expect(events.some(e=>e.event_name==='zodiac_finder_result_click')).toBe(true);expect(events.some(e=>e.event_name==='zodiac_period_select')).toBe(true);for(const e of events){expect(e.page_path).not.toContain('?');for(const key of Object.keys(e))expect(['day','month','birthDay','birthMonth','query']).not.toContain(key);}expect(await page.evaluate(()=>Object.keys(localStorage))).toHaveLength(0);
});
for(const width of [360,390,768,1024,1440])test(`responsive layout at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});for(const route of ['/zodiak','/zodiak/libra','/zodiak/libra/tahun-ini']){await page.goto(route);await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBe(true);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h1')).toBeVisible();}
});
test('keyboard focus and 200 percent text resize retain functions',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/zodiak');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Langsung ke konten'})).toBeFocused();await page.addStyleTag({content:'html{font-size:200%} body{font-size:200%}'});await page.getByLabel('Tanggal',{exact:true}).fill('21');await page.getByLabel('Bulan',{exact:true}).selectOption('3');await page.getByRole('button',{name:'Cari Zodiak'}).click();await expect(page.locator('.finder-result')).toContainText('Aries');
});
test('rendered pages contain no missing images or console exceptions',async({page})=>{
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));for(const route of ['/zodiak','/zodiak/libra']){await page.goto(route);await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(300);const missing=await page.locator('img').evaluateAll(images=>images.map(el=>el as HTMLImageElement).filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src));expect(missing).toEqual([]);}expect(errors).toEqual([]);
});
test('latest accordion opens the first story and follows hover and keyboard focus',async({page})=>{
 await page.setViewportSize({width:1280,height:900});await page.goto('/zodiak');
 const cards=page.locator('.latest-grid .editorial-card');
 const width=(index:number)=>cards.nth(index).evaluate(el=>el.getBoundingClientRect().width);
 expect(await width(0)).toBeGreaterThan((await width(1))*2);
 await expect(cards.nth(0).locator('img')).toHaveCSS('opacity','1');
 await expect(cards.nth(1).locator('p')).toBeHidden();
 await cards.nth(1).hover();
 await expect.poll(async()=>await width(1)/(await width(0))).toBeGreaterThan(2);
 await expect(cards.nth(1).locator('img')).toHaveCSS('opacity','1');
 await expect(cards.nth(1).locator('p')).toBeVisible();
 await expect(cards.nth(0).locator('p')).toBeHidden();
 await page.mouse.move(0,0);
 await expect(cards.nth(1).locator('img')).toHaveCSS('opacity','1');
 await cards.nth(2).focus();
 await expect.poll(async()=>await width(2)/(await width(1))).toBeGreaterThan(2);
 await expect(cards.nth(2).locator('p')).toBeVisible();
 await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
});
test('latest stories remain directly usable on touch-sized screens',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/zodiak');
 await page.locator('.latest-grid .card-1').click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog')).toContainText('Ketahui bagaimana transit bulan purnama');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('zodiac card reveals characteristics on hover and supports keyboard control',async({page})=>{
 await page.goto('/zodiak/aries');const card=page.locator('.sign-characteristics'),summary=card.locator('summary');
 await expect(card).not.toHaveAttribute('open');await expect(page.locator('.reading-section.profile')).toHaveCount(0);
 await expect(summary).toHaveAccessibleName('Mengenal Karakteristik Aries');await card.hover();
 await expect(card).toHaveAttribute('open','');await expect(card.getByRole('heading',{name:'Mengenal Karakteristik Aries'})).toBeVisible();
 await expect(card).toContainText('Penuh keberanian dan semangat');await page.mouse.move(0,0);await expect(card).not.toHaveAttribute('open');
 await summary.focus();await page.keyboard.press('Enter');await expect(card).toHaveAttribute('open','');
 await page.keyboard.press('Escape');await expect(card).not.toHaveAttribute('open');
 await page.keyboard.press('Space');await expect(card).toHaveAttribute('open','');await page.keyboard.press('Space');await expect(card).not.toHaveAttribute('open');
 await page.goto('/zodiak/pisces/besok');await expect.poll(()=>page.evaluate(()=>(window.__zodiacEvents||[]).some(event=>event.event_name==='zodiac_page_view'&&event.page_path==='/zodiak/pisces/besok'))).toBe(true);await page.locator('.sign-characteristics summary').focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:'Mengenal Karakteristik Pisces'})).toBeVisible();await expect(page.locator('.reading-section.profile')).toHaveCount(0);
});
test('zodiac characteristics toggle by touch without mobile overflow',async({browser})=>{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const page=await context.newPage();
 await page.goto('http://localhost:3001/zodiak/libra');const card=page.locator('.sign-characteristics'),summary=card.locator('summary');
 await summary.tap();await expect(card).toHaveAttribute('open','');await expect(card.getByRole('heading',{name:'Mengenal Karakteristik Libra'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await summary.tap();await expect(card).not.toHaveAttribute('open');await context.close();
});
