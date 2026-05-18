-- ----------------------------------------------------------------
-- notifications
-- ----------------------------------------------------------------
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  message     text not null,
  type        text not null default 'system', -- 'brief', 'submission', 'system'
  link        text,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Row Level Security
alter table public.notifications enable row level security;

-- Policies
create policy "Users can read own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

create policy "Admins can manage all notifications"
  on public.notifications for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Enable Realtime for notifications
alter publication supabase_realtime add table notifications;
