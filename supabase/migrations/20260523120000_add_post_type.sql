alter table public.posts
  add column if not exists type text not null default 'blog'
  check (type in ('blog', 'quote'));