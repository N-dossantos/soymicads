-- FASE 1: perfiles de usuaria y rol de admin (ver usuarios.md).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  phone text check (char_length(phone) <= 30),
  country text check (char_length(country) <= 60),
  role text not null default 'client' check (role in ('client', 'admin')),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Privilegios explícitos en vez de depender de los defaults del proyecto.
-- La clienta puede editar sus datos pero nunca su rol: el UPDATE se concede
-- solo sobre estas columnas. Las altas las hace el trigger de auth.users y
-- las bajas, el ON DELETE CASCADE al borrar la cuenta.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (full_name, phone, country, marketing_opt_in) on table public.profiles to authenticated;

-- security definer para que las políticas puedan consultar profiles sin
-- volver a disparar RLS sobre la misma tabla.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

create policy "profiles: leer el propio (o admin)"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()));

create policy "profiles: editar el propio (o admin)"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id or (select public.is_admin()))
  with check ((select auth.uid()) = id or (select public.is_admin()));

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Alta del perfil con cada usuaria nueva (email, código o Google). El nombre
-- sale de los metadatos: `full_name` lo manda el registro del sitio y Google
-- lo trae como `full_name` / `name`.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(
      nullif(
        btrim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')),
        ''
      ),
      120
    )
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
