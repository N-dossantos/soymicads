// Datos de contacto compartidos por el sitio.
// El número va en formato internacional, sin "+" ni espacios.
export const WHATSAPP_PHONE = "5491150294100";

export function whatsappHref(message: string): string {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}
