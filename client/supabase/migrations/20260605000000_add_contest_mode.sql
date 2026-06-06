alter table public.contests
add column if not exists mode text not null default 'practice';

alter table public.contests
drop constraint if exists contests_mode_check;

alter table public.contests
add constraint contests_mode_check
check (mode in ('practice', 'live'));
