import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useGeminiChat = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      const result = await chatRef.current.sendMessage(prompt);
      setAiResponse(result.response.text());
    } finally {
      setIsLoading(false);
    }
  };

  return {
    aiResponse,
    isLoading,
    sendMessage
  };
};