import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useGeminiChat = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<any>(null);

  const initializeChat = () => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new Error("API key is not defined");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    chatRef.current = model.startChat();
  };

  const sendMessage = async (prompt: string) => {
    if (!chatRef.current) {
      initializeChat();
    }
    
    setIsLoading(true);
    try {
      const result = await chatRef.current.sendMessage(prompt +"keep response short");
      setAiResponse(result.response.text());
      setHistory(await chatRef.current.getHistory());
    } catch(e){
      console.log(e);
      const errorMsg = e instanceof Error ? e.message : 'An error occurred';
      if (errorMsg.includes('overloaded')) {
        setError('Model is overloaded. Please try again in a moment.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendCondenseMessage = async (prompt: string) => {
    initializeChat(); // Start fresh chat
    
    setIsLoading(true);
    try {
      const result = await chatRef.current.sendMessage(prompt);
      setAiResponse(result.response.text());
      setHistory(await chatRef.current.getHistory());
    } catch(e){
      console.log(e);
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  return {
    aiResponse,
    isLoading,
    sendMessage,
    sendCondenseMessage,
    history,
    setHistory,
    error
  };
};