const { test, expect } = require('@playwright/test');

async function finishQuestions(page) {
  await page.getByRole('button', { name: /open it/i }).click();
  await page.getByRole('button', { name: /definitely shamil/i }).click();
  await page.getByRole('button', { name: /rooftop/i }).click();
  await page.getByRole('button', { name: /all 500/i }).click();
}

test('Abeer can complete the story and unlock the real surprise', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Abeer/i);
  await expect(page.getByRole('heading', { name: /private transmission/i })).toBeVisible();

  await finishQuestions(page);
  await expect(page.getByRole('heading', { name: /classified surprise/i })).toBeVisible();

  await page.getByRole('button', { name: /continue to checkout/i }).click();
  await expect(page.getByText('$500.00', { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/no card details/i)).toBeVisible();

  await page.getByRole('button', { name: /pay \$500/i }).click();
  await expect(page.getByText(/payment declined/i)).toBeVisible();
  await expect(page.getByText('$0.00', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /open the real surprise/i }).click();
  await expect(page.getByRole('heading', { name: /abeer, this is the real part/i })).toBeVisible();
  await expect(page.getByText(/you owe me 500 kisses/i)).toBeVisible();
});

test('the experience remains usable on a narrow phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /open it/i })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});

test('reduced-motion visitors do not get forced animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const duration = await page.locator('.scene.is-active').evaluate((el) => getComputedStyle(el).animationDuration);
  expect(duration).toBe('0.001s');
});
