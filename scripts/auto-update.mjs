#!/usr/bin/env node
// Opt-in per-user updater for a Git-installed demo-ui-design skill.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const expectedRemote='https://github.com/jensen1993/demo-ui-design';
const scriptPath=fileURLToPath(import.meta.url);
const target=path.resolve(path.dirname(scriptPath),'..');
const id=crypto.createHash('sha256').update(target).digest('hex').slice(0,12);
const label=`com.jensen1993.demo-ui-design.${id}`;
const state=path.join(os.homedir(),'.demo-ui-design-updater');
const configPath=path.join(state,`${id}.json`);
const logPath=path.join(state,`${id}.log`);
const env={...process.env,GIT_TERMINAL_PROMPT:'0'};
const xml=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
function log(message){fs.mkdirSync(state,{recursive:true});const line=`${new Date().toISOString()} ${message}\n`;fs.appendFileSync(logPath,line);console.log(line.trim());}
function git(exe,args,dir=target){return execFileSync(exe,['-C',dir,...args],{encoding:'utf8',env,stdio:['ignore','pipe','pipe']}).trim();}
function findGit(){const exe=process.platform==='win32'?'where.exe':'which';return execFileSync(exe,['git'],{encoding:'utf8'}).trim().split(/\r?\n/)[0];}
export function verifyAndUpdate(dir,gitExe,remote=expectedRemote){
 const root=git(gitExe,['rev-parse','--show-toplevel'],dir);
 if(fs.realpathSync(root)!==fs.realpathSync(dir)) throw new Error('Target is not the root of its own Git checkout.');
 const actual=git(gitExe,['remote','get-url','origin'],dir).replace(/\.git\/?$/,'').replace(/\/$/,'');
 if(actual!==remote.replace(/\.git\/?$/,'').replace(/\/$/,'')) throw new Error('Origin is not the expected repository.');
 if(git(gitExe,['branch','--show-current'],dir)!=='main') throw new Error('Checkout is not on main.');
 if(git(gitExe,['status','--porcelain','--untracked-files=all','--ignored'],dir)) throw new Error('Checkout contains local, untracked or ignored changes; refusing to update.');
 const before=git(gitExe,['rev-parse','HEAD'],dir);
 git(gitExe,['pull','--ff-only','origin','main'],dir);
 const after=git(gitExe,['rev-parse','HEAD'],dir);
 return {before,after};
}
function run(){
 const action=process.argv[2];
 if(action==='update'){
  const config=JSON.parse(fs.readFileSync(configPath,'utf8'));
  if(config.target!==target||config.version!==1) throw new Error('Invalid updater configuration.');
  const result=verifyAndUpdate(target,config.git);
  log(result.before===result.after?`Already current: ${result.after}`:`Updated ${result.before} -> ${result.after}. Restart the AI tool or start a new session if needed.`);
  return;
 }
 if(action==='install'){
  if(fs.existsSync(configPath)) throw new Error('Updater is already configured for this path; uninstall it first.');
  const gitExe=findGit();
  const root=git(gitExe,['rev-parse','--show-toplevel']);
  if(fs.realpathSync(root)!==fs.realpathSync(target)) throw new Error('Skill must be installed as its own Git checkout.');
  const remote=git(gitExe,['remote','get-url','origin']).replace(/\.git\/?$/,'').replace(/\/$/,'');
  if(remote!==expectedRemote) throw new Error('Origin is not the expected GitHub repository.');
  if(git(gitExe,['branch','--show-current'])!=='main') throw new Error('Checkout must be on main.');
  if(git(gitExe,['status','--porcelain','--untracked-files=all','--ignored'])) throw new Error('Checkout has local changes; no task was installed.');
  fs.mkdirSync(state,{recursive:true});
  const config={version:1,target,git:gitExe};
  if(process.platform==='darwin'){
   const dir=path.join(os.homedir(),'Library','LaunchAgents'); fs.mkdirSync(dir,{recursive:true});
   const plist=path.join(dir,`${label}.plist`);
   if(fs.existsSync(plist)) throw new Error('LaunchAgent already exists; refusing to replace it.');
   const data=`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>Label</key><string>${xml(label)}</string><key>ProgramArguments</key><array><string>${xml(process.execPath)}</string><string>${xml(scriptPath)}</string><string>update</string></array><key>StartCalendarInterval</key><dict><key>Hour</key><integer>10</integer><key>Minute</key><integer>0</integer></dict><key>StandardOutPath</key><string>${xml(logPath)}</string><key>StandardErrorPath</key><string>${xml(logPath)}</string></dict></plist>\n`;
   fs.writeFileSync(plist,data,{flag:'wx'}); fs.writeFileSync(configPath,JSON.stringify(config),{flag:'wx'});
   try{execFileSync('/bin/launchctl',['bootstrap',`gui/${process.getuid()}`,plist],{stdio:'pipe'});}catch(e){fs.unlinkSync(plist);fs.unlinkSync(configPath);throw e;}
  } else if(process.platform==='win32'){
   const taskName=`DemoUIDesign-${id}`;
   try{execFileSync('schtasks.exe',['/Query','/TN',taskName],{stdio:'pipe'});throw new Error('Scheduled task already exists; refusing to replace it.');}catch(e){if(e.message.startsWith('Scheduled task'))throw e;}
   const command=`"${process.execPath}" "${scriptPath}" update`;
   fs.writeFileSync(configPath,JSON.stringify(config),{flag:'wx'});
   try{execFileSync('schtasks.exe',['/Create','/SC','DAILY','/ST','10:00','/TN',taskName,'/TR',command],{stdio:'pipe'});}catch(e){fs.unlinkSync(configPath);throw e;}
  } else throw new Error('Automatic scheduling supports macOS and Windows only.');
  log(`Installed daily 10:00 task for ${target}; log: ${logPath}`);
  return;
 }
 if(action==='uninstall'){
  if(!fs.existsSync(configPath)) throw new Error('No updater is configured for this path.');
  const config=JSON.parse(fs.readFileSync(configPath,'utf8'));
  if(config.target!==target||config.version!==1)throw new Error('Invalid updater configuration.');
  if(process.platform==='darwin'){
   const plist=path.join(os.homedir(),'Library','LaunchAgents',`${label}.plist`);
   if(!fs.existsSync(plist))throw new Error('LaunchAgent file missing; no changes made.');
   execFileSync('/bin/launchctl',['bootout',`gui/${process.getuid()}/${label}`],{stdio:'pipe'});
   fs.unlinkSync(plist);
  }else if(process.platform==='win32')execFileSync('schtasks.exe',['/Delete','/TN',`DemoUIDesign-${id}`,'/F'],{stdio:'pipe'});
  else throw new Error('Unsupported OS.');
  fs.unlinkSync(configPath);log(`Removed scheduled updater for ${target}. Skill files were kept.`);return;
 }
 console.error('Usage: node scripts/auto-update.mjs install|update|uninstall');process.exitCode=2;
}
if(process.argv[1]&&fs.realpathSync(process.argv[1])===fs.realpathSync(scriptPath)){try{run();}catch(e){try{log(`ERROR: ${e.message}`);}catch{console.error(e.message);}process.exitCode=1;}}
