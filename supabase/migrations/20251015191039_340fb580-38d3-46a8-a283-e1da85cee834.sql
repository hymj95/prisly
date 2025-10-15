-- Create stores table for Norwegian stores
CREATE TABLE public.stores (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  postal_code text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  category text,
  phone text,
  website text,
  opening_hours jsonb,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Public can view all stores
CREATE POLICY "Stores are viewable by everyone" 
ON public.stores 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert Norwegian stores
INSERT INTO public.stores (name, address, city, postal_code, latitude, longitude, category, verified) VALUES
('Rema 1000 - Sentrum', 'Storgata 20', 'Oslo', '0155', 59.9139, 10.7522, 'Grocery', true),
('Kiwi - Grünerløkka', 'Markveien 58', 'Oslo', '0554', 59.9227, 10.7583, 'Grocery', true),
('Meny - Majorstuen', 'Bogstadveien 44', 'Oslo', '0366', 59.9299, 10.7179, 'Grocery', true),
('Coop Extra - Tøyen', 'Hagegata 22', 'Oslo', '0653', 59.9201, 10.7680, 'Grocery', true),
('Bunnpris - Grønland', 'Tøyengata 2', 'Oslo', '0190', 59.9117, 10.7607, 'Grocery', true),
('Rema 1000 - Frogner', 'Frognerveien 40', 'Oslo', '0263', 59.9165, 10.7080, 'Grocery', true),
('Kiwi - Sagene', 'Sandakerveien 24', 'Oslo', '0473', 59.9315, 10.7445, 'Grocery', true),
('Meny - Torggata', 'Torggata 16', 'Oslo', '0181', 59.9158, 10.7493, 'Grocery', true),
('Coop Mega - Storo', 'Vitaminveien 7', 'Oslo', '0485', 59.9468, 10.7736, 'Grocery', true),
('Rema 1000 - Bislett', 'Pilestredet 75', 'Oslo', '0350', 59.9252, 10.7323, 'Grocery', true),
('Elkjøp - Oslo City', 'Stenersgata 1', 'Oslo', '0184', 59.9116, 10.7565, 'Electronics', true),
('Power - Aker Brygge', 'Stranden 3', 'Oslo', '0250', 59.9107, 10.7301, 'Electronics', true),
('Expert - Majorstuen', 'Valkyriegata 1', 'Oslo', '0366', 59.9285, 10.7155, 'Electronics', true),
('Apotek 1 - Sentrum', 'Karl Johans gate 20', 'Oslo', '0159', 59.9127, 10.7461, 'Pharmacy', true),
('Vitusapotek - Grünerløkka', 'Thorvald Meyers gate 40', 'Oslo', '0555', 59.9241, 10.7575, 'Pharmacy', true);
