import { useState } from 'react';
import { BarcodeScanner, BarcodeFormat } from '@capacitor-mlkit/barcode-scanning';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';

export interface ScannedBarcode {
  displayValue: string;
  format: BarcodeFormat;
  rawValue: string;
  valueType: string;
}

export const useBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<ScannedBarcode | null>(null);

  const checkPermissions = async () => {
    try {
      const { camera } = await BarcodeScanner.checkPermissions();
      return camera;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return 'denied';
    }
  };

  const requestPermissions = async () => {
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      return camera;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return 'denied';
    }
  };

  const startScan = async (): Promise<ScannedBarcode | null> => {
    // Check if we're on a mobile device (native or web)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || Capacitor.isNativePlatform();
    
    if (!isMobile) {
      toast.error('Barcode scanning is only available on mobile devices');
      return null;
    }

    try {
      setIsScanning(true);

      // Check and request permissions
      let permissionStatus = await checkPermissions();
      if (permissionStatus !== 'granted') {
        permissionStatus = await requestPermissions();
        if (permissionStatus !== 'granted') {
          toast.error('Camera permission is required to scan barcodes');
          return null;
        }
      }

      // Check if scanner is available
      const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
      if (!available) {
        await BarcodeScanner.installGoogleBarcodeScannerModule();
      }

      // Start scanning
      const result = await BarcodeScanner.scan({
        formats: [
          BarcodeFormat.QrCode,
          BarcodeFormat.Ean13,
          BarcodeFormat.Ean8,
          BarcodeFormat.UpcA,
          BarcodeFormat.UpcE,
          BarcodeFormat.Code128,
          BarcodeFormat.Code39,
          BarcodeFormat.Code93,
          BarcodeFormat.Codabar,
          BarcodeFormat.DataMatrix,
          BarcodeFormat.Pdf417,
          BarcodeFormat.Aztec,
        ],
      });

      if (result.barcodes && result.barcodes.length > 0) {
        const barcode = result.barcodes[0];
        const scannedCode: ScannedBarcode = {
          displayValue: barcode.displayValue,
          format: barcode.format,
          rawValue: barcode.rawValue,
          valueType: barcode.valueType,
        };
        
        setLastScannedCode(scannedCode);
        toast.success(`Barcode scanned: ${barcode.displayValue}`);
        return scannedCode;
      } else {
        toast.info('No barcode detected');
        return null;
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      toast.error('Failed to scan barcode');
      return null;
    } finally {
      setIsScanning(false);
    }
  };

  return {
    isScanning,
    lastScannedCode,
    startScan,
    checkPermissions,
    requestPermissions,
  };
};