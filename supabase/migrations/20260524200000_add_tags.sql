alter table public.posts
  add column if not exists tags text[] default '{}';

create index if not exists posts_tags_gin_idx on public.posts using gin (tags);