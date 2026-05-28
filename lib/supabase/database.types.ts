export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string;
          body: string;
          id: string;
          inserted_at: string;
          post_id: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          body: string;
          id?: string;
          inserted_at?: string;
          post_id: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          body?: string;
          id?: string;
          inserted_at?: string;
          post_id?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          author_id: string;
          content: string;
          cover_image_url: string | null;
          excerpt: string;
          id: string;
          inserted_at: string;
          published_at: string | null;
          slug: string;
          status: "draft" | "published";
          tags: string[] | null;
          title: string;
          type: "blog" | "quote";
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          cover_image_url?: string | null;
          excerpt: string;
          id?: string;
          inserted_at?: string;
          published_at?: string | null;
          slug: string;
          status?: "draft" | "published";
          tags?: string[] | null;
          title: string;
          type?: "blog" | "quote";
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          cover_image_url?: string | null;
          excerpt?: string;
          id?: string;
          inserted_at?: string;
          published_at?: string | null;
          slug?: string;
          status?: "draft" | "published";
          tags?: string[] | null;
          title?: string;
          type?: "blog" | "quote";
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          role: "admin" | "member";
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          role?: "admin" | "member";
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          role?: "admin" | "member";
          updated_at?: string;
          username?: string | null;
        };
      };
      reactions: {
        Row: {
          id: string;
          inserted_at: string;
          kind: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          inserted_at?: string;
          kind?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          inserted_at?: string;
          kind?: string;
          post_id?: string;
          user_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
