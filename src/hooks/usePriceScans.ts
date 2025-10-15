import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PriceScan {
  id: string;
  user_id: string;
  product_name: string;
  product_brand?: string;
  product_category?: string;
  barcode: string;
  price: number;
  quantity: number;
  store_name: string;
  store_location?: string;
  product_image?: string;
  created_at: string;
  updated_at: string;
}

export const usePriceScans = () => {
  const queryClient = useQueryClient();

  const { data: scans = [], isLoading } = useQuery({
    queryKey: ['price-scans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('price_scans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PriceScan[];
    },
  });

  const createScan = useMutation({
    mutationFn: async (scan: Omit<PriceScan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('price_scans')
        .insert({
          ...scan,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-scans'] });
      toast.success('Scan saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving scan:', error);
      toast.error('Failed to save scan');
    },
  });

  const deleteScan = useMutation({
    mutationFn: async (scanId: string) => {
      const { error } = await supabase
        .from('price_scans')
        .delete()
        .eq('id', scanId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['price-scans'] });
      toast.success('Scan deleted');
    },
    onError: (error) => {
      console.error('Error deleting scan:', error);
      toast.error('Failed to delete scan');
    },
  });

  return {
    scans,
    isLoading,
    createScan: createScan.mutateAsync,
    deleteScan: deleteScan.mutateAsync,
  };
};
