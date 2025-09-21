-- Fix critical security issue: Restrict profile visibility to authenticated users only
-- This prevents unauthorized access to user profile data (names, avatars, etc.)

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that only allows authenticated users to view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Optional: If you need authenticated users to view all profiles for some feature,
-- you could use this instead (but current app doesn't need this):
-- CREATE POLICY "Authenticated users can view all profiles" 
-- ON public.profiles 
-- FOR SELECT 
-- TO authenticated
-- USING (true);