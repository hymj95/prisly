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
import { LanguageContext, useLanguageProvider } from './hooks/useLanguage';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const languageProvider = useLanguageProvider();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'scan':
        return <Scan />;
      case 'trends':
        return <Trends />;
      case 'planner':
        return <Planner />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageContext.Provider value={languageProvider}>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <main className="animate-fade-in">
              {renderActiveTab()}
            </main>
            <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </LanguageContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
