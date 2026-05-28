import { test, expect } from '@playwright/test';

test.describe('Mica Ds site', () => {
  test('renders the homepage and toggles currency', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'No venís a sanar. Venís a vivir siendo vos.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Servicios' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proceso completo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Para conocernos — Sesión corta' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pagar con Bizum €125' })).toBeVisible();

    await page.getByRole('button', { name: 'ARS' }).click();

    await expect(page.getByRole('button', { name: 'Abrir link de pago $230.000' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Transferencia — $210.000' })).toBeVisible();

    await page.getByRole('button', { name: 'EUR' }).click();

    await expect(page.getByRole('button', { name: 'Pagar con Bizum €125' })).toBeVisible();
  });

  test('opens the transfer flow and returns to the homepage without blocking clicks', async ({ page }) => {
    await page.goto('/');

    await page.goto('/pago-en-proceso/transferencia?product=designme_full');
    await expect(page).toHaveURL(/\/pago-en-proceso\/transferencia\?product=designme_full$/);
    await expect(page.getByRole('heading', { name: 'Transferencia registrada' })).toBeVisible();

    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'ARS' })).toBeVisible();

    await page.getByRole('button', { name: 'ARS' }).click();
    await expect(page.getByRole('button', { name: 'Abrir link de pago $230.000' })).toBeVisible();
  });

  test('keeps the homepage interactive after going back from a payment flow', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'EUR' }).click();
    await expect(page.getByRole('button', { name: 'Pagar con Bizum €125' })).toBeVisible();

    await page.goto('/pago-en-proceso/link?product=designme_full');
    await expect(page.getByRole('heading', { name: 'El pago está en curso...' })).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL('/');

    await page.getByRole('button', { name: 'ARS' }).click();
    await page.getByRole('button', { name: 'EUR' }).click();
    await page.getByRole('link', { name: 'Diseñar(me)' }).click();
    await expect(page).toHaveURL(/#servicio$/);
  });

  test('shows the payment choice page and the thank-you flow', async ({ page }) => {
    await page.goto('/pago-en-proceso');

    await expect(page.getByRole('heading', { name: 'Elegí tu método de pago' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pago por link →' })).toHaveAttribute('href', '/pago-en-proceso/link');
    await expect(page.getByRole('link', { name: 'Transferencia →' })).toHaveAttribute('href', '/pago-en-proceso/transferencia');

    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page).toHaveURL('/');

    await page.goto('/pago-en-proceso/link?product=designme_full');
    await expect(page.getByRole('heading', { name: 'El pago está en curso...' })).toBeVisible();
    await page.getByRole('link', { name: 'Ya pagué, continuar →' }).click();
    await expect(page).toHaveURL(/\/gracias$/);
    await expect(page.getByRole('heading', { name: '¡Bienvenido/a al proceso!' })).toBeVisible();
  });
});
