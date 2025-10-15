
import React, { useState, useEffect } from 'react';
import { getWeatherInfo } from '../services/geminiService';
import { WeatherData, ForecastDay } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

const Weather: React.FC = () => {
    const [location, setLocation] = useState<string>('Lilongwe, Malawi');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFetchWeather = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!location.trim()) {
            setError('Please enter a location.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setWeatherData(null);
        try {
            const data = await getWeatherInfo(location);
            setWeatherData(data);
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch initial weather on component mount
    // FIX: Replaced `useState` with `useEffect` to correctly handle side effects on component mount. The `useState` hook was used incorrectly, causing an error.
    useEffect(() => {
      handleFetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-brand-green-800 mb-2">Agricultural Weather Forecast</h2>
                    <p className="text-gray-600 mb-4">Get localized weather updates to plan your farming activities and prevent disease outbreaks.</p>
                    <form onSubmit={handleFetchWeather} className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter your city or region"
                            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto px-6 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-opacity-75 disabled:bg-gray-400"
                        >
                            {isLoading ? <Spinner /> : 'Get Weather'}
                        </button>
                    </form>
                </div>
            </Card>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {weatherData && (
                <Card>
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Current Conditions in <span className="text-brand-green-700">{location}</span></h3>
                            <div className="mt-2 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                                <div>
                                    <p className="text-5xl font-bold text-blue-600">{weatherData.current.temp}°C</p>
                                    <p className="text-gray-600">{weatherData.current.description}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg text-gray-700">Humidity</p>
                                    <p className="text-2xl font-semibold text-blue-800">{weatherData.current.humidity}%</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">5-Day Forecast</h3>
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