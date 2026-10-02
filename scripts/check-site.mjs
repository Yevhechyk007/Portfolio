import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('_site');
const routes = ['/', '/projects/mobile/', '/projects/landings/', '/projects/web-apps/', '/cases/dripply/', '/cases/government-appointment/', '/404.html'];
const titles = new Set();
const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
for (const route of routes) {
  const file = path.join(root, route.endsWith('/') ? route+'index.html' : route);
  const html = fs.readFileSync(file,'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  assert(!titles.has(title), `Duplicate title: ${title}`); titles.add(title);
  assert(html.includes(`rel="canonical" href="https://yiv.netlify.app${route}"`), `Canonical: ${route}`);
  assert.equal((html.match(/<h1\b/g)||[]).length, 1, `One h1: ${route}`);
  assert(!/onclick=|onkeydown=/.test(html), `Inline handlers: ${route}`);
  assert(!html.includes('showCase('), `Old routing: ${route}`);
  const stack=[];
  for (const tag of html.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<(\/)?([a-z][a-z0-9-]*)\b[^>]*>/gi)) {
    const name=tag[2].toLowerCase();
    if(voidTags.has(name)||tag[0].endsWith('/>'))continue;
    if(tag[1])assert.equal(stack.pop(),name,`Unbalanced HTML ${route}: ${tag[0]}`);
    else stack.push(name);
  }
  assert.equal(stack.length,0,`Unclosed HTML: ${route}`);
  for (const match of html.matchAll(/(?:src|srcset|href)="([^"{}]+)"/g)) {
    let url=match[1]; if(!url.startsWith('/'))continue;
    const [pathname,hash]=url.split('#');
    const target=path.join(root, pathname.endsWith('/') ? pathname+'index.html' : pathname);
    assert(fs.existsSync(target),`Missing ${url} on ${route}`);
    if(hash)assert(fs.readFileSync(target,'utf8').includes(`id="${hash}"`),`Missing anchor ${url}`);
  }
  if(route.startsWith('/cases/')) {
    const expected=route.includes('dripply')?12:21;
    const slides=html.match(/<div class="case-slides">([\s\S]*?)<\/div>/)[1];
    assert.equal((slides.match(/<img\b/g)||[]).length,expected,`Slides: ${route}`);
    assert(!slides.match(/<img[^>]+>/)[0].includes('loading="lazy"'),'Hero must load eagerly');
  }
  console.log(`OK ${route}`);
}
console.log('All pages, HTML nesting, metadata, local links and case slides passed.');
