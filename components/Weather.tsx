import React, { useState, useEffect, useCallback } from 'react';
import { getWeatherInfo } from '../services/geminiService';
import { WeatherData } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import { useLanguage } from '../context/LanguageContext';
import BellIcon from './icons/BellIcon';

const FROST_THRESHOLD = 2; // Celsius
const RAIN_KEYWORDS = ['heavy rain', 'thunderstorms', 'storm', 'mvula yamphamvu', 'bingu'];


const Weather: React.FC = () => {
    const [location, setLocation] = useState<string>('Lilongwe, Malawi');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { language, t } = useLanguage();
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            return Notification.permission;
        }
        return 'default';
    });

    const checkForAlerts = useCallback((data: WeatherData) => {
        if (notificationPermission !== 'granted') return;

        data.forecast.forEach(day => {
            // Frost Alert
            if (day.low <= FROST_THRESHOLD) {
                new Notification(t('weatherAlertTitle'), {
                    body: t('frostAlert', { day: day.day, low: day.low.toString() }),
                    icon: '/favicon.svg'
                });
            }

            // Heavy Rain Alert
            const descriptionLower = day.description.toLowerCase();
            if (RAIN_KEYWORDS.some(keyword => descriptionLower.includes(keyword))) {
                 new Notification(t('weatherAlertTitle'), {
                    body: t('rainAlert', { day: day.day, description: day.description }),
                    icon: '/favicon.svg'
                });
            }
        });

    }, [notificationPermission, t]);

    const handleFetchWeather = useCallback(async (loc: string) => {
        if (!loc.trim()) {
            setError(t('pleaseEnterLocation'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setWeatherData(null);
        try {
            const data = await getWeatherInfo(loc, language);
            setWeatherData(data);
            checkForAlerts(data);
        } catch (err) {
            setError(t('failedToFetchWeather'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [language, t, checkForAlerts]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFetchWeather(location);
    };
    
    useEffect(() => {
      // Fetch initial weather on component mount
      handleFetchWeather('Lilongwe, Malawi');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleFetchWeather]);

    const handleRequestPermission = async () => {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
            return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
    };

    const getNotificationButton = () => {
        switch (notificationPermission) {
            case 'granted':
                return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
                        <BellIcon className="w-5 h-5" />
                        <span>{t('weatherAlertsEnabled')}</span>
                    </div>
                );
            case 'denied':
                 return (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
                        <BellIcon className="w-5 h-5" />
                        <span>{t('weatherAlertsDenied')}</span>
                    </div>
                );
            default:
                return (
                    <button
                        onClick={handleRequestPermission}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                        aria-label={t('enableWeatherAlerts')}
                    >
                        <BellIcon className="w-5 h-5" />
                        <span>{t('enableWeatherAlerts')}</span>
                    </button>
                );
        }
    };


    return (
        <div className="space-y-6">
            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-brand-green-800 mb-2">{t('weatherForecast')}</h2>
                    <p className="text-gray-600 mb-4">{t('weatherDescription')}</p>

                     <div className="my-4 p-4 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                         <div className="text-center sm:text-left">
                            <h3 className="font-semibold text-gray-800">{t('criticalAlerts')}</h3>
                            <p className="text-sm text-gray-600">{t('alertDescription')}</p>
                         </div>
                         {getNotificationButton()}
                    </div>

                    <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder={t('enterLocation')}
                            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-opacity-75 disabled:bg-gray-400"
                        >
                            {isLoading ? <Spinner /> : t('getWeather')}
                        </button>
                    </form>
                </div>
            </Card>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {weatherData && (
                <Card>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800">{t('currentConditionsIn')} <span className="text-brand-green-700">{location}</span></h3>
                            <div className="mt-2 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-5xl font-bold text-blue-600">{weatherData.current.temp}°C</p>
                                    <p className="text-gray-600">{weatherData.current.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg text-gray-700">{t('humidity')}</p>
                                    <p className="text-2xl font-semibold text-blue-800">{weatherData.current.humidity}%</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{t('fiveDayForecast')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {weatherData.forecast.map((day, index) => (
                                    <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                                        <p className="font-bold text-gray-800">{day.day}</p>
                                        <p className="text-sm text-gray-500 my-2">{day.description}</p>
                                        <div className="flex justify-center gap-4 text-sm">
                                            <p className="text-red-600 font-semibold">{day.high}°</p>
                                            <p className="text-blue-600 font-semibold">{day.low}°</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Weather;
