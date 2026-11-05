import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {verifyAndUpdate} from './auto-update.mjs';
const git=process.env.TEST_GIT || 'git';
const cmd=(dir,...args)=>execFileSync(git,['-C',dir,...args],{encoding:'utf8',stdio:'pipe'}).trim();
function fixture(){
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'skill-update-test-'));
 const seed=path.join(tmp,'seed'),remote=path.join(tmp,'remote.git'),client=path.join(tmp,'client');
 fs.mkdirSync(seed);cmd(seed,'init','-b','main');cmd(seed,'config','user.name','Test');cmd(seed,'config','user.email','test@example.invalid');
 fs.writeFileSync(path.join(seed,'SKILL.md'),'v1\n');cmd(seed,'add','SKILL.md');cmd(seed,'commit','-m','initial');
 execFileSync(git,['clone','--bare',seed,remote],{stdio:'pipe'});execFileSync(git,['clone',remote,client],{stdio:'pipe'});
 return {tmp,seed,remote,client,cleanup:()=>fs.rmSync(tmp,{recursive:true,force:true})};
}
test('updates a clean checkout from its verified remote',()=>{const f=fixture();try{
 fs.writeFileSync(path.join(f.seed,'SKILL.md'),'v2\n');cmd(f.seed,'commit','-am','new');cmd(f.seed,'push',f.remote,'main');
 const r=verifyAndUpdate(f.client,git,f.remote);assert.notEqual(r.before,r.after);assert.equal(fs.readFileSync(path.join(f.client,'SKILL.md'),'utf8'),'v2\n');
}finally{f.cleanup();}});
test('refuses local changes without overwriting them',()=>{const f=fixture();try{
 fs.writeFileSync(path.join(f.client,'SKILL.md'),'mine\n');assert.throws(()=>verifyAndUpdate(f.client,git,f.remote),/local, untracked or ignored/);assert.equal(fs.readFileSync(path.join(f.client,'SKILL.md'),'utf8'),'mine\n');
}finally{f.cleanup();}});
test('refuses untracked and ignored files',()=>{for(const ignored of [false,true]){const f=fixture();try{
 if(ignored){fs.appendFileSync(path.join(f.client,'.git','info','exclude'),'private.tmp\n');}
 fs.writeFileSync(path.join(f.client,'private.tmp'),'private');assert.throws(()=>verifyAndUpdate(f.client,git,f.remote),/local, untracked or ignored/);
}finally{f.cleanup();}}});
test('refuses an unexpected remote and non-main branch',()=>{const f=fixture();try{
 assert.throws(()=>verifyAndUpdate(f.client,git,'/unexpected'),/Origin/);
 cmd(f.client,'checkout','-b','local');assert.throws(()=>verifyAndUpdate(f.client,git,f.remote),/not on main/);
}finally{f.cleanup();}});
test('network/remote failure leaves checked-out files intact',()=>{const f=fixture();try{
 fs.renameSync(f.remote,`${f.remote}.offline`);assert.throws(()=>verifyAndUpdate(f.client,git,f.remote));assert.equal(fs.readFileSync(path.join(f.client,'SKILL.md'),'utf8'),'v1\n');
}finally{f.cleanup();}});

test('refuses divergent history without overwriting local commit',()=>{const f=fixture();try{
 cmd(f.client,'config','user.name','Test');cmd(f.client,'config','user.email','test@example.invalid');
 fs.writeFileSync(path.join(f.client,'SKILL.md'),'local commit\n');cmd(f.client,'commit','-am','local');
 fs.writeFileSync(path.join(f.seed,'SKILL.md'),'remote commit\n');cmd(f.seed,'commit','-am','remote');cmd(f.seed,'push',f.remote,'main');
 assert.throws(()=>verifyAndUpdate(f.client,git,f.remote));assert.equal(fs.readFileSync(path.join(f.client,'SKILL.md'),'utf8'),'local commit\n');
}finally{f.cleanup();}});
test('direct invocation runs CLI even through a symlinked path',{skip:process.platform==='win32'},()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'skill-cli-test-'));
 try{
  const link=path.join(tmp,'auto-update-link.mjs');fs.symlinkSync(path.join(path.dirname(fileURLToPath(import.meta.url)),'auto-update.mjs'),link);
  const result=execFileSync(process.execPath,[link,'invalid'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
  assert.fail(`Expected usage failure, got ${result}`);
 }catch(e){assert.equal(e.status,2);assert.match(String(e.stderr),/Usage:/);}
 finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
