# 🌈 Soymicads — Landing Page

Landing page profesional construida con **Next.js 14**, **TypeScript** y **Tailwind CSS**.

---

## 🚀 Cómo correr el proyecto

### Paso 1 — Instalá Node.js

Si no lo tenés instalado, descargalo desde [nodejs.org](https://nodejs.org) (versión LTS).

### Paso 2 — Instalá las dependencias

Abrí una terminal en la carpeta del proyecto y ejecutá:

```bash
npm install
```

### Paso 3 — Configurá las variables de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.example .env.local
```

Abrí `.env.local` y pegá tu **Access Token de Mercado Pago**. Lo obtenés en:
👉 [mercadopago.com.ar/developers/panel](https://www.mercadopago.com.ar/developers/panel/app)

### Paso 4 — Corré el servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del proyecto

```
mood-budita/
├── app/
│   ├── layout.tsx              # Layout raíz con metadata SEO
│   ├── page.tsx                # Página principal (compone todas las secciones)
│   ├── globals.css             # Estilos globales y fuentes
│   ├── gracias/
│   │   └── page.tsx            # Página post-pago exitoso
│   └── api/
│       └── create-preference/
│           └── route.ts        # Endpoint de Mercado Pago
│
├── components/
│   ├── ui/
│   │   ├── CurrencyToggle.tsx  # Toggle ARS / EUR
│   │   └── PayButton.tsx       # Botón de pago inteligente
│   └── sections/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── Philosophy.tsx
│       ├── Service.tsx         # Sección Diseñar(me) con las 6 sesiones
│       ├── Pricing.tsx         # Tarjetas de precio
│       ├── Membership.tsx      # Membresía de integración
│       ├── FAQ.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── products.ts             # ⭐ FUENTE ÚNICA DE VERDAD para servicios y precios
│   └── currency-context.tsx    # Estado global de moneda (ARS/EUR)
│
├── .env.example                # Plantilla de variables de entorno
└── .env.local                  # Tu configuración real (NO subir a Git)
```

---

## 💳 Configurar Mercado Pago

1. Entrá a [mercadopago.com.ar/developers](https://www.mercadopago.com.ar/developers/panel/app)
2. Creá una aplicación
3. Copiá el **Access Token** de producción
4. Pegalo en `.env.local` como `MP_ACCESS_TOKEN=APP_USR-...`
5. Cambiá `NEXT_PUBLIC_BASE_URL` a la URL de tu sitio en producción

**Flujo del pago:**
```
Usuario hace clic → /api/create-preference → Mercado Pago genera URL → 
Usuario paga → MP redirige a /gracias → Usuario agenda sesión (Calendly)
```

---

## ➕ Agregar un nuevo servicio

Solo editá `lib/products.ts` y agregás un objeto al array `PRODUCTS`:

```typescript
{
  id: "nuevo_servicio",
  title: "Nombre del servicio",
  description: "Descripción corta.",
  priceARS: 50_000,
  priceEUR: 35,
  paymentMethod: "mercadopago",
  category: "diseniarme", // o "membresia"
},
```

Después usás `<PayButton productId="nuevo_servicio" />` en cualquier componente.

---

## 🌐 Publicar en Vercel (gratis)

1. Subí el proyecto a GitHub
2. Entrá a [vercel.com](https://vercel.com) y conectá tu repositorio
3. En "Environment Variables", agregá `MP_ACCESS_TOKEN` y `NEXT_PUBLIC_BASE_URL`
4. Vercel despliega automáticamente con cada push

---

## 🎨 Paleta de colores

| Variable Tailwind | Color | Uso |
|---|---|---|
| `terra` | `#C4846A` | Color principal, CTAs |
| `terra-dark` | `#A06550` | Hover de botones |
| `cream` | `#F5F0E8` | Fondos de secciones |
| `sand` | `#E8DCC8` | Fondos de elementos |
| `rainbow-*` | Arcoíris | Acentos de color |

---

## 📬 Personalizar el footer

Abrí `components/sections/Footer.tsx` y reemplazá:
- El link de Instagram con tu URL real
- El email `hola@moodbudita.com` con el tuyo

## 📅 Conectar Calendly

Abrí `app/gracias/page.tsx` y reemplazá:
```
https://calendly.com/tu-usuario
```
con tu link real de Calendly.
