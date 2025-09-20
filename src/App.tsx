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
import Auth from './pages/Auth';
import { LanguageContext, useLanguageProvider } from './hooks/useLanguage';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const languageProvider = useLanguageProvider();
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show auth page if user is not authenticated
  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageContext.Provider value={languageProvider}>
          <TooltipProvider>
            <Auth />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </LanguageContext.Provider>
      </QueryClientProvider>
    );
  }

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
