import { z } from 'zod';

// Sanitize string inputs to prevent XSS
export const sanitizeInput = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const signupSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50).regex(/^[a-zA-Z0-9\s'-]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes'),
});

// Post schemas
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug must be less than 200 characters').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['blog', 'quote']),
  status: z.enum(['draft', 'published']),
  tags: z.string().max(500, 'Tags must be less than 500 characters').optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
});

// Comment schema
export const commentSchema = z.object({
  body: z.string().min(1, 'Comment is required').max(1000, 'Comment must be less than 1000 characters'),
});

// Profile schema
export const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50).regex(/^[a-zA-Z0-9\s'-]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and apostrophes'),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query must be less than 100 characters').optional(),
});