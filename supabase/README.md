# Supabase

Base de datos y login de las cuentas de usuaria (plan completo en `usuarios.md`).

- `migrations/`: el esquema. Se aplica en orden, nunca se edita una migración ya aplicada en producción: se agrega una nueva.
- `templates/`: emails de Auth en español (confirmar cuenta, código para ingresar, recuperar contraseña, cambio de email).
- `config.toml`: configuración del Supabase **local** (CLI). La del proyecto en la nube se carga a mano en el dashboard (ver abajo).

## Desarrollo local

Requiere Docker.

```bash
npx supabase start          # levanta Postgres, Auth y Mailpit, y aplica las migraciones
npx supabase status -o env  # muestra la URL y las claves locales
```

Cargar en `.env.local`:

| Variable | Valor local |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `API_URL` (`http://127.0.0.1:55321`) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `PUBLISHABLE_KEY` |
| `SUPABASE_SECRET_KEY` | `SECRET_KEY` |

Los emails no salen: se ven en Mailpit, `http://127.0.0.1:55324`.

- `npx supabase db reset` borra la base local y vuelve a aplicar todas las migraciones.
- `npx supabase stop` la apaga.

Tests de punta a punta del login, con Supabase local corriendo y esas variables en `.env.local`:

```bash
MAILPIT_URL=http://127.0.0.1:55324 npx playwright test tests/auth.spec.ts --project=chromium
```

## Proyecto en la nube (producción y staging)

1. **Aplicar las migraciones**:
   ```bash
   npx supabase link --project-ref <ref>
   npx supabase db push
   ```
2. **Authentication → URL Configuration**:
   - Site URL: `https://soymicads.com` (en staging, la URL de preview fija).
   - Redirect URLs: `https://soymicads.com/**`, `https://*-<equipo>.vercel.app/**` y `http://localhost:3000/**`.
3. **Authentication → Sign In / Providers**:
   - Email: con "Confirm email" activado. Largo mínimo de contraseña: 8. Largo del código (Email OTP Length): 6.
   - Google: client id y secret del cliente OAuth "Login" de Google Cloud. En Google Cloud, la URL de redirección autorizada es `https://<ref>.supabase.co/auth/v1/callback`.
4. **Authentication → Emails → Templates**: copiar el asunto y el HTML de cada archivo de `templates/` (los asuntos están en `config.toml`):
   - `confirmation.html` → Confirm signup
   - `magic_link.html` → Magic link
   - `recovery.html` → Reset password
   - `email_change.html` → Change email address
5. **Authentication → Emails → SMTP Settings**: SMTP de Resend (`smtp.resend.com`, puerto 465, usuario `resend`, contraseña = una API key de Resend de solo envío, distinta de la de Vercel), remitente `hola@soymicads.com` con nombre `Mica Ds`. El dominio ya está verificado en Resend (ver `pagos.md`). Sin esto Supabase manda muy pocos emails por hora.
6. **Variables en Vercel** (Production y Preview): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SECRET_KEY` (Project Settings → API Keys).

## Hacer admin a Mica

Después de que Mica cree su cuenta en el sitio, una sola vez, desde el SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'soymicads@gmail.com');
```

El rol no se puede cambiar desde el sitio: la clienta solo tiene permiso de UPDATE sobre sus columnas de contacto.
