// Mensajes en español para los errores de Supabase Auth, por `error.code`
// (https://supabase.com/docs/guides/auth/debugging/error-codes).
const MESSAGES: Record<string, string> = {
  invalid_credentials: "El email o la contraseña no coinciden.",
  email_not_confirmed: "Todavía no confirmaste tu email. Revisá tu casilla (y la carpeta de spam).",
  otp_expired: "El código no es correcto o ya venció. Pedí uno nuevo.",
  over_email_send_rate_limit: "Pediste varios emails seguidos. Esperá unos minutos y volvé a intentar.",
  over_request_rate_limit: "Hubo demasiados intentos. Esperá unos minutos y volvé a intentar.",
  weak_password: "La contraseña es muy débil. Usá al menos 8 caracteres.",
  same_password: "La nueva contraseña tiene que ser distinta de la actual.",
  user_already_exists: "Ya hay una cuenta con ese email. Probá ingresar.",
  email_exists: "Ya hay una cuenta con ese email. Probá ingresar.",
  email_address_invalid: "Revisá el email: no parece válido.",
  validation_failed: "Revisá los datos ingresados.",
  signup_disabled: "Por ahora no se pueden crear cuentas nuevas.",
  user_banned: "Esta cuenta está suspendida. Escribile a Mica por WhatsApp.",
  session_not_found: "Tu sesión venció. Volvé a ingresar.",
  reauthentication_needed: "Por seguridad, volvé a ingresar antes de cambiar la contraseña.",
};

const FALLBACK = "Algo salió mal. Probá de nuevo en un momento.";

export function authErrorMessage(error: { code?: string } | null | undefined): string {
  return (error?.code && MESSAGES[error.code]) || FALLBACK;
}
