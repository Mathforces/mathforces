-- Extend profiles table with additional fields
alter table public.profiles
  add column if not exists image_url text,
  add column if not exists bio text,
  add column if not exists elo_rating integer not null default 0,
  add column if not exists contribution_rating integer not null default 0,
  add column if not exists country text,
  add column if not exists math_club text,
  add column if not exists followers_count integer not null default 0,
  add column if not exists following_count integer not null default 0;

-- Followers table
create table if not exists public.followers (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  follower_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, follower_id)
);

-- Blogs table
create table if not exists public.blogs (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  published boolean not null default true
);

-- Rating history table
create table if not exists public.rating_history (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null,
  contest_id uuid references public.contests(id) on delete set null,
  rank_in_contest integer,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_followers_user_id on public.followers(user_id);
create index if not exists idx_followers_follower_id on public.followers(follower_id);
create index if not exists idx_blogs_user_id on public.blogs(user_id);
create index if not exists idx_blogs_created_at on public.blogs(created_at);
create index if not exists idx_rating_history_user_id on public.rating_history(user_id);
create index if not exists idx_rating_history_created_at on public.rating_history(created_at);

-- Enable row level security
alter table public.followers enable row level security;
alter table public.blogs enable row level security;
alter table public.rating_history enable row level security;

-- RLS policies for followers
create policy "Anyone can view followers"
  on public.followers for select
  using (true);

create policy "Authenticated users can follow"
  on public.followers for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.followers for delete
  using (auth.uid() = follower_id);

-- RLS policies for blogs
create policy "Anyone can view published blogs"
  on public.blogs for select
  using (published = true or auth.uid() = user_id);

create policy "Users can create blogs"
  on public.blogs for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own blogs"
  on public.blogs for update
  using (auth.uid() = user_id);

create policy "Users can delete their own blogs"
  on public.blogs for delete
  using (auth.uid() = user_id);

-- RLS policies for rating_history
create policy "Anyone can view rating history"
  on public.rating_history for select
  using (true);

-- Trigger function to update followers_count/following_count
create or replace function public.update_follower_counts()
returns trigger
language plpgsql
security definer
as $$
begin
  if tg_op = 'INSERT' then
    update public.profiles set followers_count = followers_count + 1 where id = new.user_id;
    update public.profiles set following_count = following_count + 1 where id = new.follower_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.profiles set followers_count = followers_count - 1 where id = old.user_id;
    update public.profiles set following_count = following_count - 1 where id = old.follower_id;
    return old;
  end if;
end;
$$;

create or replace trigger on_follower_change
  after insert or delete on public.followers
  for each row
  execute function public.update_follower_counts();
