import fs from 'node:fs/promises';
const manifest=JSON.parse(await fs.readFile('docs/asset-manifest.json','utf8'));
const aliases=JSON.parse(await fs.readFile('docs/asset-aliases.json','utf8'));
await fs.mkdir('public/assets',{recursive:true});
for(const asset of manifest){
 const target=`public${asset.local}`;
 try{await fs.access(target);}catch{const response=await fetch(asset.source);if(!response.ok)throw new Error(`${asset.alt}: ${response.status}`);await fs.writeFile(target,Buffer.from(await response.arrayBuffer()));}
}
for(const [name,alt] of Object.entries(aliases)){const asset=manifest.find(a=>a.alt===alt);if(!asset)throw new Error(`Missing source: ${alt}`);await fs.copyFile(`public${asset.local}`,`public/assets/${name}.png`);}
console.log(`Verified ${manifest.length} local reference assets and restored aliases. Self-hosted fonts are committed in public/fonts.`);
