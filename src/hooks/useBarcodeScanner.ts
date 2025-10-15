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

// Web-based barcode scanning using getUserMedia
const useWebCamera = () => {
  const startWebScan = async (): Promise<ScannedBarcode | null> => {
    try {
      console.log('🌐 Starting web camera scan...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      
      console.log('✅ Camera stream obtained');
      toast.info('Opening camera...');
      
      // For now, we'll stop the stream and show manual entry
      // In a full implementation, you'd use a library like QuaggaJS or ZXing
      stream.getTracks().forEach(track => track.stop());
      
      // Return null to trigger manual entry
      return null;
      
    } catch (error: any) {
      console.error('❌ Web camera error:', error);
      
      if (error.name === 'NotAllowedError') {
        toast.error('Camera permission denied. Please enable camera access.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device.');
      } else {
        toast.error('Camera not available. Please use manual barcode entry.');
      }
      
      return null;
    }
  };

  return { startWebScan };
};

export const useBarcodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<ScannedBarcode | null>(null);
  const { startWebScan } = useWebCamera();

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
    console.log('🔍 Starting barcode scan...');
    
    // Check if we're on a mobile device (native or web)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || Capacitor.isNativePlatform();
    const isNative = Capacitor.isNativePlatform();
    
    console.log('📱 Device check:', { isMobile, isNative, userAgent: navigator.userAgent });
    
    if (!isMobile) {
      const errorMsg = 'Barcode scanning is only available on mobile devices';
      console.error('❌', errorMsg);
      toast.error(errorMsg);
      return null;
    }

    // For web browsers on mobile, use web camera API
    if (!isNative) {
      console.log('🌐 Running in mobile web browser - using web camera API');
      setIsScanning(true);
      const result = await startWebScan();
      setIsScanning(false);
      return result;
    }

    try {
      setIsScanning(true);
      console.log('🎥 Checking camera permissions...');

      // Check and request permissions with detailed logging
      let permissionStatus = await checkPermissions();
      console.log('📋 Initial permission status:', permissionStatus);
      
      if (permissionStatus !== 'granted') {
        console.log('🔐 Requesting camera permissions...');
        toast.info('Camera access required. Please grant permission.');
        
        permissionStatus = await requestPermissions();
        console.log('📋 Permission after request:', permissionStatus);
        
        if (permissionStatus !== 'granted') {
          const errorMsg = 'Camera permission is required to scan barcodes. Please enable it in your device settings.';
          console.error('❌', errorMsg);
          toast.error(errorMsg);
          return null;
        }
      }

      console.log('✅ Camera permissions granted');
      console.log('🔍 Checking Google Barcode Scanner module...');

      // Check if scanner is available with better error handling
      try {
        const { available } = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
        console.log('📦 Barcode scanner module available:', available);
        
        if (!available) {
          console.log('📥 Installing Google Barcode Scanner module...');
          toast.info('Installing barcode scanner module...');
          await BarcodeScanner.installGoogleBarcodeScannerModule();
          console.log('✅ Barcode scanner module installed');
        }
      } catch (moduleError) {
        console.error('❌ Error with barcode scanner module:', moduleError);
        toast.error('Failed to initialize barcode scanner. Please try again.');
        return null;
      }

      console.log('🚀 Starting camera scan...');
      toast.info('Camera opening... Point at a barcode');

      // Start scanning with timeout
      const scanPromise = BarcodeScanner.scan({
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

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Scan timeout')), 30000)
      );

      const result = await Promise.race([scanPromise, timeoutPromise]) as any;
      console.log('📸 Scan result:', result);

      if (result?.barcodes && result.barcodes.length > 0) {
        const barcode = result.barcodes[0];
        console.log('✅ Barcode detected:', barcode);
        
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
        console.log('ℹ️ No barcode detected in scan result');
        toast.info('No barcode detected. Please try again.');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Barcode scanning error:', error);
      
      // Provide specific error messages
      let errorMessage = 'Failed to scan barcode';
      
      if (error.message?.includes('timeout')) {
        errorMessage = 'Scan timed out. Please try again.';
      } else if (error.message?.includes('permission') || error.message?.includes('denied')) {
        errorMessage = 'Camera permission denied. Please enable camera access in settings.';
      } else if (error.message?.includes('camera')) {
        errorMessage = 'Camera not available. Please check if another app is using it.';
      } else if (error.message?.includes('cancelled') || error.message?.includes('cancel')) {
        errorMessage = 'Scan cancelled';
      }
      
      console.error('📱 Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      toast.error(errorMessage);
      return null;
    } finally {
      setIsScanning(false);
      console.log('🏁 Scan process completed');
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