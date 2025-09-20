import React, { createContext, useState } from 'react';
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
import { LanguageContext, useLanguageProvider } from './hooks/useLanguage';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const languageProvider = useLanguageProvider();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigateToDeals={() => setActiveTab('deals')} />;
      case 'scan':
        return <Scan />;
      case 'trends':
        return <Trends />;
      case 'planner':
        return <Planner />;
      case 'profile':
        return <Profile />;
      case 'deals':
        return <Deals />;
      default:
        return <Home onNavigateToDeals={() => setActiveTab('deals')} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageContext.Provider value={languageProvider}>
        <TooltipProvider>
          <div className="min-h-screen bg-background animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
