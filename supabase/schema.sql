-- Ejecuta este script en Supabase → SQL Editor

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  categoria text not null default 'otro'
    check (categoria in ('retiro','paseo','peregrinacion','reunion','servicio','otro')),
  fecha date not null,
  lugar text,
  publicado boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 120),
  edad int check (edad between 10 and 99),
  telefono text not null check (char_length(telefono) between 7 and 20),
  mensaje text check (char_length(mensaje) <= 600),
  created_at timestamptz not null default now()
);

alter table public.eventos enable row level security;
alter table public.solicitudes enable row level security;

-- Público: solo ve eventos publicados
create policy "eventos_lectura_publica" on public.eventos
  for select using (publicado = true);

-- Administradores (usuarios autenticados en Supabase Auth): control total
create policy "eventos_admin_todo" on public.eventos
  for all to authenticated using (true) with check (true);

-- Público: puede enviar solicitudes, pero NO leerlas
create policy "solicitudes_insertar_publico" on public.solicitudes
  for insert to anon, authenticated with check (true);

create policy "solicitudes_admin_lectura" on public.solicitudes
  for select to authenticated using (true);

create policy "solicitudes_admin_borrar" on public.solicitudes
  for delete to authenticated using (true);

-- IMPORTANTE: en Authentication → Providers desactiva "Allow new users to sign up"
-- y crea tú mismo los usuarios admin, para que solo ellos sean "authenticated".
