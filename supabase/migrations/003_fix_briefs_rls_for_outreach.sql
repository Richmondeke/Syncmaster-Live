-- Composers need to read briefs they were invited to, even when the brief
-- is no longer 'active' (e.g. matched, closed). Without this policy the
-- outreach!inner join silently filters out every row whose brief has
-- transitioned past active status.
create policy "Composers can read briefs they have outreach for"
  on public.briefs for select
  using (
    exists (
      select 1
      from public.outreach o
      join public.composers c on c.id = o.composer_id
      where o.brief_id = briefs.id
        and c.profile_id = auth.uid()
    )
  );
