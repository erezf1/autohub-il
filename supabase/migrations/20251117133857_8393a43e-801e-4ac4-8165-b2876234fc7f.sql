-- Add admin policies to view all user-related data
CREATE POLICY "Admins can view all auctions"
ON public.auctions
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all ISO requests"
ON public.iso_requests
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all bids"
ON public.auction_bids
FOR SELECT
USING (public.is_admin(auth.uid()));