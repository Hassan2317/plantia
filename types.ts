// Fix: Defined and exported all necessary types to resolve import errors across the application.
export enum Tab {
  Detect = 'detect',
  Agribot = 'agribot',
  Weather = 'weather',
  KnowledgeBase = 'knowledge-base',
}

export enum Language {
    EN = 'en',
    NY = 'ny',
}

export enum RiskLevel {
    Low = 'Low',
    Moderate = 'Moderate',
    High = 'High',
}

export interface DiseaseInfo {
    diseaseName: string;
    symptoms: string[];
    riskLevel: RiskLevel;
    recommendedChemicals: string[];
    prevention: string[];
}

export interface WeatherData {
    current: {
        temp: number;
        humidity: number;
        description: string;
    };
    forecast: {
        day: string;
        high: number;
        low: number;
        description: string;
    }[];
}

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}
