
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import LeafIcon from './icons/LeafIcon';
import ChatIcon from './icons/ChatIcon';
import WeatherIcon from './icons/WeatherIcon';
import BookIcon from './icons/BookIcon';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const { t } = useLanguage();

    const steps = [
        {
            titleKey: 'onboardingWelcomeTitle',
            contentKey: 'onboardingWelcomeText',
            icon: <LeafIcon className="w-8 h-8" />
        },
        {
            titleKey: 'onboardingDetectTitle',
            contentKey: 'onboardingDetectText',
            icon: <LeafIcon className="w-8 h-8" />
        },
        {
            titleKey: 'onboardingAgribotTitle',
            contentKey: 'onboardingAgribotText',
            icon: <ChatIcon className="w-8 h-8" />
        },
        {
            titleKey: 'onboardingWeatherTitle',
            contentKey: 'onboardingWeatherText',
            icon: <WeatherIcon className="w-8 h-8" />
        },
        {
            titleKey: 'onboardingKnowledgeTitle',
            contentKey: 'onboardingKnowledgeText',
            icon: <BookIcon className="w-8 h-8" />
        }
    ];

    const handleNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const handlePrev = () => setStep(s => Math.max(s - 1, 0));

    const currentStepData = steps[step];

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 scale-95 opacity-0 animate-enter">
                <div className="p-6 text-center relative">
                    <div className="absolute top-4 right-4">
                        <button onClick={onComplete} className="text-sm font-medium text-gray-500 hover:text-gray-800">{t('skip')}</button>
                    </div>

                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-green-100 text-brand-green-600 mb-4">
                        {currentStepData.icon}
                    </div>

                    <h3 className="text-2xl font-bold text-brand-green-800">{t(currentStepData.titleKey)}</h3>
                    <p className="mt-2 text-gray-600 text-base">{t(currentStepData.contentKey)}</p>
                </div>

                <div className="flex justify-center items-center space-x-2 my-6">
                    {steps.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setStep(index)}
                            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === step ? 'bg-brand-green-500 w-4' : 'bg-gray-300 hover:bg-gray-400'}`}
                            aria-label={`Go to step ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        className={`px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 shadow-sm transition-opacity duration-200 ${step === 0 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
                        aria-hidden={step === 0}
                        disabled={step === 0}
                    >
                        {t('previous')}
                    </button>

                    {step < steps.length - 1 ? (
                        <button onClick={handleNext} className="px-6 py-2 text-sm font-semibold text-white bg-brand-green-600 rounded-lg hover:bg-brand-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                            {t('next')}
                        </button>
                    ) : (
                        <button onClick={onComplete} className="px-6 py-2 text-sm font-semibold text-white bg-brand-green-600 rounded-lg hover:bg-brand-green-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-500">
                            {t('getStarted')}
                        </button>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes enter {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-enter {
                    animation: enter 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Onboarding;
