import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PriceAlert {
  id: string;
  user_id: string;
  product_name: string;
  product_brand: string | null;
  target_price: number;
  current_price: number | null;
  store_name: string | null;
  store_location: string | null;
  is_active: boolean;
  alert_triggered: boolean;
  created_at: string;
  updated_at: string;
}

export const usePriceAlerts = () => {
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPriceAlerts();
    } else {
      setPriceAlerts([]);
      setLoading(false);
    }
  }, [user]);

  const fetchPriceAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPriceAlerts(data || []);
    } catch (error) {
      console.error('Error fetching price alerts:', error);
      toast.error('Failed to load price alerts');
    } finally {
      setLoading(false);
    }
  };

  const createPriceAlert = async (alert: {
    product_name: string;
    product_brand?: string;
    target_price: number;
    current_price?: number;
    store_name?: string;
    store_location?: string;
  }) => {
    if (!user) {
      toast.error('Please sign in to create price alerts');
      return { error: 'No user logged in' };
    }

    try {
      // Check if alert already exists for this product and store
      const { data: existing } = await supabase
        .from('price_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_name', alert.product_name)
        .eq('store_name', alert.store_name || '')
        .eq('is_active', true)
        .maybeSingle();

      if (existing) {
        toast.info('Price alert already exists for this product');
        return { error: 'Alert already exists' };
      }

      const { data, error } = await supabase
        .from('price_alerts')
        .insert([
          {
            user_id: user.id,
            ...alert,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setPriceAlerts(prev => [data, ...prev]);
      toast.success('Price alert created!');
      return { error: null };
    } catch (error) {
      console.error('Error creating price alert:', error);
      toast.error('Failed to create price alert');
      return { error };
    }
  };

  const updatePriceAlert = async (alertId: string, updates: Partial<PriceAlert>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .update(updates)
        .eq('id', alertId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setPriceAlerts(prev => 
        prev.map(alert => 
          alert.id === alertId ? data : alert
        )
      );

      toast.success('Price alert updated');
      return { error: null };
    } catch (error) {
      console.error('Error updating price alert:', error);
      toast.error('Failed to update price alert');
      return { error };
    }
  };

  const deletePriceAlert = async (alertId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Price alert deleted');
      return { error: null };
    } catch (error) {
      console.error('Error deleting price alert:', error);
      toast.error('Failed to delete price alert');
      return { error };
    }
  };

  const hasActiveAlert = (productName: string, storeName?: string) => {
    return priceAlerts.some(
      alert => 
        alert.product_name === productName && 
        alert.store_name === (storeName || '') &&
        alert.is_active
    );
  };

  return {
    priceAlerts,
    loading,
    createPriceAlert,
    updatePriceAlert,
    deletePriceAlert,
    hasActiveAlert,
    refetch: fetchPriceAlerts,
  };
};