#!/usr/bin/env node
// Evaluate measurements supplied by an actual browser. This does not inspect or change a page.
import fs from 'node:fs';
const filename = process.argv[2];
if (!filename) { console.error('Usage: node audit-layout.mjs measurements.json'); process.exit(2); }
let data;
try { data=JSON.parse(fs.readFileSync(filename,'utf8')); } catch(e) { console.error('Unable to read JSON:',e.message); process.exit(2); }
const findings=[], checks=[];
function rect(r){return r && ['left','top','right','bottom'].every(k=>Number.isFinite(r[k])) && r.right>=r.left && r.bottom>=r.top;}
function add(type,name,pass,detail){checks.push({type,name,status:pass?'pass':'review',detail});if(!pass)findings.push({type,name,detail});}
if (!Number.isFinite(data.viewportWidth) || data.viewportWidth<=0 || !Number.isFinite(data.viewportHeight) || data.viewportHeight<=0) { console.error('viewportWidth and viewportHeight must be positive numbers'); process.exit(2); }
if (Number.isFinite(data.documentWidth)) add('page-overflow','document',data.documentWidth<=data.viewportWidth+2,`document ${data.documentWidth}px, viewport ${data.viewportWidth}px (tolerance 2px)`);
for (const h of data.headings||[]) {
 if(!rect(h.group)||!rect(h.title)||!rect(h.action)){console.error('Invalid heading rectangles:',h.name);process.exit(2)}
 const g=h.group,a=h.action,t=h.title;
 const center=Math.abs((a.top+a.bottom-g.top-g.bottom)/2), top=Math.abs(a.top-t.top);
 const within=a.left>=g.left-2&&a.right<=g.right+2&&a.top>=g.top-2&&a.bottom<=g.bottom+2;
 add('heading-action',h.name||'heading',within&&(center<=12||top<=8),`within group: ${within}; center delta ${center.toFixed(1)}px (≤12) or title-top delta ${top.toFixed(1)}px (≤8)`);
}
for (const g of data.groups||[]) {
 if(!rect(g.container)||!Array.isArray(g.items)||g.items.some(i=>!rect(i.rect))){console.error('Invalid group rectangles:',g.name);process.exit(2)}
 const visible=g.items.filter(i=>i.visible!==false), c=g.container;
 for(const i of visible){const r=i.rect;add('group-edge',`${g.name}/${i.name}`,r.left>=c.left-2&&r.right<=c.right+2&&r.top>=c.top-2&&r.bottom<=c.bottom+2,`item [${r.left},${r.top},${r.right},${r.bottom}] within container [${c.left},${c.top},${c.right},${c.bottom}], tolerance 2px`);}
 for(let i=0;i<visible.length;i++) for(let j=i+1;j<visible.length;j++){
  const a=visible[i],b=visible[j],x=Math.min(a.rect.right,b.rect.right)-Math.max(a.rect.left,b.rect.left),y=Math.min(a.rect.bottom,b.rect.bottom)-Math.max(a.rect.top,b.rect.top);
  if(x>0&&y>0) add('group-overlap',`${g.name}/${a.name} & ${b.name}`,false,`overlap ${x.toFixed(1)} × ${y.toFixed(1)} CSS px`);
 }
 const rows=[];
 for(const i of visible){let row=rows.find(x=>{const a=x[0].rect,b=i.rect;const overlap=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);return overlap>0.5*Math.min(a.bottom-a.top,b.bottom-b.top)}); if(!row){row=[];rows.push(row)} row.push(i);}
 for(const row of rows){row.sort((a,b)=>a.rect.left-b.rect.left);if(row.length<2)continue;
  const widths=row.map(i=>i.rect.right-i.rect.left), heights=row.map(i=>i.rect.bottom-i.rect.top), tops=row.map(i=>i.rect.top), gaps=row.slice(1).map((i,k)=>i.rect.left-row[k].rect.right);
  add('group-alignment',g.name,Math.max(...tops)-Math.min(...tops)<=2,`row top spread ${(Math.max(...tops)-Math.min(...tops)).toFixed(1)}px (≤2)`);
  if(g.equalSize!==false){add('group-size',g.name,Math.max(...widths)-Math.min(...widths)<=2&&Math.max(...heights)-Math.min(...heights)<=2,`width spread ${(Math.max(...widths)-Math.min(...widths)).toFixed(1)}px; height spread ${(Math.max(...heights)-Math.min(...heights)).toFixed(1)}px (≤2)`);}
  if(gaps.length>1)add('group-gap',g.name,Math.max(...gaps)-Math.min(...gaps)<=4,`gaps: ${gaps.map(x=>x.toFixed(1)).join(', ')}px; spread ≤4px`);
 }
}
for(const i of data.touchTargets||[]){if(!rect(i.rect)){console.error('Invalid touch target:',i.name);process.exit(2)}const w=i.rect.right-i.rect.left,h=i.rect.bottom-i.rect.top;add('touch-target',i.name,w>=44&&h>=44,`${w.toFixed(1)} × ${h.toFixed(1)} CSS px; demo target ≥44 × 44`);}
if(data.mainTask){if(!rect(data.mainTask.rect)){console.error('Invalid mainTask rect');process.exit(2)}add('main-task-first-screen',data.mainTask.name||'main task',data.mainTask.rect.top<data.viewportHeight,`top ${data.mainTask.rect.top.toFixed(1)}px; viewport height ${data.viewportHeight}px; review only, not a universal requirement`);}
console.log(JSON.stringify({viewport:`${data.viewportWidth}x${data.viewportHeight}`,status:checks.length===0?'incomplete':findings.length?'review':'no-findings-in-supplied-checks',checkCount:checks.length,reviewCount:findings.length,checks,limitations:['Only supplied visible rectangles are checked; all pairs in each supplied group are compared for overlap.','Does not detect visual quality, internal text clipping, color contrast, hidden controls, intentional horizontal-scroll regions, or platform compliance.','Thresholds are fixed demo heuristics, not universal Apple requirements; review justified exceptions manually.']},null,2));
