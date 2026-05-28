import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type AuthorRecord = {
  avatar_url: string | null;
  display_name: string | null;
  username: string | null;
};

type JoinedPost = Database["public"]["Tables"]["posts"]["Row"] & {
  profiles?: AuthorRecord | AuthorRecord[] | null;
};

type JoinedComment = Database["public"]["Tables"]["comments"]["Row"] & {
  profiles?: AuthorRecord | AuthorRecord[] | null;
};

export type PostSummary = {
  authorName: string;
  commentCount: number;
  coverImageUrl: string | null;
  excerpt: string;
  id: string;
  publishedAt: string | null;
  reactionCount: number;
  slug: string;
  tags: string[];
  title: string;
  type: string;
};

export type CommentView = {
  authorAvatarUrl: string | null;
  authorId: string;
  authorName: string;
  body: string;
  id: string;
  insertedAt: string;
};

export type PostDetail = PostSummary & {
  comments: CommentView[];
  content: string;
};

function normalizeAuthor(author: AuthorRecord | AuthorRecord[] | null | undefined) {
  const resolved = Array.isArray(author) ? author[0] : author;

  return {
    avatarUrl: resolved?.avatar_url ?? null,
    name: resolved?.display_name ?? resolved?.username ?? "Two Thumbs Up",
  };
}

async function getCounts(
  postId: string,
  supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>,
) {
  const [{ count: commentCount }, { count: reactionCount }] = await Promise.all([
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", postId),
    supabase.from("reactions").select("*", { count: "exact", head: true }).eq("post_id", postId),
  ]);

  return {
    commentCount: commentCount ?? 0,
    reactionCount: reactionCount ?? 0,
  };
}

export const listPublishedPosts = cache(async (options?: { type?: string }): Promise<PostSummary[]> => {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_image_url, published_at, type, tags, profiles:author_id(display_name, username, avatar_url)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(12);

  if (options?.type) {
    query = query.eq("type", options.type);
  }

  const { data, error } = await query;

  if (error || !data?.length) {
    return [];
  }

  const rows = data as JoinedPost[];

  return Promise.all(
    rows.map(async (row) => {
      const author = normalizeAuthor(row.profiles);
      const counts = await getCounts(row.id, supabase);

      return {
        authorName: author.name,
        commentCount: counts.commentCount,
        coverImageUrl: row.cover_image_url,
        excerpt: row.excerpt,
        id: row.id,
        publishedAt: row.published_at,
        reactionCount: counts.reactionCount,
        slug: row.slug,
        tags: row.tags ?? [],
        title: row.title,
        type: row.type ?? "blog",
      };
    }),
  );
});

export const getPostBySlug = cache(async (slug: string): Promise<PostDetail | null> => {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, content, cover_image_url, published_at, type, tags, profiles:author_id(display_name, username, avatar_url)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as JoinedPost;
  const author = normalizeAuthor(row.profiles);
  const counts = await getCounts(row.id, supabase);

  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, body, inserted_at, author_id, profiles:author_id(display_name, username, avatar_url)")
    .eq("post_id", row.id)
    .order("inserted_at", { ascending: true });

  const comments = ((commentsData ?? []) as JoinedComment[]).map((comment) => {
    const commentAuthor = normalizeAuthor(comment.profiles);

    return {
      authorAvatarUrl: commentAuthor.avatarUrl,
      authorId: comment.author_id,
      authorName: commentAuthor.name,
      body: comment.body,
      id: comment.id,
      insertedAt: comment.inserted_at,
    };
  });

  return {
    authorName: author.name,
    commentCount: counts.commentCount,
    comments,
    content: row.content,
    coverImageUrl: row.cover_image_url,
    excerpt: row.excerpt,
    id: row.id,
    publishedAt: row.published_at,
    reactionCount: counts.reactionCount,
    slug: row.slug,
    tags: row.tags ?? [],
    title: row.title,
    type: row.type ?? "blog",
  };
});

export const getPostCount = cache(async (): Promise<number> => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return 0;

  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  return count ?? 0;
});

export const searchPosts = cache(async (query: string): Promise<PostSummary[]> => {
  const supabase = createServerSupabaseClient();
  if (!supabase || !query.trim()) return [];

  const term = query.trim();

  const { data } = await supabase
    .from("posts")
    .select("id, slug, title, excerpt, cover_image_url, published_at, type, tags, profiles:author_id(display_name, username, avatar_url)")
    .eq("status", "published")
    .or(`title.ilike.%${term}%,content.ilike.%${term}%,excerpt.ilike.%${term}%`)
    .order("published_at", { ascending: false })
    .limit(20);

  if (!data?.length) return [];

  const rows = data as JoinedPost[];

  return Promise.all(
    rows.map(async (row) => {
      const author = normalizeAuthor(row.profiles);
      const counts = await getCounts(row.id, supabase as NonNullable<ReturnType<typeof createServerSupabaseClient>>);

      return {
        authorName: author.name,
        commentCount: counts.commentCount,
        coverImageUrl: row.cover_image_url,
        excerpt: row.excerpt,
        id: row.id,
        publishedAt: row.published_at,
        reactionCount: counts.reactionCount,
        slug: row.slug,
        tags: row.tags ?? [],
        title: row.title,
        type: row.type ?? "blog",
      };
    }),
  );
});

export const getAllTags = cache(async (): Promise<string[]> => {
  const supabase = createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("posts")
    .select("tags")
    .eq("status", "published");

  if (!data) return [];

  const tagSet = new Set<string>();
  (data as any[]).forEach((row) => {
    if (row.tags) {
      row.tags.forEach((tag: string) => tagSet.add(tag));
    }
  });

  return Array.from(tagSet).sort();
});