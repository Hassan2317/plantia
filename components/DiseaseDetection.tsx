
import React, { useState, useCallback } from 'react';
import { diagnoseCropDisease } from '../services/geminiService';
import { DiseaseInfo, RiskLevel } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
    const riskStyles = {
        [RiskLevel.Low]: 'bg-green-100 text-green-800',
        [RiskLevel.Moderate]: 'bg-yellow-100 text-yellow-800',
        [RiskLevel.High]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${riskStyles[level]}`}>{level}</span>;
};


const DiseaseDetection: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<DiseaseInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleDiagnose = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const result = await diagnoseCropDisease(selectedFile);
            setAnalysisResult(result);
        } catch (err) {
            setError('Failed to analyze the image. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);
    
    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError(null);
        }
    }, []);

    return (
        <div className="space-y-6">
            <Card>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-brand-green-800 mb-2">Crop Disease Detection</h2>
                    <p className="text-gray-600 mb-4">Upload an image of an affected crop leaf to get an instant AI-powered diagnosis and treatment advice.</p>
                    
                    <label 
                        className="flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-brand-green-400 focus:outline-none"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <span className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="font-medium text-gray-600">
                                Drop files to Attach, or
                                <span className="text-blue-600 underline ml-1">browse</span>
                            </span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>

                    {previewUrl && (
                        <div className="mt-4 text-center">
                            <img src={previewUrl} alt="Selected crop" className="max-h-60 mx-auto rounded-lg shadow-md" />
                            <button
                                onClick={handleDiagnose}
                                disabled={isLoading}
                                className="mt-4 px-6 py-2 bg-brand-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-brand-green-700 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-opacity-75 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? <Spinner /> : 'Diagnose'}
                            </button>
                        </div>
                    )}
                </div>
            </Card>

            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {analysisResult && (
                 <Card>
                    <div className="p-6">
                        <div className="flex justify-between items-start">
                             <h3 className="text-xl font-bold text-brand-green-800 mb-2">Diagnosis Result: {analysisResult.diseaseName}</h3>
                             <RiskBadge level={analysisResult.riskLevel} />
                        </div>
                       
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <h4 className="font-semibold text-lg text-gray-700 mb-2">Symptoms</h4>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {analysisResult.symptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg text-gray-700 mb-2">Prevention & Control</h4>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {analysisResult.prevention.map((item, index) => <li key={index}>{item}</li>)}
                                </ul>
                            </div>
                             <div className="md:col-span-2">
                                <h4 className="font-semibold text-lg text-gray-700 mb-2">Recommended Chemicals</h4>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {analysisResult.recommendedChemicals.map((chem, index) => <li key={index}>{chem}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default DiseaseDetection;
