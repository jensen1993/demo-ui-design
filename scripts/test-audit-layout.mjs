#!/usr/bin/env node
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script=join(dirname(fileURLToPath(import.meta.url)), 'audit-layout.mjs');
const box=(left,top,right,bottom)=>({left,top,right,bottom});
function run(input) {
 const dir=mkdtempSync(join(tmpdir(),'demo-ui-audit-'));
 try {
  const file=join(dir,'input.json'); writeFileSync(file,JSON.stringify(input));
  const result=spawnSync(process.execPath,[script,file],{encoding:'utf8'});
  return {code:result.status, output:result.status===0?JSON.parse(result.stdout):result.stderr};
 } finally { rmSync(dir,{recursive:true,force:true}); }
}
function group(a,b) {return {viewportWidth:390,viewportHeight:844,documentWidth:390,groups:[{name:'cards',container:box(0,0,390,500),items:[{name:'a',rect:a},{name:'b',rect:b}]}]};}
test('detects vertically overlapping cards even in separate rows',()=>{
 const r=run(group(box(0,0,100,100),box(0,80,100,180)));
 assert.equal(r.code,0);assert.ok(r.output.checks.some(c=>c.type==='group-overlap'&&c.status==='review'));
});
test('detects same-row overlap',()=>{
 const r=run(group(box(0,0,100,100),box(90,0,190,100)));
 assert.ok(r.output.checks.some(c=>c.type==='group-overlap'&&c.status==='review'));
});
test('detects contained rectangles',()=>{
 const r=run(group(box(0,0,100,100),box(20,20,80,80)));
 assert.ok(r.output.checks.some(c=>c.type==='group-overlap'&&c.status==='review'));
});
test('accepts touching edges and separated wrapped rows',()=>{
 for(const b of [box(100,0,200,100),box(0,100,100,200),box(0,120,100,220)]) {
  const r=run(group(box(0,0,100,100),b));
  assert.ok(!r.output.checks.some(c=>c.type==='group-overlap'));
 }
});
test('reports page overflow and small touch targets',()=>{
 const r=run({viewportWidth:390,viewportHeight:844,documentWidth:400,touchTargets:[{name:'small',rect:box(0,0,20,20)}]});
 assert.equal(r.output.reviewCount,2);
});
test('empty measurement set cannot imply a complete pass',()=>{
 const r=run({viewportWidth:390,viewportHeight:844});
 assert.equal(r.output.checkCount,0);assert.equal(r.output.reviewCount,0);assert.equal(r.output.status,'incomplete');
});
test('rejects invalid rectangles',()=>{
 const r=run(group(box(0,0,100,100),box(20,20,10,80)));
 assert.equal(r.code,2);
});
