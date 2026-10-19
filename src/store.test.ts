import {beforeEach,describe,expect,it} from 'vitest';
import {useStudio,currentPanel} from './store';
import {DEFAULT_POSE} from './types';
beforeEach(()=>{useStudio.getState().loadProject([
{id:'arlo',name:'Arlo',kind:'character'}
],[{id:'p1',name:'Panel 1',objects:[]}]);});
describe('comic panel instance independence',()=>{
it('creates an instance from the asset library',()=>{
useStudio.getState().drop('arlo',100,200);
const p=currentPanel(useStudio.getState());
expect(p.objects).toHaveLength(1);
expect(p.objects[0].pose).toEqual(DEFAULT_POSE);
});
it('duplicates an instance without sharing pose state',()=>{
useStudio.getState().drop('arlo',120,220);
useStudio.getState().duplicateSelected();
const p=currentPanel(useStudio.getState());
expect(p.objects).toHaveLength(2);
expect(p.objects[0].id).not.toEqual(p.objects[1].id);
const copy=p.objects[1];
useStudio.getState().update(copy.id,{expression:'shocked',pose:{...copy.pose,head:40}});
const updated=currentPanel(useStudio.getState()).objects;
expect(updated[0].expression).toBe('neutral');
expect(updated[0].pose.head).toBe(0);
expect(updated[1].pose.head).toBe(40);
});
it('duplicates panel with fresh object identifiers',()=>{
useStudio.getState().drop('arlo',40,50);
useStudio.getState().duplicatePanel();
const state=useStudio.getState();
expect(state.panels).toHaveLength(2);
expect(state.panels[0].objects[0].id).not.toBe(state.panels[1].objects[0].id);
});
it('undoes and redoes object placement',()=>{
useStudio.getState().drop('arlo',20,30);
useStudio.getState().undo();
expect(currentPanel(useStudio.getState()).objects).toHaveLength(0);
useStudio.getState().redo();
expect(currentPanel(useStudio.getState()).objects).toHaveLength(1);
});
});