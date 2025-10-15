import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

      // Check if scan already exists for this barcode and store
      const { data: existingScans, error: queryError } = await supabase
        .from('price_scans')
        .select('*')
        .eq('user_id', user.id)
        .eq('barcode', input.barcode)
        .eq('store_name', input.store_name)
        .order('created_at', { ascending: false })
        .limit(1);

      if (queryError) {
        console.error('Error checking existing scans:', queryError);
      }

      // If exists and price is the same, don't save
      if (existingScans && existingScans.length > 0) {
        const existingScan = existingScans[0];
        if (parseFloat(existingScan.price as any) === input.price) {
          toast.info('This price is already in your history');
          return existingScan as PriceScan;
        } else {
          toast.info(`Price updated from ${existingScan.price} to ${input.price}`);
        }
      }

      const { data, error } = await supabase
        .from('price_scans')
        .insert({
          user_id: user.id,
          product_name: input.product_name,
          product_brand: input.product_brand || null,
          product_category: input.product_category || null,
          barcode: input.barcode,
          price: input.price,
          quantity: input.quantity,
          store_name: input.store_name,
          store_location: input.store_location || null,
          product_image: input.product_image || null
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
