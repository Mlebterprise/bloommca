import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LottieLoader } from "./LottieLoader";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: "Hi! I'm your personal wellness coach. I'm here to support you on your journey of growth and self-discovery. How are you feeling today? 🌸",
    sender: 'ai',
    timestamp: new Date(),
  }
];


export const AICoaching: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // FORZATO: Delay di 5 secondi prima di ogni risposta
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Get conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10);

      const { data, error } = await supabase.functions.invoke('ai-coaching', {
        body: {
          message: currentInput,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data || !data.response) {
        throw new Error('Invalid response from AI service');
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response in case of error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that you're strong and capable. 💚",
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to AI coach. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="h-[600px] flex flex-col bg-gradient-card rounded-lg shadow-soft">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-wellness-primary flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Wellness Coach
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Your personal guide for mental wellness and growth
        </p>
      </CardHeader>

      {/* Chat messages area - scrollable */}
      <div className="flex-1 overflow-y-auto px-4">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-wellness-primary text-primary-foreground'
                    : 'bg-wellness-soft text-foreground'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'ai' && (
                    <Bot className="w-4 h-4 mt-0.5 text-wellness-primary flex-shrink-0" />
                  )}
                  {message.sender === 'user' && (
                    <User className="w-4 h-4 mt-0.5 text-primary-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm break-words">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-wellness-soft rounded-lg p-3 max-w-[85%]">
                <LottieLoader 
                  size={60} 
                  text="AI is thinking..." 
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Fixed input area - always visible at bottom */}
      <div className="flex-shrink-0 border-t border-border p-4 bg-gradient-card">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your thoughts..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={sendMessage}
            className="bg-wellness-primary hover:bg-wellness-secondary"
            size="icon"
            disabled={isTyping || !inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};