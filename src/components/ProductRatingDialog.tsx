import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useRatings, type Rating } from '@/hooks/useRatings';
import { useAuth } from '@/hooks/useAuth';
import { Star, MessageSquare, TrendingUp, Users, BarChart3 } from 'lucide-react';

interface ProductRatingDialogProps {
  product: any;
  trigger?: React.ReactNode;
}

const ProductRatingDialog: React.FC<ProductRatingDialogProps> = ({ product, trigger }) => {
  const [open, setOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [productRatings, setProductRatings] = useState<Rating[]>([]);
  
  const { getProductRatings, getProductRatingStats, getUserRating, submitRating } = useRatings();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      loadRatings();
    }
  }, [open]);

  const loadRatings = async () => {
    // Load all ratings for this product
    const ratings = await getProductRatings(product.product, product.brand, product.store);
    setProductRatings(ratings);

    // Load user's existing rating if logged in
    if (user) {
      const userRatingData = getUserRating(product.product, product.brand, product.store);
      if (userRatingData) {
        setUserRating(userRatingData);
        setSelectedRating(userRatingData.rating);
        setReview(userRatingData.review || '');
      }
    }
  };

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      return;
    }

    const result = await submitRating({
      product_name: product.product,
      product_brand: product.brand,
      store_name: product.store,
      store_location: product.location,
      rating: selectedRating,
      review: review.trim() || undefined,
    });

    if (!result.error) {
      await loadRatings(); // Refresh ratings
      setOpen(false);
    }
  };

  const ratingStats = productRatings.length > 0 ? {
    averageRating: productRatings.reduce((sum, r) => sum + r.rating, 0) / productRatings.length,
    totalRatings: productRatings.length,
    ratingDistribution: productRatings.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as { [key: number]: number })
  } : {
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  const StarRating = ({ rating, size = 16, interactive = false, onRate }: {
    rating: number;
    size?: number;
    interactive?: boolean;
    onRate?: (rating: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="p-0 h-auto">
            <div className="flex items-center gap-2">
              <StarRating rating={ratingStats.averageRating} />
              <span className="font-bold">{ratingStats.averageRating || 0}</span>
              <span className="text-sm text-muted-foreground">
                ({ratingStats.totalRatings} {ratingStats.totalRatings === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star size={20} className="text-yellow-400" />
            Product Rating
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Info */}
          <Card className="p-3 bg-muted/50">
            <div className="space-y-1">
              <h4 className="font-medium">{product.product}</h4>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <p className="text-sm text-muted-foreground">{product.store} • {product.location}</p>
            </div>
          </Card>

          {/* Overall Rating Stats */}
          <div className="space-y-3">
            <h4 className="font-medium">Overall Rating</h4>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{ratingStats.averageRating || 0}</div>
                <StarRating rating={ratingStats.averageRating} size={20} />
                <div className="text-sm text-muted-foreground mt-1">
                  {ratingStats.totalRatings} {ratingStats.totalRatings === 1 ? 'review' : 'reviews'}
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <span className="w-3">{star}</span>
                    <Star size={12} className="text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${ratingStats.totalRatings > 0 
                            ? (ratingStats.ratingDistribution[star] / ratingStats.totalRatings) * 100 
                            : 0}%`
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{ratingStats.ratingDistribution[star] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Rating Section */}
          {user ? (
            <div className="space-y-3">
              <h4 className="font-medium">
                {userRating ? 'Update Your Rating' : 'Rate This Product'}
              </h4>
              
              <div className="space-y-3">
                <div>
                  <Label>Your Rating</Label>
                  <div className="mt-2">
                    <StarRating
                      rating={hoverRating || selectedRating}
                      size={24}
                      interactive
                      onRate={setSelectedRating}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="review">Review (Optional)</Label>
                  <Textarea
                    id="review"
                    placeholder="Share your experience with this product..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleSubmitRating}
                  disabled={selectedRating === 0}
                  className="w-full"
                >
                  {userRating ? 'Update Rating' : 'Submit Rating'}
                </Button>
              </div>
            </div>
          ) : (
            <Card className="p-4 text-center">
              <p className="text-muted-foreground mb-2">Sign in to rate this product</p>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Sign In
              </Button>
            </Card>
          )}

          {/* Recent Reviews */}
          {productRatings.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Recent Reviews</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {productRatings.slice(0, 5).map((rating) => (
                  <Card key={rating.id} className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <StarRating rating={rating.rating} size={14} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {rating.review && (
                      <p className="text-sm text-muted-foreground">{rating.review}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductRatingDialog;