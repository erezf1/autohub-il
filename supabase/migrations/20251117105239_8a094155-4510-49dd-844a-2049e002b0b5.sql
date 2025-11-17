-- Add policy to allow admins to view all vehicles
CREATE POLICY "Admins can view all vehicles"
ON public.vehicle_listings
FOR SELECT
USING (public.is_admin(auth.uid()));