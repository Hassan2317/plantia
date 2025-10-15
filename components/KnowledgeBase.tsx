import React, { useState, useEffect, useMemo } from 'react';
import { DiseaseInfo, RiskLevel } from '../types';
import Card from './common/Card';
import { useLanguage } from '../context/LanguageContext';
import ExportIcon from './icons/ExportIcon';

const KNOWLEDGE_BASE_KEY = 'cropia_knowledge_base';

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
    const riskStyles = {
        [RiskLevel.Low]: 'bg-green-100 text-green-800',
        [RiskLevel.Moderate]: 'bg-yellow-100 text-yellow-800',
        [RiskLevel.High]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${riskStyles[level]}`}>{level}</span>;
};

const KnowledgeBase: React.FC = () => {
    const [diseases, setDiseases] = useState<DiseaseInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedDisease, setExpandedDisease] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        try {
            const storedData = localStorage.getItem(KNOWLEDGE_BASE_KEY);
            if (storedData) {
                const knowledgeBase = JSON.parse(storedData);
                setDiseases(Object.values(knowledgeBase));
            }
        } catch (error) {
            console.error("Failed to load knowledge base:", error);
        }
    }, []);

    const filteredDiseases = useMemo(() => {
        if (!searchTerm) return diseases;
        return diseases.filter(disease =>
            disease.diseaseName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [diseases, searchTerm]);
    
    const handleClearCache = () => {
        if (window.confirm(t('confirmClear'))) {
            try {
                localStorage.removeItem(KNOWLEDGE_BASE_KEY);
                setDiseases([]);
            } catch (error) {
                console.error("Failed to clear knowledge base:", error);
            }
        }
    };
    
    const handleExport = () => {
        try {
            const storedData = localStorage.getItem(KNOWLEDGE_BASE_KEY);
            if (!storedData || Object.keys(JSON.parse(storedData)).length === 0) {
                alert('No data to export.');
                return;
            }
            
            const jsonString = JSON.stringify(JSON.parse(storedData), null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cropia_knowledge_base.json';
            document.body.appendChild(a);
            a.click();
            
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export data:", error);
            alert('An error occurred while exporting data.');
        }
    };

    const toggleExpansion = (diseaseName: string) => {
        setExpandedDisease(expandedDisease === diseaseName ? null : diseaseName);
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-brand-green-800 mb-2">{t('knowledgeBase')}</h2>
                            <p className="text-gray-600">{t('knowledgeBaseDescription')}</p>
                        </div>
                        {diseases.length > 0 && (
                             <div className="flex items-center flex-shrink-0 gap-2">
                                <button
                                    onClick={handleExport}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                                >
                                    <ExportIcon className="w-4 h-4" />
                                    <span>{t('exportData')}</span>
                                </button>
                                <button
                                    onClick={handleClearCache}
                                    className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                                >
                                    {t('clearCache')}
                                </button>
                            </div>
                        )}
                    </div>
                     {diseases.length > 0 && (
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                            />
                        </div>
                    )}
                </div>
            </Card>

            {filteredDiseases.length === 0 ? (
                <Card>
                    <div className="p-6 text-center text-gray-500">
                        {t('noData')}
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredDiseases.map(disease => (
                        <Card key={disease.diseaseName}>
                            <div className="p-4 cursor-pointer" onClick={() => toggleExpansion(disease.diseaseName)}>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-brand-green-800">{disease.diseaseName}</h3>
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${expandedDisease === disease.diseaseName ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {expandedDisease === disease.diseaseName && (
                                <div className="p-6 border-t border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                         <h3 className="text-xl font-bold text-brand-green-800">{disease.diseaseName}</h3>
                                         <RiskBadge level={disease.riskLevel} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-lg text-gray-700 mb-2">{t('symptoms')}</h4>
                                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                {disease.symptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg text-gray-700 mb-2">{t('preventionControl')}</h4>
                                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                {disease.prevention.map((item, index) => <li key={index}>{item}</li>)}
                                            </ul>
                                        </div>
                                         <div className="md:col-span-2">
                                            <h4 className="font-semibold text-lg text-gray-700 mb-2">{t('recommendedChemicals')}</h4>
                                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                                {disease.recommendedChemicals.map((chem, index) => <li key={index}>{chem}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KnowledgeBase;