import React from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, AlertTriangle } from 'lucide-react';

interface GeolockNoticeProps {
  isOutsideNorway?: boolean;
  onDismiss?: () => void;
}

const GeolockNotice: React.FC<GeolockNoticeProps> = ({ isOutsideNorway, onDismiss }) => {
  if (!isOutsideNorway) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <strong>Denne appen er kun tilgjengelig i Norge</strong>
          <p className="text-sm mt-1">
            Prisly er designet for det norske markedet og fungerer best i Norge.
          </p>
        </div>
        <MapPin className="h-6 w-6 text-destructive ml-4" />
      </AlertDescription>
    </Alert>
  );
};

export default GeolockNotice;