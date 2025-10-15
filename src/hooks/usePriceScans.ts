import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { priceScanSchema } from '@/lib/validation';

export interface PriceScan {
  id: string;
  user_id: string;
  product_name: string;
  product_brand: string | null;
  product_category: string | null;
  barcode: string;
  price: number;
  quantity: number;
  store_name: string;
  store_location: string | null;
  product_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePriceScanInput {
  product_name: string;
  product_brand?: string;
  product_category?: string;
  barcode: string;
  price: number;
  quantity: number;
  store_name: string;
  store_location?: string;
  product_image?: string;
}

export const usePriceScans = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createPriceScan = async (input: CreatePriceScanInput): Promise<PriceScan | null> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to save scans');
        return null;
      }

      // Validate input
      const validationResult = priceScanSchema.safeParse(input);
      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0].message;
        toast.error(`Invalid input: ${errorMessage}`);
        return null;
      }

      const validatedData = validationResult.data;

      // Check if scan already exists for this barcode and store
      const { data: existingScans, error: queryError } = await supabase
        .from('price_scans')
        .select('*')
        .eq('user_id', user.id)
        .eq('barcode', validatedData.barcode)
        .eq('store_name', validatedData.store_name)
        .order('created_at', { ascending: false })
        .limit(1);

      if (queryError) {
        console.error('Error checking existing scans:', queryError);
      }

      // If exists and price is the same, don't save
      if (existingScans && existingScans.length > 0) {
        const existingScan = existingScans[0];
        if (parseFloat(existingScan.price as any) === validatedData.price) {
          toast.info('This price is already in your history');
          return existingScan as PriceScan;
        } else {
          toast.info(`Price updated from ${existingScan.price} to ${validatedData.price}`);
        }
      }

      const { data, error } = await supabase
        .from('price_scans')
        .insert({
          user_id: user.id,
          product_name: validatedData.product_name,
          product_brand: validatedData.product_brand || null,
          product_category: validatedData.product_category || null,
          barcode: validatedData.barcode,
          price: validatedData.price,
          quantity: validatedData.quantity,
          store_name: validatedData.store_name,
          store_location: validatedData.store_location || null,
          product_image: validatedData.product_image || null
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating price scan:', error);
        toast.error('Failed to save scan');
        return null;
      }

      toast.success('Scan saved successfully!');
      return data as PriceScan;
    } catch (error) {
      console.error('Error in createPriceScan:', error);
      toast.error('Failed to save scan');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPriceScans = async (): Promise<PriceScan[]> => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('price_scans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching price scans:', error);
        toast.error('Failed to load scans');
        return [];
      }

      return (data as PriceScan[]) || [];
    } catch (error) {
      console.error('Error in getPriceScans:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const deletePriceScan = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('price_scans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting price scan:', error);
        toast.error('Failed to delete scan');
        return false;
      }

      toast.success('Scan deleted');
      return true;
    } catch (error) {
      console.error('Error in deletePriceScan:', error);
      toast.error('Failed to delete scan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPriceScan,
    getPriceScans,
    deletePriceScan,
    isLoading
  };
};
