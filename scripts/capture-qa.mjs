import {chromium} from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const errors=[];
const metrics={};
const page=await browser.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1,reducedMotion:'reduce'});
page.on('pageerror',e=>errors.push(e.message));
for(const [name,url,width] of [['home','/zodiak',1280],['detail','/zodiak/libra',1296],['home-mobile','/zodiak',390],['detail-mobile','/zodiak/libra',390]]) {
 await page.setViewportSize({width,height:900});await page.goto(`http://localhost:3001${url}`);await page.evaluate(()=>document.fonts.ready);
 // Force lazy-loaded images into the capture, then restore scroll position.
 await page.locator('img').evaluateAll(imgs=>imgs.forEach(img=>img.loading='eager'));
 await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
 metrics[name]=await page.evaluate(()=>Object.fromEntries(['h1','.directory-hero','.zodiac-grid','.latest-grid','.detail-hero-paper','.reading-column'].map(selector=>{const el=document.querySelector(selector);if(!el)return [selector,null];const r=el.getBoundingClientRect(),style=getComputedStyle(el);return [selector,{x:r.x,y:r.y+scrollY,width:r.width,height:r.height,font:style.font,fontFamily:style.fontFamily}];})));
 await page.screenshot({path:`docs/qa/${name}.png`,fullPage:true,animations:'disabled'});
}
for(const [source,capture,name,width] of [['docs/references/homepage.png','docs/qa/home.png','home',1280],['docs/references/detail-page.png','docs/qa/detail.png','detail',648]]) {
 const reference=await sharp(source).resize({width}).toBuffer(),actual=await sharp(capture).resize({width}).toBuffer();
 const a=await sharp(reference).metadata(),b=await sharp(actual).metadata();
 await sharp({create:{width:width*2,height:Math.max(a.height,b.height),channels:3,background:'#fdf2f8'}}).composite([{input:reference,left:0,top:0},{input:actual,left:width,top:0}]).png().toFile(`docs/qa/${name}-comparison.png`);
 const regionHeight=name==='home'?440:310;
 await sharp({create:{width:width*2,height:regionHeight,channels:3,background:'#fdf2f8'}}).composite([{input:await sharp(reference).extract({left:0,top:0,width,height:regionHeight}).toBuffer(),left:0,top:0},{input:await sharp(actual).extract({left:0,top:0,width,height:regionHeight}).toBuffer(),left:width,top:0}]).png().toFile(`docs/qa/${name}-hero-comparison.png`);
}
const referenceLatest=await sharp('docs/references/homepage.png').resize({width:1280}).extract({left:40,top:1393,width:1200,height:480}).toBuffer();
const implementationLatest=await sharp('docs/qa/home.png').extract({left:40,top:Math.round(metrics.home['.latest-grid'].y),width:1200,height:480}).toBuffer();
await sharp({create:{width:2400,height:480,channels:3,background:'#fdf2f8'}}).composite([{input:referenceLatest,left:0,top:0},{input:implementationLatest,left:1200,top:0}]).png().toFile('docs/qa/latest-comparison.png');
const dimensions={};for(const name of ['home','detail','home-mobile','detail-mobile']){const data=await sharp(`docs/qa/${name}.png`).metadata();dimensions[name]={width:data.width,height:data.height};}
await fs.writeFile('docs/qa/dimensions.json',JSON.stringify(dimensions,null,2));
await fs.writeFile('docs/qa/metrics.json',JSON.stringify(metrics,null,2));
await fs.writeFile('docs/qa/browser-errors.json',JSON.stringify(errors));
await browser.close();
console.log('Saved desktop/mobile captures, combined reference comparisons, and console results.');
