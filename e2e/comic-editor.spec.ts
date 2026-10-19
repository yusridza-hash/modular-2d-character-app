import {test,expect} from '@playwright/test';
test('editor creates a panel and switches static comic expression',async ({page})=>{
 await page.goto('/');
 await expect(page.getByText('Modular 2D Studio')).toBeVisible();
 await page.getByRole('button',{name:'＋',exact:true}).first().click();
 await expect(page.getByText('Arlo (sample rig)').last()).toBeVisible();
 await page.getByRole('button',{name:'shocked'}).click();
 await page.getByRole('button',{name:'＋ Speech bubble'}).click();
 await expect(page.getByText('Dialogue bubbles')).toBeVisible();
 await page.getByRole('button',{name:'Fit',exact:true}).click();
 await page.getByRole('button',{name:'＋',exact:true}).last().click();
 await page.getByRole('button',{name:'Pan',exact:true}).click();
 const canvas=page.locator('.canvaswrap');const box=await canvas.boundingBox();if(box){await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+20,box.y+box.height/2+20);await page.mouse.up();}
 await page.getByRole('button',{name:'Export PNG'}).click();
});
