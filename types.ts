
export enum Tab {
  Detect = 'Detect',
  Agribot = 'Agribot',
  Weather = 'Weather',
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

export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export interface ForecastDay {
    day: string;
    high: number;
    low: number;
    description: string;
}

export interface WeatherData {
    current: {
        temp: number;
        humidity: number;
        description: string;
    };
    forecast: ForecastDay[];
}
