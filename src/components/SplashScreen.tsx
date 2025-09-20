import React, { useEffect } from 'react';
import PrislyLogo from './PrislyLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center animate-fade-in">
      <div className="animate-scale-in">
        <PrislyLogo size="quarter-screen" />
      </div>
    </div>
  );
};

export default SplashScreen;