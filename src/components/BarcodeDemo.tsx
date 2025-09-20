import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Capacitor } from '@capacitor/core';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { 
  Camera, 
  Smartphone, 
  Wifi, 
  Download, 
  GitBranch, 
  Terminal, 
  Play,
  Info,
  CheckCircle2
} from 'lucide-react';

const BarcodeDemo: React.FC = () => {
  const { startScan, isScanning, lastScannedCode } = useBarcodeScanner();

  const handleTestScan = async () => {
    await startScan();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Camera className="text-primary" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-primary">Barcode Scanner Demo</h1>
        <p className="text-muted-foreground">Test native camera barcode scanning</p>
      </div>

      {/* Platform Check */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Smartphone className="text-primary" size={20} />
          <h3 className="font-semibold">Platform Status</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Native Platform:</span>
            <Badge variant={Capacitor.isNativePlatform() ? 'default' : 'secondary'}>
              {Capacitor.isNativePlatform() ? 'Native' : 'Web'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Platform:</span>
            <Badge variant="outline">{Capacitor.getPlatform()}</Badge>
          </div>
        </div>
        
        {!Capacitor.isNativePlatform() && (
          <Alert className="mt-3">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Barcode scanning requires a native mobile app. Follow the setup instructions below to test on a device.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Test Scanner */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold">Test Barcode Scanner</h3>
          
          <Button 
            onClick={handleTestScan} 
            disabled={isScanning || !Capacitor.isNativePlatform()}
            className="w-full"
          >
            {isScanning ? (
              <>
                <Camera className="mr-2 animate-pulse" size={16} />
                Scanning...
              </>
            ) : (
              <>
                <Camera className="mr-2" size={16} />
                Start Camera Scan
              </>
            )}
          </Button>
          
          {lastScannedCode && (
            <Card className="p-3 bg-success/5 border-success/20">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="text-success mt-0.5" size={16} />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-success">Last Scanned:</p>
                  <p className="text-sm font-mono">{lastScannedCode.displayValue}</p>
                  <p className="text-xs text-muted-foreground">Format: {lastScannedCode.format}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-primary" size={20} />
            <h3 className="font-semibold">Setup Instructions for Mobile Testing</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge className="bg-primary text-white mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Export to GitHub</p>
                <p className="text-muted-foreground">Click "Export to GitHub" button to transfer your project</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge className="bg-primary text-white mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Clone and Install</p>
                <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                  git clone [your-repo-url]<br/>
                  cd [project-name]<br/>
                  npm install
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge className="bg-primary text-white mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Add Native Platforms</p>
                <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                  npx cap add ios     # For iOS<br/>
                  npx cap add android # For Android
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge className="bg-primary text-white mt-0.5">4</Badge>
              <div>
                <p className="font-medium">Build and Sync</p>
                <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                  npm run build<br/>
                  npx cap sync
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Badge className="bg-primary text-white mt-0.5">5</Badge>
              <div>
                <p className="font-medium">Run on Device</p>
                <div className="mt-1 p-2 bg-muted rounded text-xs font-mono">
                  npx cap run ios     # Requires Mac + Xcode<br/>
                  npx cap run android # Requires Android Studio
                </div>
              </div>
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              After any code changes, run <code className="bg-muted px-1 rounded">npx cap sync</code> to update the native apps.
            </AlertDescription>
          </Alert>
        </div>
      </Card>

      {/* Features */}
      <Card className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold">Supported Barcode Formats</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>QR Code</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>EAN-13</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>EAN-8</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>UPC-A</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>UPC-E</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>Code 128</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>Code 39</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={14} />
              <span>Data Matrix</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BarcodeDemo;