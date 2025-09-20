import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRatings, type ProductRatingStats } from '@/hooks/useRatings';
import { Star, MessageSquare, Users } from 'lucide-react';

interface RatingDialogProps {
  product: any;
  trigger?: React.ReactNode;
}

const RatingDialog: React.FC<RatingDialogProps> = ({ product, trigger }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [open, setOpen] = useState(false);
  const [ratingStats, setRatingStats] = useState<ProductRatingStats | null>(null);
  const { getUserRating, submitRating, getProductRatingStats } = useRatings();

  const existingRating = getUserRating(product.product, product.brand, product.store);

  useEffect(() => {
    if (open) {
      loadRatingStats();
      if (existingRating) {
        setSelectedRating(existingRating.rating);
        setReview(existingRating.review || '');
      } else {
        setSelectedRating(0);
        setReview('');
      }
    }
  }, [open, existingRating]);

  const loadRatingStats = async () => {
    const stats = await getProductRatingStats(product.product, product.brand, product.store);
    setRatingStats(stats);
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
      setOpen(false);
      loadRatingStats(); // Refresh stats
    }
  };

  const StarRating = ({ rating, interactive = false, size = 20, onRatingChange }: {
    rating: number;
    interactive?: boolean;
    size?: number;
    onRatingChange?: (rating: number) => void;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const RatingDistribution = () => {
    if (!ratingStats || ratingStats.totalRatings === 0) return null;

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingStats.ratingDistribution[stars];
          const percentage = (count / ratingStats.totalRatings) * 100;
          
          return (
            <div key={stars} className="flex items-center gap-2 text-sm">
              <span className="w-8">{stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="h-auto p-1">
            <div className="flex items-center gap-1">
              <StarRating rating={ratingStats?.averageRating || 0} size={16} />
              <span className="text-sm font-medium">
                {ratingStats?.averageRating ? ratingStats.averageRating.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs text-muted-foreground">
                ({ratingStats?.totalRatings || 0})
              </span>
            </div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star size={20} />
            Rate Product
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Info */}
          <Card className="p-3 bg-muted/50">
            <div className="space-y-1">
              <h4 className="font-medium">{product.product}</h4>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Store:</span>
                <span>{product.store}</span>
              </div>
            </div>
          </Card>

          {/* Current Rating Stats */}
          {ratingStats && ratingStats.totalRatings > 0 && (
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={ratingStats.averageRating} size={18} />
                    <span className="font-semibold">{ratingStats.averageRating.toFixed(1)}</span>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users size={12} />
                    {ratingStats.totalRatings} {ratingStats.totalRatings === 1 ? 'review' : 'reviews'}
                  </Badge>
                </div>
                <RatingDistribution />
              </div>
            </Card>
          )}

          {/* Your Rating */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">
                {existingRating ? 'Update Your Rating' : 'Your Rating'}
              </Label>
              <div className="mt-2">
                <StarRating
                  rating={selectedRating}
                  interactive
                  size={32}
                  onRatingChange={setSelectedRating}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="review" className="flex items-center gap-2">
                <MessageSquare size={16} />
                Review (optional)
              </Label>
              <Textarea
                id="review"
                placeholder="Share your experience with this product..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitRating}
              disabled={selectedRating === 0}
              className="flex-1"
            >
              {existingRating ? 'Update Rating' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;