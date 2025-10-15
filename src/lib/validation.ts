import { z } from 'zod';

// Price Scan Validation Schema
export const priceScanSchema = z.object({
  product_name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name too long'),
  product_brand: z.string().trim().max(100, 'Brand name too long').optional().or(z.literal('')),
  product_category: z.string().trim().max(100, 'Category name too long').optional().or(z.literal('')),
  barcode: z.string().trim().min(8, 'Barcode must be at least 8 digits').max(14, 'Barcode must be at most 14 digits'),
  price: z.number().positive('Price must be positive').max(999999.99, 'Price too large'),
  quantity: z.number().positive('Quantity must be positive').max(9999, 'Quantity too large'),
  store_name: z.string().trim().min(1, 'Store name is required').max(200, 'Store name too long'),
  store_location: z.string().trim().max(500, 'Store location too long').optional().or(z.literal('')),
  product_image: z.string().trim().optional().or(z.literal('')),
});

export type PriceScanInput = z.infer<typeof priceScanSchema>;

// Rating Validation Schema
export const ratingSchema = z.object({
  product_name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name too long'),
  product_brand: z.string().trim().max(100, 'Brand name too long').optional().or(z.literal('')),
  rating: z.number().int('Rating must be a whole number').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  review: z.string().trim().max(2000, 'Review too long').optional().or(z.literal('')),
  store_name: z.string().trim().max(200, 'Store name too long').optional().or(z.literal('')),
  store_location: z.string().trim().max(500, 'Store location too long').optional().or(z.literal('')),
});

export type RatingInput = z.infer<typeof ratingSchema>;

// Price Alert Validation Schema
export const priceAlertSchema = z.object({
  product_name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name too long'),
  product_brand: z.string().trim().max(100, 'Brand name too long').optional().or(z.literal('')),
  target_price: z.number().positive('Target price must be positive').max(999999.99, 'Target price too large'),
  current_price: z.number().positive('Current price must be positive').max(999999.99, 'Current price too large').optional(),
  store_name: z.string().trim().max(200, 'Store name too long').optional().or(z.literal('')),
  store_location: z.string().trim().max(500, 'Store location too long').optional().or(z.literal('')),
});

export type PriceAlertInput = z.infer<typeof priceAlertSchema>;

// Wishlist Validation Schema
export const wishlistSchema = z.object({
  product_name: z.string().trim().min(1, 'Product name is required').max(200, 'Product name too long'),
  product_brand: z.string().trim().max(100, 'Brand name too long').optional().or(z.literal('')),
  product_price: z.number().positive('Price must be positive').max(999999.99, 'Price too large').optional(),
  store_name: z.string().trim().max(200, 'Store name too long').optional().or(z.literal('')),
  store_location: z.string().trim().max(500, 'Store location too long').optional().or(z.literal('')),
  product_image: z.string().trim().optional().or(z.literal('')),
});

export type WishlistInput = z.infer<typeof wishlistSchema>;
