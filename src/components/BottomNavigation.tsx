import React from 'react';
import { Home, ScanLine, TrendingUp, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'scan', label: 'Scan', icon: ScanLine },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'planner', label: 'Planner', icon: ShoppingCart },
  { id: 'profile', label: 'Profile', icon: User },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-nav-background border-t border-nav-border backdrop-blur-sm bg-opacity-95 z-50">
      <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isScan = item.id === 'scan';
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300 relative",
                isScan && "transform -translate-y-2"
              )}
            >
              {/* Scan button special styling */}
              {isScan ? (
                <div className={cn(
                  "relative p-3 rounded-full transition-all duration-300",
                  isActive 
                    ? "gradient-scan shadow-scan scale-110" 
                    : "bg-primary hover:bg-primary-hover shadow-lg"
                )}>
                  <Icon 
                    size={24} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-white" : "text-white"
                    )} 
                  />
                  {isActive && (
                    <div className="absolute inset-0 rounded-full animate-pulse-slow border-2 border-primary/30" />
                  )}
                </div>
              ) : (
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive && "bg-primary/10"
                )}>
                  <Icon 
                    size={20} 
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "text-nav-active" : "text-nav-inactive"
                    )} 
                  />
                </div>
              )}
              
              {/* Label */}
              <span className={cn(
                "text-xs font-medium mt-1 transition-all duration-300",
                isActive ? "text-nav-active" : "text-nav-inactive",
                isScan && "text-xs"
              )}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && !isScan && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-nav-active rounded-full animate-bounce-gentle" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;