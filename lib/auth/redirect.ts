// Destino después de loguearse. Solo se aceptan rutas internas ("/cuenta"),
// nunca URLs absolutas ni "//otro-dominio", para que ?next= no sirva de
// redirección abierta hacia un sitio de phishing.
export function safeNextPath(next: string | null | undefined, fallback = "/cuenta"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
