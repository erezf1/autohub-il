-- Add hot_sale_price column to vehicle_listings
ALTER TABLE public.vehicle_listings
ADD COLUMN hot_sale_price DECIMAL(10,2);

-- Add comment
COMMENT ON COLUMN public.vehicle_listings.hot_sale_price IS 'Special discounted price when vehicle is boosted';

-- Create function to cleanup expired boosts
CREATE OR REPLACE FUNCTION public.cleanup_expired_boosts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.vehicle_listings
  SET 
    is_boosted = false,
    boosted_until = NULL,
    hot_sale_price = NULL
  WHERE is_boosted = true 
    AND boosted_until IS NOT NULL 
    AND boosted_until < NOW();
END;
$$;

-- Create index for boost queries
CREATE INDEX IF NOT EXISTS idx_vehicle_listings_boosted 
ON public.vehicle_listings(is_boosted, boosted_until) 
WHERE is_boosted = true;