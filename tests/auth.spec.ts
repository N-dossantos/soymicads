import { test, expect, type APIRequestContext, type Page } from "@playwright/test";

// Corren contra Supabase local (ver supabase/README.md): los emails con el
// código de 6 dígitos se leen de Mailpit.
const MAILPIT_URL = process.env.MAILPIT_URL;
test.skip(!MAILPIT_URL, "Requiere Supabase local y MAILPIT_URL (ver supabase/README.md)");

const PASSWORD = "clave-segura-123";

function uniqueEmail(tag: string) {
  return `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@test.soymicads.com`;
}

// Espera a que `email` tenga al menos `count` mensajes y devuelve el código
// del más nuevo.
async function codeFromEmail(request: APIRequestContext, email: string, count = 1): Promise<string> {
  let html = "";
  await expect
    .poll(
      async () => {
        const search = await request.get(`${MAILPIT_URL}/api/v1/search`, { params: { query: `to:"${email}"` } });
        const { messages } = await search.json();
        if (!messages || messages.length < count) return false;
        const message = await request.get(`${MAILPIT_URL}/api/v1/message/${messages[0].ID}`);
        html = (await message.json()).HTML;
        return true;
      },
      { timeout: 15_000 }
    )
    .toBe(true);

  const code = html.match(/>\s*(\d{6})\s*</)?.[1];
  expect(code, "el email trae un código de 6 dígitos").toBeTruthy();
  return code!;
}

async function signOut(page: Page) {
  await page.getByRole("button", { name: "Salir" }).click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);
}

async function register(page: Page, request: APIRequestContext, email: string, name = "Lucía Prueba") {
  await page.goto("/registro");
  await page.getByLabel("Nombre y apellido").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill(PASSWORD);
  await page.getByRole("button", { name: "Crear cuenta" }).click();
  await page.getByLabel("Código de 6 dígitos").fill(await codeFromEmail(request, email));
  await page.getByRole("button", { name: "Confirmar mi cuenta" }).click();
  await expect(page).toHaveURL(/\/cuenta$/);
}

test("/cuenta sin sesión manda a ingresar y vuelve a la misma página", async ({ page }) => {
  await page.goto("/cuenta/perfil");
  await expect(page).toHaveURL(/\/ingresar\?next=%2Fcuenta%2Fperfil$/);
  await expect(page.getByRole("heading", { name: "Ingresá a tu cuenta" })).toBeVisible();
});

test("registro con código, perfil, salir y volver a entrar desde el modal del Navbar", async ({ page, request }) => {
  test.skip(test.info().project.name !== "chromium", "Un navegador alcanza para el recorrido completo");
  const email = uniqueEmail("registro");

  await register(page, request, email);
  await expect(page.getByRole("heading", { name: "Hola, Lucía" })).toBeVisible();

  await page.getByRole("link", { name: "Perfil", exact: true }).click();
  await page.getByLabel("WhatsApp", { exact: true }).fill("+34 600 000 000");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByText("Listo, guardamos tus datos.")).toBeVisible();

  await signOut(page);

  await page.getByRole("button", { name: "Ingresar" }).click();
  const dialog = page.getByRole("dialog", { name: "Ingresá a tu cuenta" });
  await dialog.getByLabel("Email").fill(email);
  await dialog.getByLabel("Contraseña").fill(PASSWORD);
  await dialog.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Mi cuenta" })).toBeVisible();

  await page.goto("/cuenta/perfil");
  await expect(page.getByLabel("WhatsApp", { exact: true })).toHaveValue("+34 600 000 000");
});

test("ingresar con código crea la cuenta, y se puede borrar", async ({ page, request }) => {
  test.skip(test.info().project.name !== "chromium", "Un navegador alcanza para el recorrido completo");
  const email = uniqueEmail("codigo");

  await page.goto("/ingresar?next=/cuenta/perfil");
  await page.getByRole("button", { name: "Con un código" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Mandarme el código" }).click();
  await page.getByLabel("Código de 6 dígitos").fill(await codeFromEmail(request, email));
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page).toHaveURL(/\/cuenta\/perfil$/);

  await page.getByLabel("Escribí BORRAR para confirmar").fill("BORRAR");
  await page.getByRole("button", { name: "Borrar mi cuenta para siempre" }).click();
  await expect(page).toHaveURL(/localhost:\d+\/$/);

  await page.goto("/cuenta");
  await expect(page).toHaveURL(/\/ingresar/);
});

test("recuperar la contraseña con el código del email", async ({ page, request }) => {
  test.skip(test.info().project.name !== "chromium", "Un navegador alcanza para el recorrido completo");
  const email = uniqueEmail("recuperar");
  await register(page, request, email);
  await signOut(page);

  await page.goto("/recuperar");
  await page.getByLabel("Email de tu cuenta").fill(email);
  await page.getByRole("button", { name: "Mandarme el código" }).click();
  await page.getByLabel("Código de 6 dígitos").fill(await codeFromEmail(request, email, 2));
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page).toHaveURL(/\/cuenta\/nueva-contrasena$/);
  await page.getByLabel("Contraseña nueva").fill("otra-clave-456");
  await page.getByLabel("Repetila").fill("otra-clave-456");
  await page.getByRole("button", { name: "Guardar contraseña" }).click();
  await expect(page).toHaveURL(/\/cuenta$/);

  await signOut(page);
  await page.goto("/ingresar");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña").fill("otra-clave-456");
  await page.getByRole("button", { name: "Ingresar", exact: true }).click();
  await expect(page).toHaveURL(/\/cuenta$/);
});
