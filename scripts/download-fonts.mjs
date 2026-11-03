import fs from 'node:fs/promises';
for(const [family,name] of [['DM+Serif+Display','dm-serif'],['Plus+Jakarta+Sans:wght@200..800','jakarta'],['DM+Sans:wght@100..1000','dm-sans']]) {
 const response=await fetch(`https://fonts.googleapis.com/css2?family=${family}&display=swap`,{headers:{'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}});
 const css=await response.text(),url=Array.from(css.matchAll(/url\(([^)]+)\)/g)).at(-1)?.[1];
 if(!url)throw new Error(name+': no font');const font=await fetch(url);if(!font.ok)throw new Error(name+': download failed');await fs.writeFile(`public/fonts/${name}.woff2`,Buffer.from(await font.arrayBuffer()));await fs.writeFile(`docs/font-${name}.css`,css);
}
console.log('Downloaded the three original font families.');
