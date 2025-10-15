-- Fix the security definer view issue by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.product_rating_summary;

CREATE VIEW public.product_rating_summary 
WITH (security_invoker=on) AS
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