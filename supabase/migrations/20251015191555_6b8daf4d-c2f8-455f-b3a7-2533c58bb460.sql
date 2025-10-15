-- Allow authenticated users to add new stores
CREATE POLICY "Authenticated users can add stores" 
ON public.stores 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow users to update stores (for corrections)
CREATE POLICY "Authenticated users can update stores" 
ON public.stores 
FOR UPDATE 
TO authenticated
USING (true);
