-- Phase 4: Change engine_size from DECIMAL(3,1) to NUMERIC (no limits)
-- This allows storing engine sizes in cubic centimeters (cc) without upper limit

ALTER TABLE public.vehicle_listings 
ALTER COLUMN engine_size TYPE NUMERIC;

COMMENT ON COLUMN public.vehicle_listings.engine_size IS 'Engine size in cubic centimeters (cc), no upper limit';