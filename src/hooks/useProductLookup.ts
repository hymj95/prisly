import { useState } from 'react';
import { toast } from 'sonner';

export interface ProductInfo {
  name: string;
  brand: string;
  category: string;
  barcode: string;
  price?: number;
  image?: string;
  description?: string;
}

// Mock product database - in a real app, this would be an API call
const mockProductDatabase: { [key: string]: ProductInfo } = {
  '123456789012': {
    name: 'Coca-Cola Classic 12 Pack',
    brand: 'Coca-Cola',
    category: 'Beverages',
    barcode: '123456789012',
    price: 4.99,
    description: 'Classic Coca-Cola 12 pack cans'
  },
  '987654321098': {
    name: 'iPhone 15 Pro 256GB',
    brand: 'Apple',
    category: 'Electronics',
    barcode: '987654321098',
    price: 999.99,
    description: 'Apple iPhone 15 Pro with 256GB storage'
  },
  '456789123456': {
    name: 'Organic Bananas',
    brand: 'Whole Foods',
    category: 'Produce',
    barcode: '456789123456',
    price: 2.49,
    description: 'Fresh organic bananas'
  },
  '789123456789': {
    name: 'Tide Laundry Detergent',
    brand: 'Tide',
    category: 'Household',
    barcode: '789123456789',
    price: 12.99,
    description: 'Tide liquid laundry detergent 100oz'
  },
  '321654987321': {
    name: 'Cheerios Cereal',
    brand: 'General Mills',
    category: 'Food',
    barcode: '321654987321',
    price: 4.49,
    description: 'Honey Nut Cheerios cereal'
  }
};

export const useProductLookup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const lookupProduct = async (barcode: string): Promise<ProductInfo | null> => {
    setIsLoading(true);
    
    try {
      // Try OpenFoodFacts API
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product = data.product;
        const productInfo: ProductInfo = {
          name: product.product_name || 'Unknown Product',
          brand: product.brands || 'Unknown Brand',
          category: product.categories_tags?.[0]?.replace('en:', '') || 'Unknown',
          barcode: barcode,
          price: undefined,
          image: product.image_url || product.image_front_url,
          description: product.generic_name || product.product_name || 'Product details not available'
        };
        
        toast.success(`Product found: ${productInfo.name}`);
        return productInfo;
      } else {
        // Check mock database as fallback
        const mockProduct = mockProductDatabase[barcode];
        
        if (mockProduct) {
          toast.success(`Product found: ${mockProduct.name}`);
          return mockProduct;
        }
        
        toast.info('Product not found. Please enter details manually.');
        return {
          name: 'Unknown Product',
          brand: 'Unknown Brand',
          category: 'Unknown',
          barcode: barcode,
          description: 'Product details not available'
        };
      }
    } catch (error) {
      console.error('Product lookup error:', error);
      
      // Try mock database as fallback on error
      const mockProduct = mockProductDatabase[barcode];
      if (mockProduct) {
        toast.success(`Product found: ${mockProduct.name}`);
        return mockProduct;
      }
      
      toast.error('Failed to lookup product');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const searchProducts = async (query: string): Promise<ProductInfo[]> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const results = Object.values(mockProductDatabase).filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      
      return results;
    } catch (error) {
      console.error('Product search error:', error);
      toast.error('Failed to search products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupProduct,
    searchProducts,
    isLoading
  };
};