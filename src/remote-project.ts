import {createClient} from '@supabase/supabase-js';
import {remoteProjectUrl,remotePublicKey} from './cloud-config';
import {validateProject,type LocalProject} from './persistence';

export const remote = remoteProjectUrl && remotePublicKey ? createClient(remoteProjectUrl,remotePublicKey) : null;
export async function login(email:string,password:string){if(!remote)throw Error('Cloud is not configured');const {error}=await remote.auth.signInWithPassword({email,password});if(error)throw error;}
export async function register(email:string,password:string){if(!remote)throw Error('Cloud is not configured');const {error}=await remote.auth.signUp({email,password});if(error)throw error;}
export async function logout(){if(!remote)return;const {error}=await remote.auth.signOut();if(error)throw error;}
export async function getUser(){if(!remote)return null;const {data,error}=await remote.auth.getUser();if(error)throw error;return data.user;}
export async function saveRemote(data:LocalProject,name='My Comic'){
if(!remote)throw Error('Cloud is not configured');const user=await getUser();if(!user)throw Error('Please sign in');
const {data:existing,error:findError}=await remote.from('comic_projects').select('id').eq('owner_id',user.id).eq('name',name).limit(1).maybeSingle();if(findError)throw findError;
let id=existing?.id;if(!id){const {data:created,error}=await remote.from('comic_projects').insert({owner_id:user.id,name}).select('id').single();if(error)throw error;id=created.id;}
const path=[user.id,id,'project.json'].join('/');const {error}=await remote.storage.from('comic-assets').upload(path,new Blob([JSON.stringify(data)],{type:'application/json'}),{upsert:true,contentType:'application/json'});if(error)throw error;return id;
}
export async function loadRemote(name='My Comic'):Promise<LocalProject|null>{
if(!remote)throw Error('Cloud is not configured');const user=await getUser();if(!user)throw Error('Please sign in');
const {data:existing,error:findError}=await remote.from('comic_projects').select('id').eq('owner_id',user.id).eq('name',name).limit(1).maybeSingle();if(findError)throw findError;if(!existing)return null;
const path=[user.id,existing.id,'project.json'].join('/');const {data,error}=await remote.storage.from('comic-assets').download(path);if(error)throw error;
const parsed:unknown=JSON.parse(await data.text());if(!validateProject(parsed))throw Error('Invalid cloud project format');return parsed;
}
