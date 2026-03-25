import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  Heart, 
  Search, 
  Send, 
  User, 
  X, 
  Minimize2, 
  Maximize2,
  Trash2,
  Sparkles,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { GoogleGenAI, Type } from "@google/genai";
import { Button } from './Button';
import { Card } from './Card';

type AIMode = 'chat' | 'empathy' | 'knowledge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AnalysisResult {
  label: string;
  score: number;
  advice: string;
}

export function FloatingAIAssistant({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState<AIMode>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}. I'm your AI Care Companion. How can I support you today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Empathy Lab State
  const [seekerPost, setSeekerPost] = useState('');
  const [responsePost, setResponsePost] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Knowledge Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: "You are a supportive and professional AI Care Companion for caregivers and elderly individuals. Provide clear, empathetic, and helpful advice related to caregiving, health, and emotional well-being. If asked for medical advice, always include a disclaimer to consult a professional.",
        }
      });

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || "I'm sorry, I couldn't process that. Could you rephrase?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `Hello ${user?.name || 'there'}. I'm your AI Care Companion. How can I support you today?`,
        timestamp: new Date()
      }
    ]);
  };

  const handleAnalyzeEmpathy = async () => {
    if (!seekerPost || !responsePost) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following conversation for empathy.
        Seeker: "${seekerPost}"
        Response: "${responsePost}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              score: { type: Type.NUMBER },
              advice: { type: Type.STRING },
            },
            required: ["label", "score", "advice"],
          },
        },
      });
      setAnalysisResult(JSON.parse(response.text));
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: searchQuery,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      setSearchResult(response.text);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '64px' : '600px',
              width: isMinimized ? '200px' : '400px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-brand-primary text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-serif font-bold text-sm">AI Care Companion</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Mode Switcher */}
                <div className="flex border-b border-stone-100 bg-stone-50/50 p-1 shrink-0">
                  <button 
                    onClick={() => setActiveMode('chat')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                      activeMode === 'chat' ? "bg-white text-brand-primary shadow-sm" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    <MessageSquare size={14} />
                    Chat
                  </button>
                  <button 
                    onClick={() => setActiveMode('empathy')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                      activeMode === 'empathy' ? "bg-white text-brand-primary shadow-sm" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    <Heart size={14} />
                    Lab
                  </button>
                  <button 
                    onClick={() => setActiveMode('knowledge')}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                      activeMode === 'knowledge' ? "bg-white text-brand-primary shadow-sm" : "text-stone-400 hover:text-stone-600"
                    )}
                  >
                    <Search size={14} />
                    Search
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {activeMode === 'chat' && (
                    <div className="p-4 space-y-4">
                      {messages.map((msg) => (
                        <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                          <div className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                            msg.role === 'assistant' ? "bg-brand-primary/10 text-brand-primary" : "bg-stone-800 text-white"
                          )}>
                            {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                          </div>
                          <div className={cn(
                            "p-3 rounded-2xl text-xs leading-relaxed max-w-[85%]",
                            msg.role === 'assistant' ? "bg-stone-50 text-stone-800 rounded-tl-none" : "bg-brand-primary text-white rounded-tr-none"
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                            <Bot size={16} />
                          </div>
                          <div className="p-3 bg-stone-50 rounded-2xl rounded-tl-none flex gap-1 items-center">
                            <div className="w-1 h-1 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1 h-1 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1 h-1 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}

                  {activeMode === 'empathy' && (
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Seeker Voice</label>
                          <textarea 
                            value={seekerPost}
                            onChange={(e) => setSeekerPost(e.target.value)}
                            placeholder="What did they say?"
                            className="w-full h-24 p-4 bg-stone-50 border-none rounded-2xl text-xs focus:ring-1 focus:ring-brand-primary/20 resize-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Your Response</label>
                          <textarea 
                            value={responsePost}
                            onChange={(e) => setResponsePost(e.target.value)}
                            placeholder="How would you respond?"
                            className="w-full h-24 p-4 bg-stone-50 border-none rounded-2xl text-xs focus:ring-1 focus:ring-brand-primary/20 resize-none"
                          />
                        </div>
                        <Button 
                          onClick={handleAnalyzeEmpathy}
                          disabled={isAnalyzing || !seekerPost || !responsePost}
                          className="w-full py-3 rounded-xl text-xs"
                        >
                          {isAnalyzing ? "Analyzing..." : "Analyze Connection"}
                        </Button>
                      </div>

                      {analysisResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <Card className="p-5 border-none shadow-md bg-stone-50">
                            <h4 className="text-xs font-bold text-brand-primary mb-2">{analysisResult.label}</h4>
                            <p className="text-[11px] text-stone-600 italic mb-3">"{analysisResult.advice}"</p>
                            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-primary" style={{ width: `${analysisResult.score * 100}%` }} />
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {activeMode === 'knowledge' && (
                    <div className="p-6 space-y-6">
                      <div className="relative">
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          placeholder="Search care resources..."
                          className="w-full py-3 pl-4 pr-10 bg-stone-50 border-none rounded-xl text-xs focus:ring-1 focus:ring-brand-primary/20"
                        />
                        <button 
                          onClick={handleSearch}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-brand-primary"
                        >
                          <Search size={16} />
                        </button>
                      </div>

                      {isSearching ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-3">
                          <div className="w-8 h-8 border-2 border-stone-100 border-t-brand-primary rounded-full animate-spin" />
                          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Searching...</p>
                        </div>
                      ) : searchResult ? (
                        <div className="prose prose-stone prose-xs bg-stone-50 p-5 rounded-2xl border border-stone-100">
                          <div className="flex items-center gap-2 mb-3 text-brand-primary">
                            <Sparkles size={14} />
                            <span className="font-bold text-[10px] uppercase tracking-widest">AI Insights</span>
                          </div>
                          <div className="text-[11px] text-stone-700 leading-relaxed whitespace-pre-wrap">
                            {searchResult}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <Brain size={32} className="mx-auto text-stone-200 mb-2" />
                          <p className="text-[10px] text-stone-400 uppercase font-bold tracking-widest">Knowledge Hub</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Input (Chat Mode Only) */}
                {activeMode === 'chat' && (
                  <div className="p-4 border-t border-stone-100 bg-white shrink-0">
                    <div className="relative">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="w-full py-3 pl-4 pr-12 bg-stone-50 border-none rounded-2xl text-xs focus:ring-1 focus:ring-brand-primary/20"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all",
          isOpen ? "bg-stone-800 text-white" : "bg-brand-primary text-white"
        )}
      >
        {isOpen ? <X size={24} /> : <Bot size={28} />}
      </motion.button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
