import { test, expect } from '@playwright/test';

test.describe.serial('Tree editor', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Root')).toBeVisible();
  });

  test('should add a new node when Add button is clicked', async ({ page }) => {
    await page.goto('/');
    const oldNodeCount = await page.locator('.node').count();

    const addButton = page.locator('text=Add').first();
    await addButton.click();

    const newNode = page.locator('text=New');
    await expect(newNode).toBeVisible();
    await page.waitForTimeout(2000);
    const nodeCount = await page.locator('.node').count();
    expect(nodeCount).toBeGreaterThan(oldNodeCount);
  });

  test('should update a new node when Edit button is clicked', async ({
    page,
  }) => {
    await page.goto('/');

    const addButton = page
      .locator(`//div[contains(@class, "new")][contains(., "Edit")]`)
      .first();
    await addButton.click();
    await page.waitForTimeout(1000);

    await page.locator('input').fill('abc');
    await page.locator('text=Save').first().click();

    const newNode = page.locator('text=Abc');
    await expect(newNode).toBeVisible();
  });

  test('should delete a new node when Delete button is clicked', async ({
    page,
  }) => {
    await page.goto('/');
    const oldNodeCount = await page.locator('.node').count();

    const addButton = page
      .locator(`//div[contains(@class, "abc")][contains(., "Delete")]`)
      .last();
    await addButton.click({ force: true });
    await page.waitForTimeout(2000);
    const nodeCount = await page.locator('.node').count();
    expect(nodeCount).toBeLessThan(oldNodeCount);
  });
});
