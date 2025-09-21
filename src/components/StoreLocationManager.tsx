import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Loader2, AlertCircle, Store, Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useLocationStores } from '@/hooks/useLocationStores';

interface StoreLocationManagerProps {
  onStoreSelect: (store: any) => void;
}

const StoreLocationManager: React.FC<StoreLocationManagerProps> = ({ onStoreSelect }) => {
  const { t } = useLanguage();
  const { 
    detectedCountry,
    userCountry, 
    currentCountry,
    stores, 
    isDetecting, 
    detectionError,
    detectLocation,
    setCountryManually,
    getAvailableCountries
  } = useLocationStores();

  const availableCountries = getAvailableCountries();

  return (
    <div className="space-y-6">
      {/* Location Detection Status */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Navigation className="text-primary" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold">{t('store.locationDetection')}</h3>
              <p className="text-sm text-muted-foreground">
                {isDetecting ? t('store.detectingLocation') : 
                 currentCountry ? `${t('store.currentLocation')}: ${availableCountries.find(c => c.code === currentCountry)?.name}` :
                 t('store.locationNotDetected')}
              </p>
            </div>
            {isDetecting && <Loader2 className="animate-spin text-primary" size={20} />}
          </div>

          {detectionError && (
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-card">
              <AlertCircle className="text-warning" size={16} />
              <p className="text-sm text-warning">{detectionError}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={detectLocation}
              disabled={isDetecting}
              className="flex items-center gap-2"
            >
              <Navigation size={14} />
              {isDetecting ? t('store.detecting') : t('store.detectLocation')}
            </Button>
          </div>
        </div>
      </Card>

      {/* Manual Country Selection */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" size={20} />
            <div>
              <h3 className="font-semibold">{t('store.manualSelection')}</h3>
              <p className="text-sm text-muted-foreground">{t('store.selectCountryManually')}</p>
            </div>
          </div>

          <Select 
            value={userCountry || ''} 
            onValueChange={setCountryManually}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('store.selectCountry')} />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border">
              {availableCountries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Available Stores */}
      {stores.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Store className="text-primary" size={20} />
              <div>
                <h3 className="font-semibold">{t('store.availableStores')}</h3>
                <p className="text-sm text-muted-foreground">
                  {stores.length} {t('store.storesFound')} {currentCountry && `in ${availableCountries.find(c => c.code === currentCountry)?.name}`}
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {stores.map((store) => (
                <Card 
                  key={store.id}
                  className="p-3 cursor-pointer hover:shadow-minimalist transition-all duration-300 hover:scale-[1.02] rounded-card border-minimal"
                  onClick={() => onStoreSelect(store)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{store.name}</h4>
                        <Badge variant="outline" className="text-xs">{store.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={12} />
                        <span>{store.location}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Button variant="outline" size="sm">
                        {t('store.select')}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* No Stores Message */}
      {!isDetecting && stores.length === 0 && currentCountry && (
        <Card className="p-6 text-center">
          <Store className="text-muted-foreground mx-auto mb-3" size={32} />
          <h3 className="font-medium mb-2">{t('store.noStoresFound')}</h3>
          <p className="text-sm text-muted-foreground">
            {t('store.noStoresMessage')}
          </p>
        </Card>
      )}
    </div>
  );
};

export default StoreLocationManager;