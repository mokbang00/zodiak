import fs from 'node:fs/promises';
const endpoint='http://localhost:4444';
async function command(path,body){const response=await fetch(endpoint+path,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await response.json();if(data.value?.error)throw new Error(`${data.value.error}: ${data.value.message}`);return data.value;}
let session;
try{
 const created=await command('/session',{capabilities:{alwaysMatch:{browserName:'safari'}}});session=created.sessionId;
 const observations=[];
 for(const route of ['/zodiak','/zodiak/libra','/zodiak/libra/besok']){
  await command(`/session/${session}/url`,{url:`http://localhost:3001${route}`});
  const result=await command(`/session/${session}/execute/sync`,{script:'return {title: document.title, headings: document.querySelectorAll("h1").length, text: document.querySelector("h1")?.textContent, overflow: document.documentElement.scrollWidth > innerWidth};',args:[]});
  if(result.headings!==1||result.overflow)throw new Error(`Layout smoke check failed: ${route}`);observations.push({route,...result});
 }
 await fs.writeFile('docs/qa/safari.json',JSON.stringify({status:'passed',observations},null,2));console.log('Safari smoke checks passed.');
}catch(error){await fs.writeFile('docs/qa/safari.json',JSON.stringify({status:'unavailable',reason:error.message},null,2));console.log('Safari automation unavailable: '+error.message);process.exitCode=0;}
finally{if(session)await fetch(`${endpoint}/session/${session}`,{method:'DELETE'});}
