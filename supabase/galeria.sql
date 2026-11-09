insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('jmc-galeria', 'jmc-galeria', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists jmc_galeria_leer on storage.objects;
create policy jmc_galeria_leer on storage.objects for select to anon, authenticated
  using (bucket_id = 'jmc-galeria');

-- El sitio reserva las cuentas autenticadas para administradores.
drop policy if exists jmc_galeria_subir on storage.objects;
create policy jmc_galeria_subir on storage.objects for insert to authenticated
  with check (bucket_id = 'jmc-galeria');

drop policy if exists jmc_galeria_reemplazar on storage.objects;
create policy jmc_galeria_reemplazar on storage.objects for update to authenticated
  using (bucket_id = 'jmc-galeria') with check (bucket_id = 'jmc-galeria');
