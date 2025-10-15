import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { ratingSchema } from '@/lib/validation';

export interface Rating {
  id: string;
  user_id: string;
  product_name: string;
  product_brand: string | null;
  store_name: string | null;
  store_location: string | null;
  rating: number;
  review: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductRatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
}

export const useRatings = () => {
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRatings();
    } else {
      setUserRatings([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRatings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUserRatings(data || []);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      toast.error('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const getProductRatings = async (productName: string, productBrand?: string, storeName?: string): Promise<Rating[]> => {
    try {
      let query = supabase
        .from('ratings')
        .select('*')
        .eq('product_name', productName);

      if (productBrand) {
        query = query.eq('product_brand', productBrand);
      }

      if (storeName) {
        query = query.eq('store_name', storeName);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching product ratings:', error);
      return [];
    }
  };

  const getProductRatingStats = async (productName: string, productBrand?: string, storeName?: string): Promise<ProductRatingStats> => {
    try {
      const ratings = await getProductRatings(productName, productBrand, storeName);
      
      if (ratings.length === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      const totalRatings = ratings.length;
      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const averageRating = sum / totalRatings;

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach(rating => {
        ratingDistribution[rating.rating as keyof typeof ratingDistribution]++;
      });

      return {
        averageRating,
        totalRatings,
        ratingDistribution
      };
    } catch (error) {
      console.error('Error calculating rating stats:', error);
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  };

  const getUserRating = (productName: string, productBrand?: string, storeName?: string): Rating | null => {
    return userRatings.find(
      rating =>
        rating.product_name === productName &&
        rating.product_brand === (productBrand || null) &&
        rating.store_name === (storeName || null)
    ) || null;
  };

  const submitRating = async (ratingData: {
    product_name: string;
    product_brand?: string;
    store_name?: string;
    store_location?: string;
    rating: number;
    review?: string;
  }) => {
    if (!user) {
      toast.error('Please sign in to rate products');
      return { error: 'No user logged in' };
    }

    // Validate input
    const validationResult = ratingSchema.safeParse(ratingData);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0].message;
      toast.error(`Invalid input: ${errorMessage}`);
      return { error: 'Validation failed' };
    }

    const validatedData = validationResult.data;

    try {
      const existingRating = getUserRating(validatedData.product_name, validatedData.product_brand, validatedData.store_name);

      if (existingRating) {
        // Update existing rating
        const { data, error } = await supabase
          .from('ratings')
          .update({
            rating: validatedData.rating,
            review: validatedData.review || null,
          })
          .eq('id', existingRating.id)
          .select()
          .single();

        if (error) throw error;

        setUserRatings(prev =>
          prev.map(rating =>
            rating.id === existingRating.id ? data : rating
          )
        );

        toast.success('Rating updated!');
      } else {
        // Create new rating
        const { data, error } = await supabase
          .from('ratings')
          .insert([
            {
              user_id: user.id,
              product_name: validatedData.product_name,
              product_brand: validatedData.product_brand || null,
              store_name: validatedData.store_name || null,
              store_location: validatedData.store_location || null,
              rating: validatedData.rating,
              review: validatedData.review || null,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        setUserRatings(prev => [data, ...prev]);
        toast.success('Rating submitted!');
      }

      return { error: null };
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
      return { error };
    }
  };

  const deleteRating = async (ratingId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', ratingId)
        .eq('user_id', user.id);

      if (error) throw error;

      setUserRatings(prev => prev.filter(rating => rating.id !== ratingId));
      toast.success('Rating deleted');
      return { error: null };
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error('Failed to delete rating');
      return { error };
    }
  };

  return {
    userRatings,
    loading,
    getProductRatings,
    getProductRatingStats,
    getUserRating,
    submitRating,
    deleteRating,
    refetch: fetchUserRatings,
  };
};