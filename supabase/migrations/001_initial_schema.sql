-- ============================================================
-- SyncMaster v1.0 — Initial Schema
-- Run this in your Supabase SQL editor (or via Supabase CLI)
-- ============================================================

-- Enum types
create type public.role as enum ('composer', 'producer', 'admin');
create type public.composer_status as enum ('pending', 'active', 'rejected');
create type public.brief_status as enum ('draft', 'active', 'matched', 'closed');
create type public.submission_status as enum ('pending', 'shortlisted', 'accepted', 'rejected');
create type public.placement_status as enum ('pending', 'confirmed', 'paid');
create type public.outreach_status as enum ('invited', 'accepted', 'declined');
create type public.task_status as enum ('open', 'in_progress', 'done');

-- ----------------------------------------------------------------
-- profiles — linked 1-to-1 with auth.users
-- ----------------------------------------------------------------
create table public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  role        public.role not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on signup using auth metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    (new.raw_user_meta_data->>'role')::public.role,
    new.raw_user_meta_data->>'full_name'
  );

  -- Create role-specific record
  if (new.raw_user_meta_data->>'role') = 'composer' then
    insert into public.composers (profile_id) values (new.id);
  elsif (new.raw_user_meta_data->>'role') = 'producer' then
    insert into public.producers (profile_id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------
-- Reference tables
-- ----------------------------------------------------------------
create table public.genres (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table public.communities (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

-- ----------------------------------------------------------------
-- composers
-- ----------------------------------------------------------------
create table public.composers (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references public.profiles on delete cascade,
  bio           text,
  genres        text[],
  portfolio_url text,
  status        public.composer_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (profile_id)
);

create trigger composers_updated_at before update on public.composers
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- producers
-- ----------------------------------------------------------------
create table public.producers (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references public.profiles on delete cascade,
  company          text,
  website          text,
  profile_complete boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (profile_id)
);

create trigger producers_updated_at before update on public.producers
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- briefs
-- ----------------------------------------------------------------
create table public.briefs (
  id          uuid primary key default gen_random_uuid(),
  producer_id uuid not null references public.producers on delete cascade,
  title       text not null,
  description text,
  genres      text[],
  budget_min  integer,
  budget_max  integer,
  deadline    timestamptz,
  status      public.brief_status not null default 'draft',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger briefs_updated_at before update on public.briefs
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- submissions
-- ----------------------------------------------------------------
create table public.submissions (
  id          uuid primary key default gen_random_uuid(),
  brief_id    uuid not null references public.briefs on delete cascade,
  composer_id uuid not null references public.composers on delete cascade,
  track_url   text not null,
  notes       text,
  status      public.submission_status not null default 'pending',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (brief_id, composer_id)
);

create trigger submissions_updated_at before update on public.submissions
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- placements
-- ----------------------------------------------------------------
create table public.placements (
  id            uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions on delete restrict,
  fee           integer not null,
  commission    integer not null,
  status        public.placement_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger placements_updated_at before update on public.placements
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- outreach
-- ----------------------------------------------------------------
create table public.outreach (
  id           uuid primary key default gen_random_uuid(),
  brief_id     uuid not null references public.briefs on delete cascade,
  composer_id  uuid not null references public.composers on delete cascade,
  status       public.outreach_status not null default 'invited',
  sent_at      timestamptz not null default now(),
  responded_at timestamptz,
  unique (brief_id, composer_id)
);

-- ----------------------------------------------------------------
-- tasks (internal admin)
-- ----------------------------------------------------------------
create table public.tasks (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  assigned_to    uuid references public.profiles,
  related_entity text,
  related_id     uuid,
  status         public.task_status not null default 'open',
  due_date       timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger tasks_updated_at before update on public.tasks
  for each row execute procedure public.set_updated_at();

-- ================================================================
-- Row Level Security
-- ================================================================

alter table public.profiles   enable row level security;
alter table public.composers  enable row level security;
alter table public.producers  enable row level security;
alter table public.genres     enable row level security;
alter table public.communities enable row level security;
alter table public.briefs     enable row level security;
alter table public.submissions enable row level security;
alter table public.placements enable row level security;
alter table public.outreach   enable row level security;
alter table public.tasks      enable row level security;

-- Helper: current user's role
create or replace function public.current_role()
returns public.role
language sql stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ----------------------------------------------------------------
-- profiles policies
-- ----------------------------------------------------------------
create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.current_role() = 'admin');

-- ----------------------------------------------------------------
-- composers policies
-- ----------------------------------------------------------------
create policy "Composers can read own record"
  on public.composers for select
  using (profile_id = auth.uid());

create policy "Composers can update own record"
  on public.composers for update
  using (profile_id = auth.uid());

create policy "Admins can read all composers"
  on public.composers for select
  using (public.current_role() = 'admin');

create policy "Admins can update all composers"
  on public.composers for update
  using (public.current_role() = 'admin');

-- ----------------------------------------------------------------
-- producers policies
-- ----------------------------------------------------------------
create policy "Producers can read own record"
  on public.producers for select
  using (profile_id = auth.uid());

create policy "Producers can update own record"
  on public.producers for update
  using (profile_id = auth.uid());

create policy "Admins can read all producers"
  on public.producers for select
  using (public.current_role() = 'admin');

create policy "Admins can update all producers"
  on public.producers for update
  using (public.current_role() = 'admin');

-- ----------------------------------------------------------------
-- genres / communities — public read
-- ----------------------------------------------------------------
create policy "Anyone can read genres"
  on public.genres for select using (true);

create policy "Anyone can read communities"
  on public.communities for select using (true);

-- ----------------------------------------------------------------
-- briefs policies
-- ----------------------------------------------------------------
create policy "Producers can manage own briefs"
  on public.briefs for all
  using (
    producer_id in (
      select id from public.producers where profile_id = auth.uid()
    )
  );

create policy "Active briefs visible to active composers"
  on public.briefs for select
  using (
    status = 'active'
    and public.current_role() = 'composer'
  );

create policy "Admins can manage all briefs"
  on public.briefs for all
  using (public.current_role() = 'admin');

-- ----------------------------------------------------------------
-- submissions policies
-- ----------------------------------------------------------------
create policy "Composers can manage own submissions"
  on public.submissions for all
  using (
    composer_id in (
      select id from public.composers where profile_id = auth.uid()
    )
  );

create policy "Producers can read submissions for their briefs"
  on public.submissions for select
  using (
    brief_id in (
      select b.id from public.briefs b
      join public.producers p on p.id = b.producer_id
      where p.profile_id = auth.uid()
    )
  );

create policy "Admins can manage all submissions"
  on public.submissions for all
  using (public.current_role() = 'admin');

-- ----------------------------------------------------------------
-- placements policies
-- ----------------------------------------------------------------
create policy "Admins can manage all placements"
  on public.placements for all
  using (public.current_role() = 'admin');

create policy "Composers can read own placements"
  on public.placements for select
  using (
    submission_id in (
      select s.id from public.submissions s
      join public.composers c on c.id = s.composer_id
      where c.profile_id = auth.uid()
    )
  );

create policy "Producers can read placements for their briefs"
  on public.placements for select
  using (
    submission_id in (
      select s.id from public.submissions s
      join public.briefs b on b.id = s.brief_id
      join public.producers p on p.id = b.producer_id
      where p.profile_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- outreach policies
-- ----------------------------------------------------------------
create policy "Composers can read own outreach"
  on public.outreach for select
  using (
    composer_id in (
      select id from public.composers where profile_id = auth.uid()
    )
  );

create policy "Composers can update own outreach status"
  on public.outreach for update
  using (
    composer_id in (
      select id from public.composers where profile_id = auth.uid()
    )
  );

create policy "Admins can manage all outreach"
  on public.outreach for all
  using (public.current_role() = 'admin');

-- ----------------------------------------------------------------
-- tasks policies
-- ----------------------------------------------------------------
create policy "Admins can manage all tasks"
  on public.tasks for all
  using (public.current_role() = 'admin');

-- ================================================================
-- Seed reference data
-- ================================================================
insert into public.genres (name) values
  ('Afrobeat'), ('Afropop'), ('Highlife'), ('Jùjú'), ('Fuji'),
  ('Afro-soul'), ('Afro-jazz'), ('Afro-fusion'), ('Gospel'), ('R&B'),
  ('Hip-hop'), ('Electronic'), ('Instrumental'), ('Cinematic'), ('World');

insert into public.communities (name) values
  ('Nigeria'), ('Ghana'), ('Kenya'), ('South Africa'), ('Ethiopia'),
  ('Cameroon'), ('Senegal'), ('Ivory Coast'), ('Tanzania'), ('Uganda');
