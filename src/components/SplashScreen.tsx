import React, { useEffect, useState } from 'react';
import PrislyLogo from './PrislyLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'shrinking' | 'complete'>('initial');

  useEffect(() => {
    // Phase 1: Show full-screen logo for 1.5 seconds
    const initialTimer = setTimeout(() => {
      setAnimationPhase('shrinking');
    }, 1500);

    // Phase 2: Start shrinking animation after 2 seconds total
    const shrinkTimer = setTimeout(() => {
      setAnimationPhase('complete');
    }, 2000);

    // Phase 3: Complete transition after 3 seconds total
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(shrinkTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ease-in-out ${
        animationPhase === 'initial' 
          ? 'bg-background' 
          : animationPhase === 'shrinking'
          ? 'bg-background/95 backdrop-blur-sm'
          : 'bg-transparent pointer-events-none'
      }`}
    >
      <div 
        className={`transition-all duration-1000 ease-in-out ${
          animationPhase === 'initial' 
            ? 'scale-100 opacity-100' 
            : animationPhase === 'shrinking'
            ? 'scale-75 opacity-90'
            : 'scale-50 opacity-0'
        }`}
      >
        <PrislyLogo 
          size="fullscreen" 
          className={`transition-all duration-1000 ease-in-out ${
            animationPhase === 'initial' 
              ? 'drop-shadow-2xl' 
              : 'drop-shadow-lg'
          }`} 
        />
      </div>
      
      {/* Animated background elements */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        animationPhase === 'complete' ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full animate-pulse" 
             style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/5 rounded-full animate-pulse" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-success/5 rounded-full animate-pulse" 
             style={{ animationDelay: '1.5s' }} />
      </div>
      
      {/* Loading text */}
      {animationPhase === 'initial' && (
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 animate-fade-in">
          <p className="text-muted-foreground text-lg font-medium animate-pulse">
            Loading your shopping experience...
          </p>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;