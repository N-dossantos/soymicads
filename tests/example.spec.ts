import { test, expect } from '@playwright/test';

test.describe('Mica Ds site', () => {
  test('renders the homepage and toggles currency', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'No venís solo a sanar. Venís a vivir siendo vos.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Servicios' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Proceso completo' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Para conocernos — Sesión corta' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pagar con Bizum €125' })).toBeVisible();

    await page.getByRole('button', { name: 'ARS' }).click();

    await expect(page.getByRole('button', { name: 'Pagar con Mercado Pago $230.000' })).toBeVisible();
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
    await expect(page.getByRole('button', { name: 'Pagar con Mercado Pago $230.000' })).toBeVisible();
  });

  test('starts a real Mercado Pago checkout when the pay button is clicked', async ({ page }) => {
    await page.route('**/api/create-preference', async (route) => {
      const request = route.request();
      expect(request.method()).toBe('POST');
      expect(JSON.parse(request.postData() ?? '{}')).toEqual({ productId: 'designme_full' });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ initPoint: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=fake' }),
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'ARS' }).click();

    const payButton = page.getByRole('button', { name: 'Pagar con Mercado Pago $230.000' });
    await payButton.click();

    await expect(page).toHaveURL(/mercadopago\.com\.ar\/checkout/);
  });

  test('keeps the homepage interactive after going back from a payment flow', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'EUR' }).click();
    await expect(page.getByRole('button', { name: 'Pagar con Bizum €125' })).toBeVisible();

    await page.goto('/pago-en-proceso/link?product=designme_full');
    await expect(page.getByRole('heading', { name: 'Esperando la confirmación del pago' })).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL('/');

    await expect(page.getByRole('button', { name: 'ARS' })).toBeVisible();
    await page.getByRole('button', { name: 'ARS' }).click();
    await page.getByRole('button', { name: 'EUR' }).click();

    // "Diseñar(me)" ya no es un link de primer nivel, ahora vive dentro del
    // dropdown de "Servicios" (que se abre al pasar el mouse). Confirmamos
    // que el nav sigue interactivo con un link de primer nivel en su lugar.
    await page.getByRole('link', { name: 'Encuentros gratuitos' }).click();
    await expect(page).toHaveURL(/#encuentro$/);
  });

  test('shows the payment choice page and the neutral verification state without a payment id', async ({ page }) => {
    await page.goto('/pago-en-proceso');

    await expect(page.getByRole('heading', { name: 'Elegí tu método de pago' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pago por link →' })).toHaveAttribute('href', '/pago-en-proceso/link');
    await expect(page.getByRole('link', { name: 'Transferencia →' })).toHaveAttribute('href', '/pago-en-proceso/transferencia');

    await page.getByRole('link', { name: 'Volver al inicio' }).click();
    await expect(page).toHaveURL('/');

    // Sin payment_id la página no verifica nada, así que no debe ofrecer
    // un link directo a /gracias (eso solo aparece si Mercado Pago confirma el pago).
    await page.goto('/pago-en-proceso/link?product=designme_full');
    await expect(page.getByRole('heading', { name: 'Esperando la confirmación del pago' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Continuar →' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Ver propuestas →' })).toBeVisible();
  });

  test('gracias page deep-links to the right calendly booking', async ({ page }) => {
    await page.goto('/gracias?product=designme_full');
    await expect(page.getByRole('heading', { name: '¡Bienvenido/a al proceso!' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Agendar .*→/ })).toHaveAttribute('href', 'https://cal.com/soymicads/disenar-me');
  });
});
