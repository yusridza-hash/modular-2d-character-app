import {test,expect} from '@playwright/test';
test('editor creates a panel and switches static comic expression',async ({page})=>{
 await page.goto('/');
 await expect(page.getByText('Modular 2D Studio')).toBeVisible();
 await page.getByRole('button',{name:'＋',exact:true}).first().click();
 await expect(page.getByText('Arlo', {exact:true}).last()).toBeVisible();
 await page.getByRole('button',{name:'shocked'}).click();
 await page.getByRole('button',{name:'＋ Speech bubble'}).click();
 await expect(page.getByText('Dialogue bubbles')).toBeVisible();
 await page.getByRole('button',{name:'Export PNG'}).click();
});
