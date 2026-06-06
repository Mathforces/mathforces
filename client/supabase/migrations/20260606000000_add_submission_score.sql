alter table public.submissions
add column if not exists score integer not null default 0;
