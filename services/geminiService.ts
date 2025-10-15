
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { DiseaseInfo, WeatherData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const diagnoseCropDisease = async (image: File): Promise<DiseaseInfo> => {
    const imagePart = await fileToGenerativePart(image);
    const textPart = {
        text: `You are an expert agricultural pathologist. Analyze the provided image of a plant leaf. Identify the disease, its symptoms, risk level (Low, Moderate, High), recommended chemical treatments with dosage, and prevention/control measures. Ensure the response adheres to the provided JSON schema.`,
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    diseaseName: { type: Type.STRING, description: "The common name of the identified plant disease." },
                    symptoms: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key symptoms observed." },
                    riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'], description: "The assessed risk level to the crop." },
                    recommendedChemicals: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of recommended chemical treatments, including dosage if possible." },
                    prevention: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of preventative measures to control the spread." },
                },
                required: ["diseaseName", "symptoms", "riskLevel", "recommendedChemicals", "prevention"],
            },
        },
    });
    
    const jsonString = response.text;
    return JSON.parse(jsonString) as DiseaseInfo;
};

export const createAgribotChat = (): Chat => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are Agribot, an expert agricultural assistant specializing in crop diseases. Communicate in a clear, simple, and supportive manner. You can diagnose diseases based on text descriptions of symptoms. Offer advice on prevention and treatment. If asked about things outside of agriculture, politely state that you can only help with farming-related questions."
        },
    });
};

export const getWeatherInfo = async (location: string): Promise<WeatherData> => {
    const prompt = `Generate a realistic weather report for ${location}. The report should include the current temperature in Celsius, humidity percentage, a short weather description, and a 5-day forecast. Each day in the forecast should include the day of the week, high temperature, low temperature, and a short weather description. Provide the response in JSON format.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    current: {
                        type: Type.OBJECT,
                        properties: {
                            temp: { type: Type.INTEGER, description: "Current temperature in Celsius." },
                            humidity: { type: Type.INTEGER, description: "Current humidity in percentage." },
                            description: { type: Type.STRING, description: "A brief description of current weather." },
                        },
                         required: ["temp", "humidity", "description"],
                    },
                    forecast: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                day: { type: Type.STRING, description: "Day of the week." },
                                high: { type: Type.INTEGER, description: "High temperature for the day in Celsius." },
                                low: { type: Type.INTEGER, description: "Low temperature for the day in Celsius." },
                                description: { type: Type.STRING, description: "A brief weather description for the day." },
                            },
                             required: ["day", "high", "low", "description"],
                        }
                    }
                },
                required: ["current", "forecast"],
            }
        }
    });

    const jsonString = response.text;
    return JSON.parse(jsonString) as WeatherData;
};
