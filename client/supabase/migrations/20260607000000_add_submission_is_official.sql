alter table public.submissions
add column if not exists is_official boolean not null default true;
