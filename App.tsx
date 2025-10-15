
import React, { useState } from 'react';
import Header from './components/Header';
import DiseaseDetection from './components/DiseaseDetection';
import Agribot from './components/Agribot';
import Weather from './components/Weather';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Detect);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Detect:
        return <DiseaseDetection />;
      case Tab.Agribot:
        return <Agribot />;
      case Tab.Weather:
        return <Weather />;
      default:
        return <DiseaseDetection />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        {renderContent()}
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
          <p>CROPIA &copy; {new Date().getFullYear()}. AI for modern agriculture.</p>
       </footer>
    </div>
  );
};

export default App;
