#!/usr/bin/env node
// Encrypts the opportunity dashboard so it can sit on the public site behind a password.
//
//   DASHBOARD_PASSWORD=... node scripts/encrypt-dashboard.mjs <dashboard.html> <out.html>
//
// The page is encrypted with AES-256-GCM using a key derived from the password
// (PBKDF2-SHA256, 600,000 iterations). The published file holds only ciphertext:
// without the password there is nothing readable in it. The browser decrypts it
// locally with the Web Crypto API after the visitor types the password.
import { webcrypto as crypto } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [src, out] = process.argv.slice(2);
const password = process.env.DASHBOARD_PASSWORD;
if (!src || !out) throw new Error('usage: encrypt-dashboard.mjs <dashboard.html> <out.html>');
if (!password) throw new Error('DASHBOARD_PASSWORD is not set');

const ITER = 600000;
const b64 = buf => Buffer.from(buf).toString('base64');
const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base,
  { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(readFileSync(src, 'utf8')));
const payload = JSON.stringify({ s: b64(salt), i: b64(iv), c: b64(ct), n: ITER });

const page = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>ADTC Opportunities</title>
<link rel="icon" href="../favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
<style>
:root{--crimson:#A51C30;--ink:#2B2B2B;--body:#4A4540;--cap:#6B6560;--paper:#F4F2EF;--white:#fff;--silver:#C9BFBB;color-scheme:light}
*{box-sizing:border-box;border-radius:0}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--paper);color:var(--body);font:500 15px/1.5 Archivo,system-ui,sans-serif;padding:24px 16px}
main{width:100%;max-width:440px;border-top:2px solid var(--ink);padding-top:18px}
.mono{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;text-transform:uppercase;letter-spacing:.1em;color:var(--cap)}
h1{font-weight:800;text-transform:uppercase;letter-spacing:-.04em;line-height:.95;color:var(--ink);font-size:40px;margin:10px 0 12px}
h1 em{font-style:normal;color:var(--crimson)}
form{display:flex;gap:8px;margin-top:18px}
input{flex:1;font:500 15px Archivo,sans-serif;padding:10px 12px;border:1px solid var(--silver);background:var(--white);color:var(--ink);min-width:0}
input:focus-visible,button:focus-visible{outline:2px solid var(--ink);outline-offset:1px}
button{font:700 12px Archivo,sans-serif;text-transform:uppercase;letter-spacing:.06em;padding:10px 16px;border:2px solid var(--crimson);background:var(--crimson);color:#fff;cursor:pointer}
button:disabled{opacity:.6;cursor:wait}
#msg{min-height:22px;margin-top:10px;color:var(--crimson)}
a{color:var(--ink)}
</style></head><body><main>
<div class="mono">HBS Automation &amp; Deep Tech Club</div>
<h1>Physical AI <em>opportunities</em></h1>
<p>Open roles at physical AI and deep tech startups, scored for fit with ADTC members. This page is for club members. Ask a club officer for the password.</p>
<form id="f"><label class="mono" for="pw" style="position:absolute;left:-9999px">Password</label>
<input id="pw" type="password" autocomplete="current-password" placeholder="Password" required autofocus>
<button id="go" type="submit">Unlock</button></form>
<div id="msg" role="status" aria-live="polite"></div>
<p class="mono"><a href="../">Back to the club site</a></p>
</main>
<script>
const P=${payload};
const d=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
document.getElementById("f").addEventListener("submit",async e=>{e.preventDefault();
const go=document.getElementById("go"),msg=document.getElementById("msg");go.disabled=true;msg.textContent="Unlocking…";
try{const b=await crypto.subtle.importKey("raw",new TextEncoder().encode(document.getElementById("pw").value),"PBKDF2",false,["deriveKey"]);
const k=await crypto.subtle.deriveKey({name:"PBKDF2",salt:d(P.s),iterations:P.n,hash:"SHA-256"},b,{name:"AES-GCM",length:256},false,["decrypt"]);
const html=new TextDecoder().decode(await crypto.subtle.decrypt({name:"AES-GCM",iv:d(P.i)},k,d(P.c)));
document.open();document.write(html);document.close();}
catch(err){go.disabled=false;msg.textContent="That password didn't work. Check it and try again.";}});
</script></body></html>
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, page);
console.log(`wrote ${out} (${(page.length / 1024).toFixed(0)} KB, encrypted)`);
