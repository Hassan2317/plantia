
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { createAgribotChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';
import LeafIcon from './icons/LeafIcon';

const Agribot: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const agribotChat = createAgribotChat();
        setChat(agribotChat);
        setMessages([{
            sender: 'bot',
            text: "Hello! I'm Agribot. How can I help you with your crops today? Describe the symptoms you're seeing."
        }]);
    }, []);

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
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Card>
            <div className="flex flex-col h-[75vh]">
                <div className="p-4 border-b">
                    <h2 className="text-2xl font-bold text-brand-green-800">Agribot Assistant</h2>
                    <p className="text-gray-600">Describe crop symptoms to get AI-powered advice.</p>
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
                         {isLoading && messages[messages.length - 1].sender === 'user' && (
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
                            placeholder="e.g., 'My tomato leaves have yellow spots...'"
                            className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !userInput.trim()}
                            className="p-3 bg-brand-green-600 text-white rounded-full hover:bg-brand-green-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green-500 focus:ring-offset-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </Card>
    );
};

export default Agribot;
