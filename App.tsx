
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DiseaseDetection from './components/DiseaseDetection';
import Agribot from './components/Agribot';
import Weather from './components/Weather';
import KnowledgeBase from './components/KnowledgeBase';
import Onboarding from './components/Onboarding';
import { Tab } from './types';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const ONBOARDING_KEY = 'cropia_onboarding_complete';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Detect);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    try {
        const onboardingComplete = localStorage.getItem(ONBOARDING_KEY);
        if (!onboardingComplete) {
            setShowOnboarding(true);
        }
    } catch (e) {
        console.error("Could not access localStorage:", e);
    }
  }, []);

  const handleOnboardingComplete = () => {
      try {
          localStorage.setItem(ONBOARDING_KEY, 'true');
      } catch (e) {
          console.error("Could not write to localStorage:", e);
      }
      setShowOnboarding(false);
  };


  const renderContent = () => {
    switch (activeTab) {
      case Tab.Detect:
        return <DiseaseDetection />;
      case Tab.Agribot:
        return <Agribot />;
      case Tab.Weather:
        return <Weather />;
      case Tab.KnowledgeBase:
        return <KnowledgeBase />;
      default:
        return <DiseaseDetection />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
          <p>{t('footerText', { year: new Date().getFullYear().toString() })}</p>
       </footer>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
