-- Fix the security definer view issue by adding security_invoker=on
ALTER VIEW public.product_rating_summary SET (security_invoker = on);