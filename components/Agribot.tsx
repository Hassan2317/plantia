import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { createAgribotChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import LeafIcon from './icons/LeafIcon';
import { useLanguage } from '../context/LanguageContext';

const AGRIBOT_CHAT_HISTORY_KEY_PREFIX = 'agribot_chat_history_';

const Agribot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { language, t } = useLanguage();
    const chatHistoryKey = `${AGRIBOT_CHAT_HISTORY_KEY_PREFIX}${language}`;

    useEffect(() => {
        // Re-initialize chat and load history when language changes.
        const agribotChat = createAgribotChat(language);
        setChat(agribotChat);

        try {
            const storedHistory = localStorage.getItem(chatHistoryKey);
            if (storedHistory) {
                setMessages(JSON.parse(storedHistory));
            } else {
                setMessages([{
                    sender: 'bot',
                    text: t('agribotWelcome')
                }]);
            }
        } catch (error) {
            console.error('Failed to load or parse chat history:', error);
            setMessages([{
                sender: 'bot',
                text: t('agribotWelcome')
            }]);
        }
    // The dependency array ensures this effect runs when the language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language, t, chatHistoryKey]);

    useEffect(() => {
        // Save history whenever messages change, but only if there's an actual conversation.
        if (messages.length > 1) {
            try {
                localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
            } catch (error) {
                console.error('Failed to save chat history:', error);
            }
        }
    }, [messages, chatHistoryKey]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            
            let botResponse = '';
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

            for await (const chunk of stream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = botResponse;
                    return newMessages;
                });
            }

        } catch (error) {
            console.error('Agribot error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: t('agribotError') }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <div className="flex flex-col h-[75vh]">
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-brand-green-800">{t('agribotAssistant')}</h2>
                    <p className="text-gray-600">{t('agribotDescription')}</p>
                </div>
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-green-500 flex items-center justify-center text-white flex-shrink-0"><LeafIcon className="w-5 h-5"/></div>}
                                <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'}`}>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                         {isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'user' && (
                             <div className="flex items-end gap-2 justify-start">
                                 <div className="w-8 h-8 rounded-full bg-brand-green-500 flex items-center justify-center text-white flex-shrink-0"><LeafIcon className="w-5 h-5"/></div>
                                 <div className="max-w-md p-3 rounded-2xl bg-white text-gray-800 shadow-sm rounded-bl-none">
                                    <Spinner/>
                                 </div>
                             </div>
                         )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="p-4 border-t bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={t('agribotPlaceholder')}
                            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim()}
                            className="p-3 bg-brand-green-600 text-white rounded-full hover:bg-brand-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-offset-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </Card>
    );
};

export default Agribot;
