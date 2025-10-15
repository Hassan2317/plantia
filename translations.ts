import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    detectDisease: 'Detect Disease',
    agribot: 'Agribot',
    weather: 'Weather',
    knowledgeBase: 'Knowledge Base',
    // DiseaseDetection
    cropDiseaseDetection: 'Crop Disease Detection',
    diseaseDetectionDescription: 'Upload an image of an affected crop leaf to get an instant AI-powered diagnosis and treatment advice.',
    dropFiles: 'Drop files to Attach, or',
    browse: 'browse',
    diagnose: 'Diagnose',
    failedToAnalyze: 'Failed to analyze the image. Please try again.',
    diagnosisResult: 'Diagnosis Result:',
    symptoms: 'Symptoms',
    preventionControl: 'Prevention & Control',
    recommendedChemicals: 'Recommended Chemicals',
    // Agribot
    agribotAssistant: 'Agribot Assistant',
    agribotDescription: 'Describe crop symptoms to get AI-powered advice.',
    agribotWelcome: "Hello! I'm Agribot. How can I help you with your crops today? Describe the symptoms you're seeing.",
    agribotPlaceholder: "e.g., 'My tomato leaves have yellow spots...'",
    agribotError: 'Sorry, I encountered an error. Please try again.',
    // Weather
    weatherForecast: 'Agricultural Weather Forecast',
    weatherDescription: 'Get localized weather updates to plan your farming activities and prevent disease outbreaks.',
    enterLocation: 'Enter your city or region',
    getWeather: 'Get Weather',
    failedToFetchWeather: 'Failed to fetch weather data. Please try again.',
    pleaseEnterLocation: 'Please enter a location.',
    currentConditionsIn: 'Current Conditions in',
    humidity: 'Humidity',
    fiveDayForecast: '5-Day Forecast',
    // Knowledge Base
    knowledgeBaseDescription: 'Access previously diagnosed disease information, even when offline.',
    noData: 'No disease information has been saved yet. Diagnose a disease to add it here.',
    searchPlaceholder: 'Search for a disease...',
    clearCache: 'Clear All Saved Data',
    confirmClear: 'Are you sure you want to delete all saved disease information? This action cannot be undone.',
    exportData: 'Export Data',
    // Footer
    footerText: 'CROPIA © {year}. AI for modern agriculture.',
  },
  ny: { // Chichewa translations
    // Header
    detectDisease: 'Zindikirani Matenda',
    agribot: 'Agribot',
    weather: 'Zanyengo',
    knowledgeBase: 'Chidziwitso',
    // DiseaseDetection
    cropDiseaseDetection: 'Kuzindikira Matenda a Mbeu',
    diseaseDetectionDescription: 'Ikani chithunzi cha tsamba la mbeu yodwala kuti mupeze matenda ake ndi malangizo a mankhwala mwachangu.',
    dropFiles: 'Ponyani mafayilo, kapena',
    browse: 'sakatulani',
    diagnose: 'Zindikirani',
    failedToAnalyze: 'Zalephera kusanthula chithunzichi. Chonde yesaninso.',
    diagnosisResult: 'Zotsatira:',
    symptoms: 'Zizindikiro',
    preventionControl: 'Kupewa ndi Kusamalira',
    recommendedChemicals: 'Mankhwala Ovomerezeka',
    // Agribot
    agribotAssistant: 'Mthandizi wa Agribot',
    agribotDescription: 'Fotokozani zizindikiro za mbeu kuti mupeze malangizo kuchokera ku AI.',
    agribotWelcome: "Moni! Ndine Agribot. Ndingakuthandizeni bwanji ndi mbeu zanu lero? Fotokozani zizindikiro zomwe mukuwona.",
    agribotPlaceholder: "Mwachitsanzo, 'Masamba a phwetekere anga ali ndi madontho achikasu...'",
    agribotError: 'Pepani, ndakumana ndi vuto. Chonde yesaninso.',
    // Weather
    weatherForecast: 'Zanyengo za Kulima',
    weatherDescription: 'Pezani zanyengo zakomwe muli kuti mukonzekere ntchito zanu za kulima ndi kupewa matenda.',
    enterLocation: 'Lowetsani mzinda kapena dera lanu',
    getWeather: 'Pezani Zanyengo',
    failedToFetchWeather: 'Zalephera kupeza zanyengo. Chonde yesaninso.',
    pleaseEnterLocation: 'Chonde lowetsani malo.',
    currentConditionsIn: 'Momwe Zinthu Zilili mu',
    humidity: 'Chinyezi',
    fiveDayForecast: 'Zanyengo za Masiku 5',
    // Knowledge Base
    knowledgeBaseDescription: 'Onani zambiri za matenda omwe mudawazindikira kale, ngakhale mulibe intaneti.',
    noData: 'Palibe chidziwitso cha matenda chomwe chasungidwa. Zindikirani matenda kuti muwonjezere pano.',
    searchPlaceholder: 'Fufuzani matenda...',
    clearCache: 'Chotsani Zonse Zosungidwa',
    confirmClear: 'Mukutsimikiza kuti mukufuna kuchotsa zambiri zonse za matenda? Izi sizingasinthidwe.',
    exportData: 'Tumizani Zambiri',
    // Footer
    footerText: 'CROPIA © {year}. AI ya ulimi wamakono.',
  },
};