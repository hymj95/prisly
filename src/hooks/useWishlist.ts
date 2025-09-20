import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface WishlistItem {
  id: string;
  user_id: string;
  product_name: string;
  product_brand: string | null;
  product_price: number | null;
  store_name: string | null;
  store_location: string | null;
  product_image: string | null;
  created_at: string;
  updated_at: string;
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item: {
    product_name: string;
    product_brand?: string;
    product_price?: number;
    store_name?: string;
    store_location?: string;
    product_image?: string;
  }) => {
    if (!user) {
      toast.error('Please sign in to add items to your wishlist');
      return { error: 'No user logged in' };
    }

    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_name', item.product_name)
        .eq('store_name', item.store_name || '')
        .maybeSingle();

      if (existing) {
        toast.info('Item is already in your wishlist');
        return { error: 'Item already exists' };
      }

      const { data, error } = await supabase
        .from('wishlists')
        .insert([
          {
            user_id: user.id,
            ...item,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setWishlistItems(prev => [data, ...prev]);
      toast.success('Added to wishlist!');
      return { error: null };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
      return { error };
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      toast.success('Removed from wishlist');
      return { error: null };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
      return { error };
    }
  };

  const isInWishlist = (productName: string, storeName?: string) => {
    return wishlistItems.some(
      item => 
        item.product_name === productName && 
        item.store_name === (storeName || '')
    );
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refetch: fetchWishlist,
  };
};