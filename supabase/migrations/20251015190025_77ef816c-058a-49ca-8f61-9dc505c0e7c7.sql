-- Fix PUBLIC_DATA_EXPOSURE: Product ratings expose user shopping patterns
-- Drop the overly permissive policy that allows viewing all ratings
DROP POLICY IF EXISTS "Users can view all ratings" ON public.ratings;

-- Create a policy that only allows users to see their own ratings
CREATE POLICY "Users can view their own ratings" 
ON public.ratings 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create an aggregated view for public rating statistics (without user_id exposure)
CREATE OR REPLACE VIEW public.product_rating_summary AS
SELECT 
  product_name,
  product_brand,
  store_name,
  store_location,
  ROUND(AVG(rating)::numeric, 2) as avg_rating,
  COUNT(*) as rating_count,
  COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_count,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM public.ratings
GROUP BY product_name, product_brand, store_name, store_location;

-- Grant access to the view
GRANT SELECT ON public.product_rating_summary TO authenticated, anon;

-- Fix INPUT_VALIDATION: Add database constraints for data validation
-- Add check constraints to price_scans table
DO $$
BEGIN
  ALTER TABLE public.price_scans ADD CONSTRAINT check_price_positive CHECK (price > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.price_scans ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.price_scans ADD CONSTRAINT check_product_name_length CHECK (char_length(product_name) <= 200 AND char_length(product_name) > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.price_scans ADD CONSTRAINT check_barcode_length CHECK (char_length(barcode) >= 8 AND char_length(barcode) <= 14);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add check constraints to ratings table
DO $$
BEGIN
  ALTER TABLE public.ratings ADD CONSTRAINT check_rating_range CHECK (rating BETWEEN 1 AND 5);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.ratings ADD CONSTRAINT check_rating_product_name_length CHECK (char_length(product_name) <= 200 AND char_length(product_name) > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add check constraints to price_alerts table
DO $$
BEGIN
  ALTER TABLE public.price_alerts ADD CONSTRAINT check_target_price_positive CHECK (target_price > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE public.price_alerts ADD CONSTRAINT check_alert_product_name_length CHECK (char_length(product_name) <= 200 AND char_length(product_name) > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add check constraints to wishlists table
DO $$
BEGIN
  ALTER TABLE public.wishlists ADD CONSTRAINT check_wishlist_product_name_length CHECK (char_length(product_name) <= 200 AND char_length(product_name) > 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;