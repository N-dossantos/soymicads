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

Abrí `.env.local` y configurá las variables que uses en tu proyecto (por ejemplo `NEXT_PUBLIC_BIZUM_PHONE`).

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

## 💳 Configurar pagos

Los links de pago están configurados manualmente por producto en `lib/products.ts` (`mercadoLink`) y se abren directamente desde la UI.

**Flujo del pago:**
```
Usuario hace clic → se abre el link manual de pago →
Usuario paga → continúa a /gracias → agenda sesión (Calendly)
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
3. En "Environment Variables", agregá solo las que uses en frontend (por ejemplo `NEXT_PUBLIC_BIZUM_PHONE`)
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
