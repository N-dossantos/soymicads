import { MercadoPagoConfig } from "mercadopago";

export function getMercadoPagoClient(): MercadoPagoConfig {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("MERCADOPAGO_ACCESS_TOKEN no está configurado.");
  }
  return new MercadoPagoConfig({ accessToken });
}

// Dominio usado para armar las back_urls/notification_url que le mandamos a
// Mercado Pago. Preferimos SITE_URL (fijo, configurado a mano) antes que el
// header Host de la request, que en teoría podría no venir bien pineado
// según cómo esté configurado el hosting/proxy.
export function getSiteOrigin(request: Request): string {
  const configured = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  return configured || new URL(request.url).origin;
}
