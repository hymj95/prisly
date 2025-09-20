import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Zap, 
  CheckCircle2, 
  Edit, 
  Save, 
  RotateCcw, 
  MapPin,
  Plus,
  Loader2,
  AlertCircle,
  Barcode,
  Package,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCurrency } from '@/hooks/useCurrency';
import StoreLocationManager from '../StoreLocationManager';

interface DetectedProduct {
  name: string;
  brand: string;
  category: string;
  barcode: string;
  price?: number;
}

interface Store {
  id: string;
  name: string;
  address: string;
  distance?: number;
}

const Scan: React.FC = () => {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<DetectedProduct | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showStoreManager, setShowStoreManager] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<DetectedProduct | null>(null);
  const [currentPrice, setCurrentPrice] = useState<string>('');

  // Mock detected stores
  const mockStores: Store[] = [
    { id: '1', name: 'Target', address: 'Downtown Mall', distance: 0.8 },
    { id: '2', name: 'Walmart', address: 'Shopping Center', distance: 1.2 },
    { id: '3', name: 'Whole Foods', address: 'Main Street', distance: 1.5 }
  ];

  // Mock product database
  const mockProducts: { [key: string]: DetectedProduct } = {
    '123456789': {
      name: 'Coca-Cola Classic 12 Pack',
      brand: 'Coca-Cola',
      category: 'Beverages',
      barcode: '123456789',
      price: 4.99
    },
    '987654321': {
      name: 'iPhone 15 Pro 256GB',
      brand: 'Apple',
      category: 'Electronics',
      barcode: '987654321',
      price: 999.99
    },
    '456789123': {
      name: 'Organic Bananas',
      brand: 'Whole Foods',
      category: 'Produce',
      barcode: '456789123',
      price: 2.49
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setSelectedStore(null);
    
    // Simulate camera scanning with random success/failure
    setTimeout(() => {
      const barcodes = Object.keys(mockProducts);
      const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
      
      // 80% success rate
      if (Math.random() > 0.2) {
        const product = mockProducts[randomBarcode];
        setScanResult(product);
        setEditedProduct(product);
        setCurrentPrice(product.price?.toString() || '');
        setIsScanning(false);
      } else {
        setError(t('scan.invalidBarcode'));
        setIsScanning(false);
      }
    }, 3000);
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setShowStoreManager(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editedProduct) {
      setScanResult({
        ...editedProduct,
        price: parseFloat(currentPrice) || 0
      });
      setIsEditing(false);
    }
  };

  const handleConfirmSave = () => {
    // Here you would save the scan result to your backend
    console.log('Saving scan result:', {
      product: scanResult,
      store: selectedStore,
      price: currentPrice,
      timestamp: new Date().toISOString()
    });
    
    // Reset for next scan
    setScanResult(null);
    setSelectedStore(null);
    setEditedProduct(null);
    setCurrentPrice('');
    setIsEditing(false);
    setError(null);
  };

  const handleScanAnother = () => {
    setScanResult(null);
    setSelectedStore(null);
    setEditedProduct(null);
    setCurrentPrice('');
    setIsEditing(false);
    setError(null);
  };

  // Store Manager View
  if (showStoreManager) {
    return (
      <div className="pb-20 px-4 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" onClick={() => setShowStoreManager(false)}>
            <MapPin size={20} />
          </Button>
          <h2 className="text-xl font-bold">{t('scan.addStore')}</h2>
        </div>
        <StoreLocationManager onStoreSelect={handleStoreSelect} />
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Barcode className="text-primary" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-primary">{t('scan.title')}</h1>
        <p className="text-muted-foreground">{t('scan.subtitle')}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Scanning State */}
      {!scanResult && (
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="relative">
              <div className={`w-48 h-48 mx-auto border-2 border-dashed rounded-lg flex items-center justify-center ${
                isScanning ? 'border-primary bg-primary/5 animate-pulse' : 'border-muted-foreground/30'
              }`}>
                {isScanning ? (
                  <div className="space-y-2">
                    <Loader2 className="mx-auto animate-spin text-primary" size={32} />
                    <p className="text-sm text-primary font-medium">{t('scan.scanning')}</p>
                  </div>
                ) : (
                  <Camera className="text-muted-foreground" size={64} />
                )}
              </div>
            </div>

            {!isScanning ? (
              <Button onClick={handleStartScan} className="bg-primary-solid text-white">
                <Zap size={16} className="mr-2" />
                {t('scan.startScanning')}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsScanning(false)}>
                {t('common.cancel')}
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Scan Result */}
      {scanResult && (
        <div className="space-y-4">
          {/* Success Header */}
          <Card className="p-4 bg-success/10 border-success/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-success" size={24} />
              <div>
                <h3 className="font-semibold text-success">{t('scan.productDetected')}</h3>
                <p className="text-sm text-success/80">
                  {isEditing ? t('scan.editInfo') : t('scan.confirmSave')}
                </p>
              </div>
            </div>
          </Card>

          {/* Product Information */}
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t('scan.productInfo')}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={isEditing ? handleSaveEdit : handleEdit}
                >
                  {isEditing ? (
                    <>
                      <Save size={14} className="mr-1" />
                      {t('common.save')}
                    </>
                  ) : (
                    <>
                      <Edit size={14} className="mr-1" />
                      {t('scan.editInfo')}
                    </>
                  )}
                </Button>
              </div>

              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('scan.productName')}</label>
                  {isEditing ? (
                    <Input
                      value={editedProduct?.name || ''}
                      onChange={(e) => setEditedProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{scanResult.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('scan.brand')}</label>
                    {isEditing ? (
                      <Input
                        value={editedProduct?.brand || ''}
                        onChange={(e) => setEditedProduct(prev => prev ? {...prev, brand: e.target.value} : null)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{scanResult.brand}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t('scan.category')}</label>
                    {isEditing ? (
                      <Input
                        value={editedProduct?.category || ''}
                        onChange={(e) => setEditedProduct(prev => prev ? {...prev, category: e.target.value} : null)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{scanResult.category}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t('scan.barcode')}</label>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{scanResult.barcode}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Price Information */}
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-semibold">{t('scan.currentPrice')}</h3>
              <div className="flex items-center gap-3">
                <DollarSign className="text-muted-foreground" size={20} />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="flex-1"
                />
              </div>
              {currentPrice && (
                <p className="text-sm text-muted-foreground">
                  {t('scan.price')}: {formatPrice(parseFloat(currentPrice))}
                </p>
              )}
            </div>
          </Card>

          {/* Store Selection */}
          <Card className="p-4">
            <div className="space-y-4">
              <h3 className="font-semibold">{t('scan.selectStore')}</h3>
              
              {selectedStore ? (
                <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-success" size={20} />
                    <div>
                      <p className="font-medium">{selectedStore.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedStore.address}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedStore(null)}>
                    {t('common.change')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{t('scan.noStoreDetected')}</AlertDescription>
                  </Alert>

                  <div className="grid gap-2">
                    {mockStores.map((store) => (
                      <Card 
                        key={store.id} 
                        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedStore(store)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MapPin className="text-muted-foreground" size={16} />
                            <div>
                              <p className="font-medium text-sm">{store.name}</p>
                              <p className="text-xs text-muted-foreground">{store.address}</p>
                            </div>
                          </div>
                          {store.distance && (
                            <Badge variant="outline" className="text-xs">
                              {store.distance.toFixed(1)} km
                            </Badge>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">{t('scan.storeNotListed')}</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowStoreManager(true)}
                    >
                      <Plus size={14} className="mr-1" />
                      {t('scan.addManually')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-primary-solid text-white" 
              onClick={handleConfirmSave}
              disabled={!selectedStore || !currentPrice}
            >
              <Save size={16} className="mr-2" />
              {t('scan.confirmSave')}
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleScanAnother}>
                <RotateCcw size={16} className="mr-2" />
                {t('scan.scanAnother')}
              </Button>
              <Button variant="outline" onClick={handleStartScan}>
                <Zap size={16} className="mr-2" />
                {t('scan.retry')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scan;