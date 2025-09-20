import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Flashlight, Image, Keyboard, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const Scan: React.FC = () => {
  const [scanMode, setScanMode] = useState<'camera' | 'manual' | 'result'>('camera');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [manualPrice, setManualPrice] = useState('');
  const { formatPrice } = useCurrency();

  const mockScanResult = {
    product: 'Coca-Cola Zero Sugar 12 Pack',
    brand: 'Coca-Cola',
    category: 'Beverages',
    barcode: '049000042566',
    averagePrice: 5.49,
    lowestPrice: 4.99,
    lowestStore: 'Target Downtown',
    priceRange: { min: 4.99, max: 6.99 }
  };

  const renderCameraView = () => (
    <div className="space-y-6">
      {/* Camera Viewfinder */}
      <Card className="aspect-square bg-black rounded-3xl overflow-hidden relative border-4 border-primary/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/70">
                <Camera size={48} className="mx-auto mb-2" />
                <p className="text-sm">Position barcode in frame</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scanning animation line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary opacity-80 animate-pulse"></div>
      </Card>

      {/* Camera Controls */}
      <div className="flex items-center justify-center space-x-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14"
          onClick={() => setFlashEnabled(!flashEnabled)}
        >
          <Flashlight className={flashEnabled ? 'text-warning' : 'text-muted-foreground'} size={24} />
        </Button>
        
        <Button
          size="lg"
          className="gradient-scan rounded-full w-20 h-20 shadow-scan"
          onClick={() => setScanMode('result')}
        >
          <Camera size={32} className="text-white" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-14 h-14"
        >
          <Image size={24} />
        </Button>
      </div>

      {/* Alternative Options */}
      <div className="space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Having trouble scanning?</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setScanMode('manual')}
        >
          <Keyboard className="mr-2" size={16} />
          Enter product manually
        </Button>
      </div>
    </div>
  );

  const renderManualEntry = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Keyboard className="mx-auto text-primary" size={48} />
        <h2 className="text-xl font-bold">Manual Entry</h2>
        <p className="text-muted-foreground">Enter product details manually</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Product Name</label>
          <Input placeholder="Enter product name..." />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Brand</label>
          <Input placeholder="Enter brand..." />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Price</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={manualPrice}
            onChange={(e) => setManualPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Store</label>
          <Input placeholder="Store name..." />
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full gradient-scan" onClick={() => setScanMode('result')}>
          Add Product
        </Button>
        <Button variant="outline" className="w-full" onClick={() => setScanMode('camera')}>
          Back to Scanner
        </Button>
      </div>
    </div>
  );

  const renderScanResult = () => (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-2">
        <CheckCircle2 className="mx-auto text-success animate-bounce-gentle" size={48} />
        <h2 className="text-xl font-bold">Product Found!</h2>
        <p className="text-muted-foreground">Product successfully identified</p>
      </div>

      {/* Product Details */}
      <Card className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">{mockScanResult.product}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{mockScanResult.brand}</Badge>
              <Badge variant="outline">{mockScanResult.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Barcode: {mockScanResult.barcode}
            </p>
          </div>
        </div>

        {/* Price Information */}
        <div className="space-y-3 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Average Price</p>
              <p className="text-xl font-bold">{formatPrice(mockScanResult.averagePrice)}</p>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <p className="text-sm text-success">Lowest Price</p>
              <p className="text-xl font-bold text-success">{formatPrice(mockScanResult.lowestPrice)}</p>
            </div>
          </div>
          
          <div className="text-center p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Best Deal Found At</p>
            <p className="font-semibold text-primary">{mockScanResult.lowestStore}</p>
          </div>
        </div>
      </Card>

      {/* Price Entry */}
      <Card className="p-4">
        <div className="space-y-3">
          <h4 className="font-semibold">Add Current Price</h4>
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="Enter price you see..."
              value={manualPrice}
              onChange={(e) => setManualPrice(e.target.value)}
              className="flex-1"
            />
            <Button className="gradient-success">
              Submit
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Help others by sharing the price you found
          </p>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full">
          View Price History
        </Button>
        <Button variant="outline" className="w-full" onClick={() => setScanMode('camera')}>
          Scan Another Product
        </Button>
      </div>
    </div>
  );

  return (
    <div className="pb-20 px-4 pt-6">
      {scanMode === 'camera' && renderCameraView()}
      {scanMode === 'manual' && renderManualEntry()}
      {scanMode === 'result' && renderScanResult()}
    </div>
  );
};

export default Scan;