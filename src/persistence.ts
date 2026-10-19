import type {Asset,ComicPanel} from './types';
export interface LocalProject {format:'modular-2d-comic-project';version:1;assets:Asset[];panels:ComicPanel[];}
const DB_NAME='modular-2d-studio-local';const STORE='projects';const KEY='current';
function connect():Promise<IDBDatabase>{
return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);
req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE)};
req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
}
export async function saveLocalProject(project:LocalProject):Promise<void>{
const db=await connect();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(project,KEY);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}finally{db.close()}}
export async function loadLocalProject():Promise<LocalProject|undefined>{
const db=await connect();try{return await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).get(KEY);req.onsuccess=()=>resolve(req.result as LocalProject|undefined);req.onerror=()=>reject(req.error)})}finally{db.close()}}
export function validateProject(v:unknown):v is LocalProject{
if(!v||typeof v!=='object')return false;
const d=v as Partial<LocalProject>;return d.format==='modular-2d-comic-project'&&d.version===1&&Array.isArray(d.assets)&&Array.isArray(d.panels)&&d.panels.length>0&&d.panels.every(p=>typeof p.id==='string'&&Array.isArray(p.objects))&&d.assets.every(a=>typeof a.id==='string'&&typeof a.kind==='string');}
