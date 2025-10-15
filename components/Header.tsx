
import React from 'react';
import { Tab } from '../types';
import LeafIcon from './icons/LeafIcon';
import ChatIcon from './icons/ChatIcon';
import WeatherIcon from './icons/WeatherIcon';

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: Tab.Detect, label: 'Detect Disease', icon: <LeafIcon className="w-5 h-5" /> },
    { id: Tab.Agribot, label: 'Agribot', icon: <ChatIcon className="w-5 h-5" /> },
    { id: Tab.Weather, label: 'Weather', icon: <WeatherIcon className="w-5 h-5" /> },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <LeafIcon className="w-8 h-8 text-brand-green-600" />
            <h1 className="ml-2 text-2xl font-bold text-brand-green-800">CROPIA</h1>
          </div>
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
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
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
                <span>{item.label}</span>
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
