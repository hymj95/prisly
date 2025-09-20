import React from 'react';
import prislyLogo from '@/assets/prisly-logo-new.png';

interface PrislyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'quarter-screen';
  className?: string;
}

const PrislyLogo: React.FC<PrislyLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
    '2xl': 'h-32',
    '3xl': 'h-48',
    '4xl': 'h-64',
    '5xl': 'h-80',
    '6xl': 'h-96',
    'quarter-screen': 'h-[25vh]'
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