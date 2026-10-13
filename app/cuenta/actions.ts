"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, requireUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DELETE_CONFIRMATION_WORD } from "@/lib/account";

const PROFILE_LIMITS = { full_name: 120, phone: 30, country: 60 } as const;
type ProfileField = keyof typeof PROFILE_LIMITS;

export interface ProfileFormState {
  status: "idle" | "saved" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ProfileField, string>>;
}

function readField(formData: FormData, name: ProfileField): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, PROFILE_LIMITS[name]) : "";
}

// Permisivo a propósito: acepta formatos de Argentina y España con o sin +.
const PHONE_RE = /^\+?[\d\s().-]{6,30}$/;

export async function updateProfile(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const { supabase, user } = await requireUser("/cuenta/perfil");

  const fullName = readField(formData, "full_name");
  const phone = readField(formData, "phone");
  const country = readField(formData, "country");

  const fieldErrors: ProfileFormState["fieldErrors"] = {};
  if (fullName.length < 2) fieldErrors.full_name = "Contanos tu nombre.";
  if (phone && !PHONE_RE.test(phone)) fieldErrors.phone = "Revisá el teléfono: solo números, espacios, + y guiones.";
  if (Object.keys(fieldErrors).length > 0) return { status: "error", fieldErrors };

  // RLS + los grants por columna garantizan que solo se toque su fila y
  // nunca el rol, aunque alguien arme el request a mano.
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone || null,
      country: country || null,
      marketing_opt_in: formData.get("marketing_opt_in") === "on",
    })
    .eq("id", user.id);

  if (error) {
    console.error("[cuenta] updateProfile failed", error.code, error.message);
    return { status: "error", message: "No pudimos guardar los cambios. Probá de nuevo en un momento." };
  }

  revalidatePath("/cuenta", "layout");
  return { status: "saved" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export interface DeleteAccountState {
  error?: string;
}

export async function deleteAccount(_prev: DeleteAccountState, formData: FormData): Promise<DeleteAccountState> {
  if (formData.get("confirmation") !== DELETE_CONFIRMATION_WORD) {
    return { error: `Escribí ${DELETE_CONFIRMATION_WORD} para confirmar.` };
  }

  const { supabase, user } = await requireUser("/cuenta/perfil");

  // Borra auth.users y, en cascada, el perfil. Cuando existan órdenes,
  // cartas y reportes (fases 2, 3 y 6), acá también hay que anonimizar las
  // órdenes y borrar los archivos de Storage antes de borrar la usuaria.
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) {
    console.error("[cuenta] deleteAccount failed", error.code ?? error.message);
    return { error: "No pudimos borrar tu cuenta. Escribile a Mica por WhatsApp y lo hacemos a mano." };
  }

  // La usuaria ya no existe; signOut limpia igual las cookies de la sesión.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
