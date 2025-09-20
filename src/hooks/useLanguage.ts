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
  'home.storeLocation': {
    en: 'Current Store Location',
    no: 'Nåværende Butikkplassering',
    da: 'Nuværende Butiksplacering',
    sv: 'Nuvarande Butiksplats',
    de: 'Aktueller Ladenstandort'
  },
  'home.storeLocationDesc': {
    en: 'Select your shopping location for personalized deals',
    no: 'Velg handlestedet ditt for personlige tilbud',
    da: 'Vælg din indkøbsplacering for personlige tilbud',
    sv: 'Välj din shoppingplats för personliga erbjudanden',
    de: 'Wählen Sie Ihren Einkaufsort für personalisierte Angebote'
  },
  'home.setStore': {
    en: 'Set Store',
    no: 'Sett Butikk',
    da: 'Sæt Butik',
    sv: 'Ställ in Butik',
    de: 'Laden Festlegen'
  },
  'home.avg': {
    en: 'Avg',
    no: 'Snitt',
    da: 'Gnsn',
    sv: 'Snitt',
    de: 'Durchschn'
  },
  // Profile page
  'profile.powerSaver': {
    en: 'Power Saver',
    no: 'Kraftspar',
    da: 'Kraftspar',
    sv: 'Kraftspar',
    de: 'Kraftsparer'
  },
  'profile.rank': {
    en: 'Rank',
    no: 'Rang',
    da: 'Rang',
    sv: 'Rang',
    de: 'Rang'
  },
  'profile.accuracy': {
    en: 'accuracy',
    no: 'nøyaktighet',
    da: 'nøjagtighed',
    sv: 'noggrannhet',
    de: 'Genauigkeit'
  },
  'profile.totalScans': {
    en: 'Products Scanned',
    no: 'Produkter Skannet',
    da: 'Produkter Scannet',
    sv: 'Produkter Skannade',
    de: 'Produkte Gescannt'
  },
  'profile.totalSavings': {
    en: 'Total Savings',
    no: 'Totale Besparelser',
    da: 'Samlede Besparelser',
    sv: 'Totala Besparingar',
    de: 'Gesamtersparnis'
  },
  'profile.priceReports': {
    en: 'Price Reports',
    no: 'Prisrapporter',
    da: 'Prisrapporter',
    sv: 'Prisrapporter',
    de: 'Preisberichte'
  },
  'profile.achievements': {
    en: 'Achievements',
    no: 'Prestasjoner',
    da: 'Præstationer',
    sv: 'Prestationer',
    de: 'Erfolge'
  },
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
  },
  'profile.quickActions': {
    en: 'Quick Actions',
    no: 'Hurtighandlinger',
    da: 'Hurtige Handlinger',
    sv: 'Snabbåtgärder',
    de: 'Schnellaktionen'
  },
  'profile.scanHistory': {
    en: 'Scan History',
    no: 'Skanningshistorikk',
    da: 'Scanningshistorik',
    sv: 'Skanningshistorik',
    de: 'Scan-Verlauf'
  },
  'profile.priceAlertsMenu': {
    en: 'Price Alerts',
    no: 'Prisvarsler',
    da: 'Prisalarmer',
    sv: 'Prisvarningar',
    de: 'Preisalarme'
  },
  'profile.settings': {
    en: 'Settings',
    no: 'Innstillinger',
    da: 'Indstillinger',
    sv: 'Inställningar',
    de: 'Einstellungen'
  },
  'profile.recentActivity': {
    en: 'Recent Activity',
    no: 'Nylig Aktivitet',
    da: 'Nylig Aktivitet',
    sv: 'Senaste Aktivitet',
    de: 'Neueste Aktivität'
  },
  'profile.latestAchievement': {
    en: 'Latest Achievement',
    no: 'Siste Prestasjon',
    da: 'Seneste Præstation',
    sv: 'Senaste Prestation',
    de: 'Neuester Erfolg'
  },
  'profile.savingsMaster': {
    en: 'Savings Master',
    no: 'Sparemester',
    da: 'Sparemester',
    sv: 'Sparmästare',
    de: 'Spar-Meister'
  },
  'profile.savingsMasterDesc': {
    en: "You've saved over $1000! Keep finding those deals!",
    no: 'Du har spart over $1000! Fortsett å finne gode tilbud!',
    da: 'Du har sparet over $1000! Fortsæt med at finde gode tilbud!',
    sv: 'Du har sparat över $1000! Fortsätt hitta bra erbjudanden!',
    de: 'Sie haben über $1000 gespart! Finden Sie weiterhin tolle Angebote!'
  },
  // Activity types
  'activity.scannedProduct': {
    en: 'Scanned product',
    no: 'Skannet produkt',
    da: 'Scannede produkt',
    sv: 'Skannade produkt',
    de: 'Produkt gescannt'
  },
  'activity.addedPriceData': {
    en: 'Added price data',
    no: 'Lagt til prisdata',
    da: 'Tilføjet prisdata',
    sv: 'Lagt till prisdata',
    de: 'Preisdaten hinzugefügt'
  },
  'activity.reachedMilestone': {
    en: 'Reached 100 scans milestone',
    no: 'Nådde 100 skanninger milepæl',
    da: 'Nåede 100 scanninger milepæl',
    sv: 'Nådde 100 skanningar milstolpe',
    de: 'Erreichte 100-Scan-Meilenstein'
  },
  'activity.timeAgo': {
    en: 'ago',
    no: 'siden',
    da: 'siden',
    sv: 'sedan',
    de: 'vor'
  },
  // Achievements
  'achievement.firstScan': {
    en: 'First Scan',
    no: 'Første Skanning',
    da: 'Første Scanning',
    sv: 'Första Skanning',
    de: 'Erster Scan'
  },
  'achievement.firstScanDesc': {
    en: 'Scanned your first product',
    no: 'Skannet ditt første produkt',
    da: 'Scannede dit første produkt',
    sv: 'Skannade din första produkt',
    de: 'Ihr erstes Produkt gescannt'
  },
  'achievement.priceHunter': {
    en: 'Price Hunter',
    no: 'Prisjeger',
    da: 'Prisjæger',
    sv: 'Prisjägare',
    de: 'Preisjäger'
  },
  'achievement.priceHunterDesc': {
    en: 'Found 10 best deals',
    no: 'Fant 10 beste tilbud',
    da: 'Fandt 10 bedste tilbud',
    sv: 'Hittade 10 bästa erbjudanden',
    de: '10 beste Angebote gefunden'
  },
  'achievement.communityHelper': {
    en: 'Community Helper',
    no: 'Samfunnshjelper',
    da: 'Fællesskabshjælper',
    sv: 'Gemenskapshjälpare',
    de: 'Community-Helfer'
  },
  'achievement.communityHelperDesc': {
    en: 'Added 50 price contributions',
    no: 'Lagt til 50 prisbidrag',
    da: 'Tilføjet 50 prisbidrag',
    sv: 'Lagt till 50 prisbidrag',
    de: '50 Preisbeiträge hinzugefügt'
  },
  'achievement.topContributor': {
    en: 'Top Contributor',
    no: 'Toppbidragsyter',
    da: 'Topbidragsyder',
    sv: 'Toppbidragsgivare',
    de: 'Top-Beitragender'
  },
  'achievement.topContributorDesc': {
    en: 'Be in top 10 contributors',
    no: 'Vær blant topp 10 bidragsytere',
    da: 'Vær blandt top 10 bidragsydere',
    sv: 'Var bland topp 10 bidragsgivare',
    de: 'Unter den Top 10 Beitragenden sein'
  },
  'achievement.earned': {
    en: 'Earned',
    no: 'Oppnådd',
    da: 'Opnået',
    sv: 'Uppnådd',
    de: 'Erreicht'
  },
  'achievement.earnedOn': {
    en: 'Earned on',
    no: 'Oppnådd på',
    da: 'Opnået på',
    sv: 'Uppnådd på',
    de: 'Erreicht am'
  },
  // Deals page
  'deals.title': {
    en: 'All Deals',
    no: 'Alle Tilbud',
    da: 'Alle Tilbud',
    sv: 'Alla Erbjudanden',
    de: 'Alle Angebote'
  },
  'deals.description': {
    en: 'Discover the best deals in your area',
    no: 'Oppdag de beste tilbudene i ditt område',
    da: 'Opdag de bedste tilbud i dit område',
    sv: 'Upptäck de bästa erbjudandena i ditt område',
    de: 'Entdecken Sie die besten Angebote in Ihrer Nähe'
  },
  'deals.deals': {
    en: 'deals',
    no: 'tilbud',
    da: 'tilbud',
    sv: 'erbjudanden',
    de: 'angebote'
  },
  'deals.save': {
    en: 'Save',
    no: 'Spar',
    da: 'Spar',
    sv: 'Spara',
    de: 'Sparen'
  },
  // Product Detail
  'product.currentBestPrice': {
    en: 'Current Best Price',
    no: 'Nåværende Beste Pris',
    da: 'Nuværende Bedste Pris',
    sv: 'Nuvarande Bästa Pris',
    de: 'Aktueller Bestpreis'
  },
  'product.lower': {
    en: 'lower',
    no: 'lavere',
    da: 'lavere',
    sv: 'lägre',
    de: 'niedriger'
  },
  'product.dayAverage': {
    en: '30-Day Average',
    no: '30-Dagers Gjennomsnitt',
    da: '30-Dages Gennemsnit',
    sv: '30-Dagars Genomsnitt',
    de: '30-Tage-Durchschnitt'
  },
  'product.youSave': {
    en: 'You Save',
    no: 'Du Sparer',
    da: 'Du Sparer',
    sv: 'Du Sparar',
    de: 'Sie Sparen'
  },
  'product.userRating': {
    en: 'User Rating',
    no: 'Brukervurdering',
    da: 'Brugervurdering',
    sv: 'Användarrating',
    de: 'Nutzerbewertung'
  },
  'product.priceTrend': {
    en: '30-Day Price Trend',
    no: '30-Dagers Pristrend',
    da: '30-Dages Pristendenser',
    sv: '30-Dagars Pristrend',
    de: '30-Tage-Preistrend'
  },
  'product.trendingDown': {
    en: 'Trending Down',
    no: 'Synkende Trend',
    da: 'Faldende Tendens',
    sv: 'Fallande Trend',
    de: 'Fallender Trend'
  },
  'product.storeComparison': {
    en: 'Store Comparison',
    no: 'Butikksammenligning',
    da: 'Butikssammenligning',
    sv: 'Butiksjämförelse',
    de: 'Ladenvergleich'
  },
  'product.mapView': {
    en: 'Map View',
    no: 'Kartvisning',
    da: 'Kortvisning',
    sv: 'Kartvy',
    de: 'Kartenansicht'
  },
  'product.bestPrice': {
    en: 'Best Price',
    no: 'Beste Pris',
    da: 'Bedste Pris',
    sv: 'Bästa Pris',
    de: 'Bester Preis'
  },
  'product.lowestPrice': {
    en: 'Lowest price',
    no: 'Laveste pris',
    da: 'Laveste pris',
    sv: 'Lägsta pris',
    de: 'Niedrigster Preis'
  },
  'product.getDirections': {
    en: 'Get Directions to Best Price',
    no: 'Få Veibeskrivelse til Beste Pris',
    da: 'Få Vejbeskrivelse til Bedste Pris',
    sv: 'Få Vägbeskrivning till Bästa Pris',
    de: 'Route zum Besten Preis'
  },
  'product.priceAlert': {
    en: 'Price Alert',
    no: 'Prisvarsel',
    da: 'Prisalarm',
    sv: 'Prisvarning',
    de: 'Preisalarm'
  },
  'product.addToWishlist': {
    en: 'Add to Wishlist',
    no: 'Legg til Ønskeliste',
    da: 'Tilføj til Ønskeliste',
    sv: 'Lägg till Önskelista',
    de: 'Zur Wunschliste'
  },
  // Store Location
  'store.storeLocation': {
    en: 'Store Location',
    no: 'Butikkplassering',
    da: 'Butiksplacering',
    sv: 'Butiksplats',
    de: 'Ladenstandort'
  },
  'store.autoDetect': {
    en: 'Auto-Detect',
    no: 'Auto-Oppdage',
    da: 'Auto-Registrer',
    sv: 'Auto-Upptäck',
    de: 'Auto-Erkennen'
  },
  'store.detecting': {
    en: 'Detecting...',
    no: 'Oppdager...',
    da: 'Registrerer...',
    sv: 'Upptäcker...',
    de: 'Erkennung...'
  },
  'store.detectingStores': {
    en: 'Detecting nearby stores...',
    no: 'Oppdager butikker i nærheten...',
    da: 'Registrerer butikker i nærheden...',
    sv: 'Upptäcker närliggande butiker...',
    de: 'Erkenne Läden in der Nähe...'
  },
  'store.nearbyStores': {
    en: 'Nearby Stores',
    no: 'Butikker i Nærheten',
    da: 'Butikker i Nærheden',
    sv: 'Närliggande Butiker',
    de: 'Läden in der Nähe'
  },
  'store.availableStores': {
    en: 'Available Stores',
    no: 'Tilgjengelige Butikker',
    da: 'Tilgængelige Butikker',
    sv: 'Tillgängliga Butiker',
    de: 'Verfügbare Läden'
  },
  'store.verified': {
    en: 'Verified',
    no: 'Verifisert',
    da: 'Verificeret',
    sv: 'Verifierad',
    de: 'Verifiziert'
  },
  'store.manual': {
    en: 'Manual',
    no: 'Manuell',
    da: 'Manuel',
    sv: 'Manuell',
    de: 'Manuell'
  },
  'store.kmAway': {
    en: 'km away',
    no: 'km unna',
    da: 'km væk',
    sv: 'km bort',
    de: 'km entfernt'
  },
  'store.addManually': {
    en: 'Add Store Manually',
    no: 'Legg til Butikk Manuelt',
    da: 'Tilføj Butik Manuelt',
    sv: 'Lägg till Butik Manuellt',
    de: 'Laden Manuell Hinzufügen'
  },
  'store.storeName': {
    en: 'Store Name',
    no: 'Butikknavn',
    da: 'Butiksnavn',
    sv: 'Butiksnamn',
    de: 'Ladenname'
  },
  'store.address': {
    en: 'Address',
    no: 'Adresse',
    da: 'Adresse',
    sv: 'Adress',
    de: 'Adresse'
  },
  'store.latitude': {
    en: 'Latitude (Optional)',
    no: 'Breddegrad (Valgfritt)',
    da: 'Breddegrad (Valgfrit)',
    sv: 'Latitud (Valfri)',
    de: 'Breitengrad (Optional)'
  },
  'store.longitude': {
    en: 'Longitude (Optional)',
    no: 'Lengdegrad (Valgfritt)',
    da: 'Længdegrad (Valgfrit)',
    sv: 'Longitud (Valfri)',
    de: 'Längengrad (Optional)'
  },
  'store.addStore': {
    en: 'Add Store',
    no: 'Legg til Butikk',
    da: 'Tilføj Butik',
    sv: 'Lägg till Butik',
    de: 'Laden Hinzufügen'
  },
  'store.noStoresDetected': {
    en: 'No Stores Detected',
    no: 'Ingen Butikker Oppdaget',
    da: 'Ingen Butikker Registreret',
    sv: 'Inga Butiker Upptäckta',
    de: 'Keine Läden Erkannt'
  },
  'store.enableLocation': {
    en: 'Enable location services to detect nearby stores or add them manually.',
    no: 'Aktiver posisjonstjenester for å oppdage butikker i nærheten eller legg dem til manuelt.',
    da: 'Aktiver lokationstjenester for at registrere butikker i nærheden eller tilføj dem manuelt.',
    sv: 'Aktivera platstjänster för att upptäcka närliggande butiker eller lägg till dem manuellt.',
    de: 'Aktivieren Sie Ortungsdienste, um Läden in der Nähe zu finden oder fügen Sie sie manuell hinzu.'
  },
  'store.tryAutoDetection': {
    en: 'Try Auto-Detection',
    no: 'Prøv Auto-Oppdagelse',
    da: 'Prøv Auto-Registrering',
    sv: 'Prova Auto-Upptäckt',
    de: 'Auto-Erkennung Versuchen'
  },
  // Time units
  'time.hoursAgo': {
    en: 'h ago',
    no: 't siden',
    da: 't siden',
    sv: 't sedan',
    de: 'h vor'
  },
  'time.daysAgo': {
    en: 'd ago',
    no: 'd siden',
    da: 'd siden',
    sv: 'd sedan',
    de: 'd vor'
  },
  'time.hoursLeft': {
    en: 'hours left',
    no: 'timer igjen',
    da: 'timer tilbage',
    sv: 'timmar kvar',
    de: 'Stunden übrig'
  },
  'time.daysLeft': {
    en: 'days left',
    no: 'dager igjen',
    da: 'dage tilbage',
    sv: 'dagar kvar',
    de: 'Tage übrig'
  },
  'time.todayOnly': {
    en: 'Today only',
    no: 'Kun i dag',
    da: 'Kun i dag',
    sv: 'Bara idag',
    de: 'Nur heute'
  },
  'time.weekendOnly': {
    en: 'Weekend only',
    no: 'Kun helg',
    da: 'Kun weekend',
    sv: 'Bara helger',
    de: 'Nur Wochenende'
  },
  'time.until9PM': {
    en: 'Until 9 PM',
    no: 'Til kl 21',
    da: 'Indtil kl 21',
    sv: 'Till kl 21',
    de: 'Bis 21 Uhr'
  },
  // Scan Tab translations
  'scan.title': {
    en: 'Scan Product',
    no: 'Skann Produkt',
    da: 'Scan Produkt',
    sv: 'Skanna Produkt',
    de: 'Produkt Scannen'
  },
  'scan.subtitle': {
    en: 'Point your camera at a product barcode',
    no: 'Rett kameraet mot en produktstrekkode',
    da: 'Ret dit kamera mod en produktstregkode',
    sv: 'Rikta kameran mot en produktstreckkod',
    de: 'Richten Sie Ihre Kamera auf einen Produktbarcode'
  },
  'scan.startScanning': {
    en: 'Start Scanning',
    no: 'Start Skanning',
    da: 'Start Scanning',
    sv: 'Starta Skanning',
    de: 'Scannen Starten'
  },
  'scan.scanning': {
    en: 'Scanning...',
    no: 'Skanner...',
    da: 'Scanner...',
    sv: 'Skannar...',
    de: 'Scannt...'
  },
  'scan.productDetected': {
    en: 'Product Detected!',
    no: 'Produkt Oppdaget!',
    da: 'Produkt Registreret!',
    sv: 'Produkt Upptäckt!',
    de: 'Produkt Erkannt!'
  },
  'scan.productInfo': {
    en: 'Product Information',
    no: 'Produktinformasjon',
    da: 'Produktinformation',
    sv: 'Produktinformation',
    de: 'Produktinformationen'
  },
  'scan.productName': {
    en: 'Product Name',
    no: 'Produktnavn',
    da: 'Produktnavn',
    sv: 'Produktnamn',
    de: 'Produktname'
  },
  'scan.brand': {
    en: 'Brand',
    no: 'Merke',
    da: 'Mærke',
    sv: 'Märke',
    de: 'Marke'
  },
  'scan.category': {
    en: 'Category',
    no: 'Kategori',
    da: 'Kategori',
    sv: 'Kategori',
    de: 'Kategorie'
  },
  'scan.barcode': {
    en: 'Barcode',
    no: 'Strekkode',
    da: 'Stregkode',
    sv: 'Streckkod',
    de: 'Barcode'
  },
  'scan.price': {
    en: 'Price',
    no: 'Pris',
    da: 'Pris',
    sv: 'Pris',
    de: 'Preis'
  },
  'scan.currentPrice': {
    en: 'Current Price',
    no: 'Nåværende Pris',
    da: 'Nuværende Pris',
    sv: 'Nuvarande Pris',
    de: 'Aktueller Preis'
  },
  'scan.editInfo': {
    en: 'Edit Information',
    no: 'Rediger Informasjon',
    da: 'Rediger Information',
    sv: 'Redigera Information',
    de: 'Informationen Bearbeiten'
  },
  'scan.confirmSave': {
    en: 'Confirm & Save',
    no: 'Bekreft & Lagre',
    da: 'Bekræft & Gem',
    sv: 'Bekräfta & Spara',
    de: 'Bestätigen & Speichern'
  },
  'scan.scanAnother': {
    en: 'Scan Another',
    no: 'Skann En Til',
    da: 'Scan En Til',
    sv: 'Skanna En Till',
    de: 'Weitere Scannen'
  },
  'scan.retry': {
    en: 'Retry Scan',
    no: 'Prøv Igjen',
    da: 'Prøv Igen',
    sv: 'Försök Igen',
    de: 'Erneut Versuchen'
  },
  'scan.noStoreDetected': {
    en: 'Store not detected',
    no: 'Butikk ikke oppdaget',
    da: 'Butik ikke registreret',
    sv: 'Butik inte upptäckt',
    de: 'Laden nicht erkannt'
  },
  'scan.addStore': {
    en: 'Add Store Information',
    no: 'Legg til Butikkinformasjon',
    da: 'Tilføj Butiksinformation',
    sv: 'Lägg till Butiksinformation',
    de: 'Ladeninformationen Hinzufügen'
  },
  'scan.selectStore': {
    en: 'Select Store',
    no: 'Velg Butikk',
    da: 'Vælg Butik',
    sv: 'Välj Butik',
    de: 'Laden Auswählen'
  },
  'scan.storeNotListed': {
    en: 'Store not listed?',
    no: 'Butikk ikke listet?',
    da: 'Butik ikke på listen?',
    sv: 'Butik inte listad?',
    de: 'Laden nicht aufgelistet?'
  },
  'scan.addManually': {
    en: 'Add manually',
    no: 'Legg til manuelt',
    da: 'Tilføj manuelt',
    sv: 'Lägg till manuellt',
    de: 'Manuell hinzufügen'
  },
  'scan.invalidBarcode': {
    en: 'Invalid barcode. Please try again.',
    no: 'Ugyldig strekkode. Vennligst prøv igjen.',
    da: 'Ugyldig stregkode. Prøv venligst igen.',
    sv: 'Ogiltig streckkod. Försök igen.',
    de: 'Ungültiger Barcode. Bitte versuchen Sie es erneut.'
  },
  'scan.cameraPermission': {
    en: 'Camera permission required to scan products',
    no: 'Kameratillatelse kreves for å skanne produkter',
    da: 'Kameratilladelse kræves for at scanne produkter',
    sv: 'Kameratillstånd krävs för att skanna produkter',
    de: 'Kameraberechtigung erforderlich zum Scannen von Produkten'
  },
  'common.save': {
    en: 'Save',
    no: 'Lagre',
    da: 'Gem',
    sv: 'Spara',
    de: 'Speichern'
  },
  'common.cancel': {
    en: 'Cancel',
    no: 'Avbryt',
    da: 'Annuller',
    sv: 'Avbryt',
    de: 'Abbrechen'
  },
  'common.back': {
    en: 'Back',
    no: 'Tilbake',
    da: 'Tilbage',
    sv: 'Tillbaka',
    de: 'Zurück'
  },
  'common.continue': {
    en: 'Continue',
    no: 'Fortsett',
    da: 'Fortsæt',
    sv: 'Fortsätt',
    de: 'Weiter'
  },
  'common.online': {
    en: 'Online',
    no: 'På nett',
    da: 'Online',
    sv: 'Online',
    de: 'Online'
  },
  'common.change': {
    en: 'Change',
    no: 'Endre',
    da: 'Skift',
    sv: 'Ändra',
    de: 'Ändern'
  },
  // Planner page
  'planner.title': {
    en: 'Shopping Planner',
    no: 'Handleplanlegger',
    da: 'Indkøbsplanner',
    sv: 'Shoppingplanerare',
    de: 'Einkaufsplaner'
  },
  'planner.subtitle': {
    en: 'Plan your grocery trips and save money',
    no: 'Planlegg handleturer og spar penger',
    da: 'Planlæg dine indkøbsture og spar penge',
    sv: 'Planera dina shoppingturer och spara pengar',
    de: 'Planen Sie Ihre Einkäufe und sparen Sie Geld'
  },
  'planner.myLists': {
    en: 'My Lists',
    no: 'Mine Lister',
    da: 'Mine Lister',
    sv: 'Mina Listor',
    de: 'Meine Listen'
  },
  'planner.currentList': {
    en: 'Current List',
    no: 'Nåværende Liste',
    da: 'Nuværende Liste',
    sv: 'Nuvarande Lista',
    de: 'Aktuelle Liste'
  },
  'planner.routePlan': {
    en: 'Route Plan',
    no: 'Ruteplan',
    da: 'Ruteplan',
    sv: 'Ruttplan',
    de: 'Routenplan'
  },
  'planner.createNewList': {
    en: 'Create New Shopping List',
    no: 'Opprett Ny Handleliste',
    da: 'Opret Ny Indkøbsliste',
    sv: 'Skapa Ny Shoppinglista',
    de: 'Neue Einkaufsliste Erstellen'
  },
  'planner.startPlanning': {
    en: 'Start planning your next shopping trip',
    no: 'Begynn å planlegge din neste handletur',
    da: 'Begynd at planlægge din næste indkøbstur',
    sv: 'Börja planera din nästa shoppingtur',
    de: 'Beginnen Sie mit der Planung Ihres nächsten Einkaufs'
  },
  'planner.enterListName': {
    en: 'Enter list name...',
    no: 'Skriv inn listenavn...',
    da: 'Indtast listenavn...',
    sv: 'Ange listnamn...',
    de: 'Listenname eingeben...'
  },
  'planner.create': {
    en: 'Create',
    no: 'Opprett',
    da: 'Opret',
    sv: 'Skapa',
    de: 'Erstellen'
  },
  'planner.yourShoppingLists': {
    en: 'Your Shopping Lists',
    no: 'Dine Handlelister',
    da: 'Dine Indkøbslister',
    sv: 'Dina Shoppinglistor',
    de: 'Ihre Einkaufslisten'
  },
  'planner.items': {
    en: 'items',
    no: 'produkter',
    da: 'varer',
    sv: 'artiklar',
    de: 'Artikel'
  },
  'planner.estimated': {
    en: 'Estimated',
    no: 'Estimert',
    da: 'Estimeret',
    sv: 'Uppskattat',
    de: 'Geschätzt'
  },
  'planner.selectList': {
    en: 'Select a Shopping List',
    no: 'Velg en Handleliste',
    da: 'Vælg en Indkøbsliste',
    sv: 'Välj en Shoppinglista',
    de: 'Einkaufsliste Auswählen'
  },
  'planner.chooseList': {
    en: 'Choose a list from the "My Lists" tab to view and edit items',
    no: 'Velg en liste fra "Mine Lister" fanen for å se og redigere varer',
    da: 'Vælg en liste fra "Mine Lister" fanen for at se og redigere varer',
    sv: 'Välj en lista från "Mina Listor" fliken för att visa och redigera artiklar',
    de: 'Wählen Sie eine Liste aus der Registerkarte "Meine Listen", um Artikel anzuzeigen und zu bearbeiten'
  },
  'planner.viewMyLists': {
    en: 'View My Lists',
    no: 'Se Mine Lister',
    da: 'Se Mine Lister',
    sv: 'Visa Mina Listor',
    de: 'Meine Listen Anzeigen'
  },
  'planner.optimizedRoute': {
    en: 'Optimized Route',
    no: 'Optimalisert Rute',
    da: 'Optimeret Rute',
    sv: 'Optimerad Rutt',
    de: 'Optimierte Route'
  },
  'planner.totalDistance': {
    en: 'Total Distance',
    no: 'Total Avstand',
    da: 'Total Afstand',
    sv: 'Total Avstånd',
    de: 'Gesamtentfernung'
  },
  'planner.estTime': {
    en: 'Est. Time',
    no: 'Beregnet Tid',
    da: 'Beregnet Tid',
    sv: 'Beräknad Tid',
    de: 'Geschätzte Zeit'
  },
  'planner.totalSavings': {
    en: 'Total Savings',
    no: 'Totale Besparelser',
    da: 'Samlede Besparelser',
    sv: 'Totala Besparingar',
    de: 'Gesamtersparnis'
  },
  'planner.yourRoute': {
    en: 'Your Route',
    no: 'Din Rute',
    da: 'Din Rute',
    sv: 'Din Rutt',
    de: 'Ihre Route'
  },
  'planner.openInMaps': {
    en: 'Open in Maps',
    no: 'Åpne i Kart',
    da: 'Åbn i Kort',
    sv: 'Öppna i Kartor',
    de: 'In Karten Öffnen'
  },
  'planner.startTrip': {
    en: 'Start Shopping Trip',
    no: 'Start Handletur',
    da: 'Start Indkøbstur',
    sv: 'Starta Shoppingtur',
    de: 'Einkaufsreise Starten'
  },
  // Trends page
  'trends.title': {
    en: 'Price Trends',
    no: 'Pristrender',
    da: 'Pristendenser',
    sv: 'Pristrender',
    de: 'Preistrends'
  },
  'trends.subtitle': {
    en: 'Track market movements and find fresh opportunities',
    no: 'Spor markedsbevegelser og finn ferske muligheter',
    da: 'Spor markedsbevægelser og find friske muligheder',
    sv: 'Spåra marknadsrörelser och hitta nya möjligheter',
    de: 'Verfolgen Sie Marktbewegungen und finden Sie neue Möglichkeiten'
  },
  'trends.trendingProducts': {
    en: 'Trending Products',
    no: 'Populære Produkter',
    da: 'Populære Produkter',
    sv: 'Populära Produkter',
    de: 'Trending-Produkte'
  },
  'trends.categories': {
    en: 'Categories',
    no: 'Kategorier',
    da: 'Kategorier',
    sv: 'Kategorier',
    de: 'Kategorien'
  },
  'trends.hotProducts': {
    en: 'Hot Products',
    no: 'Populære Produkter',
    da: 'Populære Produkter',
    sv: 'Populära Produkter',
    de: 'Beliebte Produkte'
  },
  'trends.filter': {
    en: 'Filter',
    no: 'Filter',
    da: 'Filter',
    sv: 'Filter',
    de: 'Filter'
  },
  'trends.priceReports': {
    en: 'price reports',
    no: 'prisrapporter',
    da: 'prisrapporter',
    sv: 'prisrapporter',
    de: 'Preisberichte'
  },
  'trends.viewMore': {
    en: 'View More Products',
    no: 'Se Flere Produkter',
    da: 'Se Flere Produkter',
    sv: 'Visa Fler Produkter',
    de: 'Weitere Produkte Anzeigen'
  },
  'trends.categoryOverview': {
    en: 'Category Overview',
    no: 'Kategorioversikt',
    da: 'Kategorioversigt',
    sv: 'Kategoriöversikt',
    de: 'Kategorieübersicht'
  },
  'trends.detailedView': {
    en: 'Detailed View',
    no: 'Detaljert Visning',
    da: 'Detaljeret Visning',
    sv: 'Detaljerad Vy',
    de: 'Detailansicht'
  },
  'trends.productsTracked': {
    en: 'products tracked',
    no: 'produkter sporet',
    da: 'produkter sporet',
    sv: 'produkter spårade',
    de: 'Produkte verfolgt'
  },
  'trends.avgChange': {
    en: 'Avg change',
    no: 'Gjennomsnittlig endring',
    da: 'Gennemsnitlig ændring',
    sv: 'Genomsnittlig förändring',
    de: 'Durchschnittliche Änderung'
  },
  'trends.freshInsights': {
    en: 'Fresh Market Insights',
    no: 'Ferske Markedsinnsikter',
    da: 'Friske Markedsindsigter',
    sv: 'Nya Marknadsinsikter',
    de: 'Aktuelle Markteinblicke'
  },
  // Shopping List Editor
  'editor.saved': {
    en: 'Saved',
    no: 'Lagret',
    da: 'Gemt',
    sv: 'Sparad',
    de: 'Gespeichert'
  },
  'editor.remaining': {
    en: 'remaining',
    no: 'gjenstår',
    da: 'tilbage',
    sv: 'kvar',
    de: 'verbleibend'
  },
  'editor.completed': {
    en: 'completed',
    no: 'fullført',
    da: 'fuldført',
    sv: 'slutförda',
    de: 'abgeschlossen'
  },
  'editor.estimatedTotal': {
    en: 'Estimated total',
    no: 'Estimert totalt',
    da: 'Estimeret total',
    sv: 'Uppskattat totalt',
    de: 'Geschätzte Gesamtsumme'
  },
  'editor.addNewItem': {
    en: 'Add New Item',
    no: 'Legg til Ny Vare',
    da: 'Tilføj Ny Vare',
    sv: 'Lägg till Ny Artikel',
    de: 'Neuen Artikel Hinzufügen'
  },
  'editor.productName': {
    en: 'Product name',
    no: 'Produktnavn',
    da: 'Produktnavn',
    sv: 'Produktnamn',
    de: 'Produktname'
  },
  'editor.qty': {
    en: 'Qty',
    no: 'Ant',
    da: 'Antal',
    sv: 'Antal',
    de: 'Menge'
  },
  'editor.expectedPrice': {
    en: 'Expected price',
    no: 'Forventet pris',
    da: 'Forventet pris',
    sv: 'Förväntat pris',
    de: 'Erwarteter Preis'
  },
  'editor.addItem': {
    en: 'Add Item',
    no: 'Legg til Vare',
    da: 'Tilføj Vare',
    sv: 'Lägg till Artikel',
    de: 'Artikel Hinzufügen'
  },
  'editor.shoppingItems': {
    en: 'Shopping Items',
    no: 'Handlevarer',
    da: 'Indkøbsvarer',
    sv: 'Shoppingartiklar',
    de: 'Einkaufsartikel'
  },
  'editor.noItems': {
    en: 'No items in this list yet',
    no: 'Ingen varer i denne listen ennå',
    da: 'Ingen varer i denne liste endnu',
    sv: 'Inga artiklar i denna lista än',
    de: 'Noch keine Artikel in dieser Liste'
  },
  'editor.addFirstItem': {
    en: 'Add Your First Item',
    no: 'Legg til Din Første Vare',
    da: 'Tilføj Din Første Vare',
    sv: 'Lägg till Din Första Artikel',
    de: 'Ihren Ersten Artikel Hinzufügen'
  },
  'editor.planRoute': {
    en: 'Plan Shopping Route',
    no: 'Planlegg Handlerute',
    da: 'Planlæg Indkøbsrute',
    sv: 'Planera Shoppingrutt',
    de: 'Einkaufsroute Planen'
  },
  'editor.shareList': {
    en: 'Share List',
    no: 'Del Liste',
    da: 'Del Liste',
    sv: 'Dela Lista',
    de: 'Liste Teilen'
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