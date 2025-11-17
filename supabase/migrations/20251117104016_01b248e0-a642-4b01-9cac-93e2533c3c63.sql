-- Fix RLS policy on users table to allow admin updates
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));