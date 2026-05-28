create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text,
  display_name text,
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete restrict,
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(trim(body)) > 0),
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null default 'like',
  inserted_at timestamptz not null default now(),
  constraint reactions_unique unique (post_id, user_id, kind)
);

create unique index if not exists profiles_username_lower_idx on public.profiles (lower(username)) where username is not null;
create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists comments_post_id_inserted_at_idx on public.comments (post_id, inserted_at desc);
create index if not exists comments_author_id_idx on public.comments (author_id);
create index if not exists reactions_post_id_idx on public.reactions (post_id);
create index if not exists reactions_user_id_idx on public.reactions (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_username text;
  admin_count integer;
begin
  derived_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(coalesce(new.email, ''), '@', 1)
  );

  select count(*) into admin_count
  from public.profiles
  where role = 'admin';

  insert into public.profiles (
    id,
    username,
    display_name,
    role
  )
  values (
    new.id,
    nullif(derived_username, ''),
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', derived_username), ''),
    case when admin_count < 2 then 'admin' else 'member' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;

drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
on public.profiles
for select
to public
using (true);

drop policy if exists "profiles_self_or_admin_update" on public.profiles;
create policy "profiles_self_or_admin_update"
on public.profiles
for update
to authenticated
using (((select auth.uid()) = id) or (select public.is_admin()))
with check (((select auth.uid()) = id) or (select public.is_admin()));

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles
for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "posts_public_read_published" on public.posts;
create policy "posts_public_read_published"
on public.posts
for select
to public
using ((status = 'published') or (select public.is_admin()));

drop policy if exists "posts_admin_insert" on public.posts;
create policy "posts_admin_insert"
on public.posts
for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "posts_admin_update" on public.posts;
create policy "posts_admin_update"
on public.posts
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "posts_admin_delete" on public.posts;
create policy "posts_admin_delete"
on public.posts
for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "comments_public_read" on public.comments;
create policy "comments_public_read"
on public.comments
for select
to public
using (
  exists (
    select 1
    from public.posts
    where posts.id = comments.post_id
      and posts.status = 'published'
  ) or (select public.is_admin())
);

drop policy if exists "comments_member_insert" on public.comments;
create policy "comments_member_insert"
on public.comments
for insert
to authenticated
with check (
  ((select auth.uid()) = author_id)
  and exists (
    select 1
    from public.posts
    where posts.id = comments.post_id
      and posts.status = 'published'
  )
);

drop policy if exists "comments_self_or_admin_update" on public.comments;
create policy "comments_self_or_admin_update"
on public.comments
for update
to authenticated
using (((select auth.uid()) = author_id) or (select public.is_admin()))
with check (((select auth.uid()) = author_id) or (select public.is_admin()));

drop policy if exists "comments_self_or_admin_delete" on public.comments;
create policy "comments_self_or_admin_delete"
on public.comments
for delete
to authenticated
using (((select auth.uid()) = author_id) or (select public.is_admin()));

drop policy if exists "reactions_public_read" on public.reactions;
create policy "reactions_public_read"
on public.reactions
for select
to public
using (true);

drop policy if exists "reactions_self_insert" on public.reactions;
create policy "reactions_self_insert"
on public.reactions
for insert
to authenticated
with check (
  ((select auth.uid()) = user_id)
  and exists (
    select 1
    from public.posts
    where posts.id = reactions.post_id
      and posts.status = 'published'
  )
);

drop policy if exists "reactions_self_update" on public.reactions;
create policy "reactions_self_update"
on public.reactions
for update
to authenticated
using (((select auth.uid()) = user_id) or (select public.is_admin()))
with check (((select auth.uid()) = user_id) or (select public.is_admin()));

drop policy if exists "reactions_self_delete" on public.reactions;
create policy "reactions_self_delete"
on public.reactions
for delete
to authenticated
using (((select auth.uid()) = user_id) or (select public.is_admin()));

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read"
on storage.objects
for select
to public
using (bucket_id = 'images');

drop policy if exists "avatars_member_insert" on storage.objects;
create policy "avatars_member_insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'images'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = ((select auth.uid())::text)
    )
    or (
      (storage.foldername(name))[1] = 'posts'
      and (select public.is_admin())
    )
  )
);

drop policy if exists "images_member_update" on storage.objects;
create policy "images_member_update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'images'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = ((select auth.uid())::text)
    )
    or (select public.is_admin())
  )
)
with check (
  bucket_id = 'images'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = ((select auth.uid())::text)
    )
    or (select public.is_admin())
  )
);

drop policy if exists "images_member_delete" on storage.objects;
create policy "images_member_delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'images'
  and (
    (
      (storage.foldername(name))[1] = 'avatars'
      and (storage.foldername(name))[2] = ((select auth.uid())::text)
    )
    or (select public.is_admin())
  )
);
