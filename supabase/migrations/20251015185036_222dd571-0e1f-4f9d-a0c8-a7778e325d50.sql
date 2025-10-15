-- Create table for price scans
CREATE TABLE public.price_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_brand TEXT,
  product_category TEXT,
  barcode TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  store_name TEXT NOT NULL,
  store_location TEXT,
  product_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.price_scans ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own price scans" 
ON public.price_scans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own price scans" 
ON public.price_scans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price scans" 
ON public.price_scans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price scans" 
ON public.price_scans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_price_scans_updated_at
BEFORE UPDATE ON public.price_scans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_price_scans_user_id ON public.price_scans(user_id);
CREATE INDEX idx_price_scans_barcode ON public.price_scans(barcode);
CREATE INDEX idx_price_scans_created_at ON public.price_scans(created_at DESC);