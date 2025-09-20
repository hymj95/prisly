-- Create wishlist table
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT,
  product_price DECIMAL(10,2),
  store_name TEXT,
  store_location TEXT,
  product_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wishlist items" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist items" 
ON public.wishlists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create price alerts table
CREATE TABLE public.price_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT,
  target_price DECIMAL(10,2) NOT NULL,
  current_price DECIMAL(10,2),
  store_name TEXT,
  store_location TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  alert_triggered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own price alerts" 
ON public.price_alerts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own price alerts" 
ON public.price_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price alerts" 
ON public.price_alerts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price alerts" 
ON public.price_alerts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_wishlists_updated_at
BEFORE UPDATE ON public.wishlists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at
BEFORE UPDATE ON public.price_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();