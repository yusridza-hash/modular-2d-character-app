import {create} from 'zustand';
import {Asset,ComicPanel,DEFAULT_POSE,Expression,Instance} from './types';
const newId=()=>crypto.randomUUID();
const demoAssets:Asset[]=[
{id:'arlo',name:'Arlo (sample rig)',kind:'character'},
{id:'unma',name:'Unma (sample rig)',kind:'character'},
{id:'bako',name:'Bako (sample rig)',kind:'character'},
{id:'tree',name:'Tree (sample)',kind:'prop'}
];
type State={assets:Asset[];panels:ComicPanel[];active:string;selected?:string;history:ComicPanel[][];future:ComicPanel[][];
addAsset:(asset:Asset)=>void;addPanel:()=>void;selectPanel:(id:string)=>void;select:(id?:string)=>void;
drop:(id:string,x:number,y:number)=>void;update:(id:string,patch:Partial<Instance>)=>void;remove:()=>void;setBackground:(url:string)=>void;undo:()=>void;redo:()=>void;load:(panels:ComicPanel[])=>void;};
const start:ComicPanel={id:'panel-1',name:'Panel 01',objects:[]};
export const useStudio=create<State>((set,get)=>({
assets:demoAssets,panels:[start],active:start.id,selected:undefined,history:[],future:[],
addAsset:asset=>set(s=>({assets:[...s.assets,asset]})),
addPanel:()=>set(s=>{const p={id:newId(),name:'Panel '+String(s.panels.length+1).padStart(2,'0'),objects:[]};return {...saveHistory(s),panels:[...s.panels,p],active:p.id,selected:undefined}}),
selectPanel:id=>set({active:id,selected:undefined}),select:id=>set({selected:id}),
drop:(id,x,y)=>set(s=>{const a=s.assets.find(a=>a.id===id);if(!a)return s;if(a.kind==='background')return s;const object:Instance={id:newId(),assetId:id,x,y,scale:1,rotation:0,expression:'neutral',pose:{...DEFAULT_POSE},layer:s.panels.find(p=>p.id===s.active)?.objects.length||0,tint:0,shadow:true};return {...saveHistory(s),panels:s.panels.map(p=>p.id===s.active?{...p,objects:[...p.objects,object]}:p),selected:object.id}}),
update:(id,patch)=>set(s=>({...saveHistory(s),panels:s.panels.map(p=>p.id===s.active?{...p,objects:p.objects.map(o=>o.id===id?{...o,...patch}:o)}:p)})),
remove:()=>set(s=>({...saveHistory(s),panels:s.panels.map(p=>p.id===s.active?{...p,objects:p.objects.filter(o=>o.id!==s.selected)}:p),selected:undefined})),
setBackground:url=>set(s=>({...saveHistory(s),panels:s.panels.map(p=>p.id===s.active?{...p,background:url}:p)})),
undo:()=>set(s=>s.history.length?{panels:s.history[s.history.length-1],history:s.history.slice(0,-1),future:[s.panels,...s.future],selected:undefined}:s),
redo:()=>set(s=>s.future.length?{panels:s.future[0],future:s.future.slice(1),history:[...s.history,s.panels],selected:undefined}:s),
load:panels=>set({panels,active:panels[0].id,selected:undefined,history:[],future:[]})
}));
function saveHistory(s:State){return {history:[...s.history.slice(-29),structuredClone(s.panels)],future:[] as ComicPanel[][]};}
export function currentPanel(state:State){return state.panels.find(p=>p.id===state.active)||state.panels[0];}
export function selectedInstance(state:State){return currentPanel(state).objects.find(o=>o.id===state.selected);}
export function expressionColor(e:Expression){return ({neutral:'#667f9a',happy:'#4f987f',shocked:'#d4a24d',angry:'#bd6a6a',sad:'#8785bb'})[e];}
