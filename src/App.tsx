import React, { createContext, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BottomNavigation from './components/BottomNavigation';
import Home from './components/tabs/Home';
import Scan from './components/tabs/Scan';
import Trends from './components/tabs/Trends';
import Planner from './components/tabs/Planner';
import Profile from './components/tabs/Profile';
import Deals from './components/tabs/Deals';
import CategoryDeals from './components/CategoryDeals';
import GeolockNotice from './components/GeolockNotice';
import { LanguageContext, useLanguageProvider } from './hooks/useLanguage';
import { useLocationStores } from './hooks/useLocationStores';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showGeolockNotice, setShowGeolockNotice] = useState(false);
  const languageProvider = useLanguageProvider();
  const { detectionError } = useLocationStores();

  // Show geolock notice if user is detected outside Norway
  useEffect(() => {
    if (detectionError?.includes('only available in Norway')) {
      setShowGeolockNotice(true);
    }
  }, [detectionError]);

  const renderActiveTab = () => {
    // Show category deals if a category is selected
    if (selectedCategory) {
      return <CategoryDeals category={selectedCategory} onBack={() => setSelectedCategory(null)} />;
    }

    switch (activeTab) {
      case 'home':
        return <Home 
          onNavigateToDeals={() => setActiveTab('deals')} 
          onCategorySelect={setSelectedCategory}
          onNavigateToScan={() => setActiveTab('scan')}
        />;
      case 'scan':
        return <Scan />;
      case 'trends':
        return <Trends />;
      case 'planner':
        return <Planner />;
      case 'profile':
        return <Profile />;
      case 'deals':
        return <Deals onCategorySelect={setSelectedCategory} />;
      default:
        return <Home 
          onNavigateToDeals={() => setActiveTab('deals')} 
          onCategorySelect={setSelectedCategory}
          onNavigateToScan={() => setActiveTab('scan')}
        />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageContext.Provider value={languageProvider}>
        <TooltipProvider>
          <div className="min-h-screen bg-background animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Norwegian Geolock Notice */}
            {showGeolockNotice && (
              <div className="p-4">
                <GeolockNotice 
                  isOutsideNorway={true} 
                  onDismiss={() => setShowGeolockNotice(false)} 
                />
              </div>
            )}
            
            <main className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {renderActiveTab()}
            </main>
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LanguageContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
