import React from 'react';
import prislyLogo from '@/assets/prisly-logo-green.png';

interface PrislyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const PrislyLogo: React.FC<PrislyLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
    '2xl': 'h-32'
  };

  return (
    <img 
      src={prislyLogo} 
      alt="Prisly - Smart Grocery Price Tracking" 
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
};

export default PrislyLogo;