-- ============================================
-- Two Thumbs Up - Role Management Setup
-- Run this in Supabase SQL Editor to ensure
-- only the first 2 users are admins
-- ============================================

-- First, reset all existing users to 'member' role
-- (except the first 2 if you want to keep them as admins)
UPDATE public.profiles SET role = 'member' WHERE id NOT IN (
  SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 2
);

-- Verify the trigger function is correct
-- This ensures only the first 2 signups become admins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public 
AS $$
DECLARE
  derived_username text;
  admin_count integer;
BEGIN
  -- Get username from metadata or email
  derived_username := coalesce(
    new.raw_user_meta_data ->> 'username',
    split_part(coalesce(new.email, ''), '@', 1)
  );
  
  -- Count current admins
  SELECT count(*) INTO admin_count FROM public.profiles WHERE role = 'admin';
  
  -- Insert new profile
  -- First 2 users become 'admin', everyone else becomes 'member'
  INSERT INTO public.profiles (id, username, display_name, role)
  VALUES (
    new.id,
    nullif(derived_username, ''),
    nullif(coalesce(new.raw_user_meta_data ->> 'display_name', derived_username), ''),
    CASE WHEN admin_count < 2 THEN 'admin' ELSE 'member' END
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Verify current admin count
SELECT COUNT(*) as admin_count FROM public.profiles WHERE role = 'admin';

-- List all users and their roles
SELECT 
  p.id,
  p.display_name,
  p.username,
  p.role,
  p.created_at,
  u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at ASC;