-- Allow any authenticated user to read profiles.
-- Required so brief detail pages can display producer names to composers.
create policy "Authenticated users can read all profiles"
  on public.profiles for select
  to authenticated
  using (true);

-- Allow any authenticated user to read producer records.
-- Required so brief detail pages can join producer info for composers.
create policy "Authenticated users can read all producers"
  on public.producers for select
  to authenticated
  using (true);
