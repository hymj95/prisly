import { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'no' | 'da' | 'sv' | 'de';

interface Translations {
  [key: string]: {
    [K in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': {
    en: 'Home',
    no: 'Hjem',
    da: 'Hjem',
    sv: 'Hem',
    de: 'Startseite'
  },
  'nav.scan': {
    en: 'Scan',
    no: 'Skann',
    da: 'Scan',
    sv: 'Skanna',
    de: 'Scannen'
  },
  'nav.trends': {
    en: 'Trends',
    no: 'Trender',
    da: 'Tendenser',
    sv: 'Trender',
    de: 'Trends'
  },
  'nav.planner': {
    en: 'Planner',
    no: 'Planlegger',
    da: 'Planner',
    sv: 'Planerare',
    de: 'Planer'
  },
  'nav.profile': {
    en: 'Profile',
    no: 'Profil',
    da: 'Profil',
    sv: 'Profil',
    de: 'Profil'
  },
  // Home page
  'home.welcome': {
    en: 'Welcome to Prisly',
    no: 'Velkommen til Prisly',
    da: 'Velkommen til Prisly',
    sv: 'Välkommen till Prisly',
    de: 'Willkommen bei Prisly'
  },
  'home.tagline': {
    en: 'Your smart grocery shopping companion',
    no: 'Din smarte handleliste-følgesvenn',
    da: 'Din smarte indkøbsassistent',
    sv: 'Din smarta shoppingassistent',
    de: 'Ihr intelligenter Einkaufsbegleiter'
  },
  'home.productsScanned': {
    en: 'Products Scanned',
    no: 'Produkter Skannet',
    da: 'Produkter Scannet',
    sv: 'Produkter Skannade',
    de: 'Produkte Gescannt'
  },
  'home.moneySaved': {
    en: 'Money Saved',
    no: 'Penger Spart',
    da: 'Penge Sparet',
    sv: 'Pengar Sparade',
    de: 'Geld Gespart'
  },
  'home.priceAlerts': {
    en: 'Price Alerts',
    no: 'Prisvarsler',
    da: 'Prisalarmer',
    sv: 'Prisvarningar',
    de: 'Preisalarme'
  },
  'home.quickScan': {
    en: 'Quick Scan',
    no: 'Hurtigskanning',
    da: 'Hurtig Scan',
    sv: 'Snabbskanning',
    de: 'Schnell Scannen'
  },
  'home.quickScanDesc': {
    en: 'Get instant price comparison',
    no: 'Få øyeblikkelig prissammenligning',
    da: 'Få øjeblikkelig prissammenligning',
    sv: 'Få omedelbar prisjämförelse',
    de: 'Sofortiger Preisvergleich'
  },
  'home.scan': {
    en: 'Scan',
    no: 'Skann',
    da: 'Scan',
    sv: 'Skanna',
    de: 'Scannen'
  },
  'home.hotDeals': {
    en: '🔥 Hot Deals',
    no: '🔥 Populære Tilbud',
    da: '🔥 Populære Tilbud',
    sv: '🔥 Populära Erbjudanden',
    de: '🔥 Top-Angebote'
  },
  'home.flashDeals': {
    en: '⚡ Flash Deals',
    no: '⚡ Lynkjøp',
    da: '⚡ Lynhandel',
    sv: '⚡ Blixtförsäljning',
    de: '⚡ Blitz-Angebote'
  },
  'home.localDeals': {
    en: '📍 Local Deals',
    no: '📍 Lokale Tilbud',
    da: '📍 Lokale Tilbud',
    sv: '📍 Lokala Erbjudanden',
    de: '📍 Lokale Angebote'
  },
  'home.viewAll': {
    en: 'View All',
    no: 'Se Alle',
    da: 'Se Alle',
    sv: 'Visa Alla',
    de: 'Alle Anzeigen'
  },
  'home.recentScans': {
    en: 'Recent Scans',
    no: 'Nylige Skanninger',
    da: 'Nylige Scanninger',
    sv: 'Senaste Skanningar',
    de: 'Letzte Scans'
  },
  // Profile page
  'profile.currency': {
    en: 'Currency',
    no: 'Valuta',
    da: 'Valuta',
    sv: 'Valuta',
    de: 'Währung'
  },
  'profile.language': {
    en: 'Language',
    no: 'Språk',
    da: 'Sprog',
    sv: 'Språk',
    de: 'Sprache'
  },
  'profile.location': {
    en: 'Shopping Area',
    no: 'Handleområde',
    da: 'Indkøbsområde',
    sv: 'Shoppingområde',
    de: 'Einkaufsbereich'
  },
  'profile.setLocation': {
    en: 'Set Area',
    no: 'Sett Område',
    da: 'Indstil Område',
    sv: 'Ställ in Område',
    de: 'Bereich Festlegen'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const useLanguageProvider = () => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('prisly-language') as Language;
    if (savedLanguage && ['en', 'no', 'da', 'sv', 'de'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('prisly-language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return { language, setLanguage, t };
};