-- Add policy to allow admins to update all vehicles
CREATE POLICY "Admins can update all vehicles"
ON public.vehicle_listings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));