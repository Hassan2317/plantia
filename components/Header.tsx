import React, { useState } from 'react';
import { Tab, Language } from '../types';
import LeafIcon from './icons/LeafIcon';
import ChatIcon from './icons/ChatIcon';
import WeatherIcon from './icons/WeatherIcon';
import GlobeIcon from './icons/GlobeIcon';
import BookIcon from './icons/BookIcon';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navItems = [
    { id: Tab.Detect, labelKey: 'detectDisease', icon: <LeafIcon className="w-5 h-5" /> },
    { id: Tab.Agribot, labelKey: 'agribot', icon: <ChatIcon className="w-5 h-5" /> },
    { id: Tab.Weather, labelKey: 'weather', icon: <WeatherIcon className="w-5 h-5" /> },
    { id: Tab.KnowledgeBase, labelKey: 'knowledgeBase', icon: <BookIcon className="w-5 h-5" /> },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
  }

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <LeafIcon className="w-8 h-8 text-brand-green-600" />
            <h1 className="ml-2 text-2xl font-bold text-brand-green-800">CROPIA</h1>
          </div>
          <div className="flex items-center space-x-2">
            <nav className="hidden sm:flex items-center space-x-1 bg-gray-100 p-1 rounded-full">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-brand-green-600 text-white shadow'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  <span>{t(item.labelKey)}</span>
                </button>
              ))}
            </nav>
            <div className="relative">
                <button 
                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                    onBlur={() => setTimeout(() => setIsLangMenuOpen(false), 150)}
                    className="flex items-center p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none"
                    aria-label="Change language"
                >
                    <GlobeIcon className="w-6 h-6"/>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                        <button 
                            onClick={() => handleLanguageChange(Language.EN)}
                            className={`block w-full text-left px-4 py-2 text-sm ${language === Language.EN ? 'bg-brand-green-100 text-brand-green-800' : 'text-gray-700'} hover:bg-gray-100`}
                        >
                            English
                        </button>
                        <button 
                            onClick={() => handleLanguageChange(Language.NY)}
                            className={`block w-full text-left px-4 py-2 text-sm ${language === Language.NY ? 'bg-brand-green-100 text-brand-green-800' : 'text-gray-700'} hover:bg-gray-100`}
                        >
                            Chichewa
                        </button>
                    </div>
                )}
            </div>
          </div>
        </div>
        <nav className="sm:hidden flex justify-around p-2 bg-gray-100 rounded-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 text-xs font-medium rounded-lg transition-colors duration-200 w-full ${
                  activeTab === item.id
                    ? 'bg-brand-green-600 text-white'
                    : 'text-gray-600'
                }`}
              >
                {item.icon}
                <span>{t(item.labelKey)}</span>
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
