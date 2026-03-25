import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Bot, 
  MessageSquare, 
  Sparkles, 
  Search, 
  Heart, 
  ShieldAlert, 
  Send, 
  User, 
  Brain, 
  History, 
  Settings, 
  ChevronRight,
  Info,
  ArrowRight,
  Stethoscope,
  Calendar,
  X,
  UserCheck,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

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

export function AIAssistant({ user }: { user: any }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = (searchParams.get('mode') as AIMode) || 'chat';
  const [activeMode, setActiveMode] = useState<AIMode>(initialMode);

  useEffect(() => {
    setSearchParams({ mode: activeMode });
  }, [activeMode, setSearchParams]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user.name || 'there'}. I'm your AI Care Companion. I can help you with general support, analyze empathy in your conversations, or search our Knowledge Hub for caregiving resources. How can I support you today?`,
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
    scrollToBottom();
  }, [messages, isTyping]);

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
        content: `Hello ${user.name || 'there'}. I'm your AI Care Companion. I can help you with general support, analyze empathy in your conversations, or search our Knowledge Hub for caregiving resources. How can I support you today?`,
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
    <Layout userRole={user.role}>
      <div className="h-[calc(100vh-12rem)] flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-slate-primary">AI Assistant</h2>
                <p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">Care Companion</p>
              </div>
            </div>

            <nav className="space-y-2">
              <NavButton 
                active={activeMode === 'chat'} 
                onClick={() => setActiveMode('chat')}
                icon={<MessageSquare size={18} />}
                label="General Support"
                description="Chat with your care companion"
              />
              <NavButton 
                active={activeMode === 'empathy'} 
                onClick={() => setActiveMode('empathy')}
                icon={<Heart size={18} />}
                label="Empathy Lab"
                description="Analyze emotional connection"
              />
              <NavButton 
                active={activeMode === 'knowledge'} 
                onClick={() => setActiveMode('knowledge')}
                icon={<Search size={18} />}
                label="Knowledge Hub"
                description="Search caregiving resources"
              />
            </nav>
          </div>

          <div className="flex-1 p-6 bg-slate-primary text-white rounded-3xl shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Brain size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="font-serif font-bold text-xl">Need Professional Help?</h3>
              <p className="text-sm text-linen-bg/60 leading-relaxed">
                Our AI is here to support, but some things require a human touch.
              </p>
              <Button 
                onClick={() => navigate('/services')}
                className="w-full bg-white/10 hover:bg-white/20 border-none text-white text-xs uppercase tracking-widest font-bold py-3"
              >
                Talk to a Specialist
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeMode === 'chat' && (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col"
              >
                {/* Chat Header */}
                <div className="px-8 py-6 border-bottom border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">AI Companion Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={clearChat}
                      className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                      title="Clear Chat"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-stone-400 hover:text-slate-primary transition-colors"><History size={18} /></button>
                    <button className="p-2 text-stone-400 hover:text-slate-primary transition-colors"><Settings size={18} /></button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-4 max-w-[80%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                        msg.role === 'assistant' ? "bg-terracotta/10 text-terracotta" : "bg-slate-primary text-white"
                      )}>
                        {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                      </div>
                      <div className={cn(
                        "p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm",
                        msg.role === 'assistant' 
                          ? "bg-stone-50 text-slate-primary rounded-tl-none" 
                          : "bg-terracotta text-white rounded-tr-none"
                      )}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                        <Bot size={20} />
                      </div>
                      <div className="p-5 bg-stone-50 rounded-[2rem] rounded-tl-none flex gap-1 items-center">
                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 bg-stone-50/50 border-t border-stone-100">
                  <div className="relative max-w-4xl mx-auto">
                    <input 
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message here..."
                      className="w-full py-5 pl-8 pr-20 bg-white border-none rounded-full shadow-lg focus:ring-2 focus:ring-terracotta/20 transition-all text-slate-primary"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isTyping}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-terracotta text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMode === 'empathy' && (
              <motion.div 
                key="empathy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-12 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-serif font-bold text-slate-primary">Empathy Lab</h2>
                    <p className="text-stone-500">Refine your communication and deepen emotional intelligence.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2">The Seeker's Voice</label>
                        <textarea 
                          value={seekerPost}
                          onChange={(e) => setSeekerPost(e.target.value)}
                          placeholder="What did they say?"
                          className="w-full h-40 p-6 bg-stone-50 border-none rounded-3xl focus:ring-2 focus:ring-terracotta/20 transition-all resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2">Your Response</label>
                        <textarea 
                          value={responsePost}
                          onChange={(e) => setResponsePost(e.target.value)}
                          placeholder="How would you respond?"
                          className="w-full h-40 p-6 bg-stone-50 border-none rounded-3xl focus:ring-2 focus:ring-terracotta/20 transition-all resize-none"
                        />
                      </div>
                      <Button 
                        onClick={handleAnalyzeEmpathy}
                        disabled={isAnalyzing || !seekerPost || !responsePost}
                        className="w-full py-6 rounded-2xl"
                      >
                        {isAnalyzing ? "Analyzing..." : "Analyze Connection"}
                      </Button>
                    </div>

                    <div className="relative">
                      <AnimatePresence mode="wait">
                        {!analysisResult ? (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-stone-50/50 border-2 border-dashed border-stone-200 rounded-[3rem]">
                            <Sparkles className="text-stone-200 mb-4" size={48} />
                            <p className="text-stone-400 text-sm">Results will appear here after analysis.</p>
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                          >
                            <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white">
                              <div className="space-y-6">
                                <div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Empathy Level</span>
                                  <h3 className={cn(
                                    "text-4xl font-serif font-bold",
                                    analysisResult.label === 'High Empathy' ? "text-emerald-600" : "text-terracotta"
                                  )}>{analysisResult.label}</h3>
                                </div>
                                <div className="p-6 bg-stone-50 rounded-2xl italic text-slate-primary">
                                  "{analysisResult.advice}"
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-stone-400">
                                    <span>Score</span>
                                    <span>{(analysisResult.score * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${analysisResult.score * 100}%` }}
                                      className="h-full bg-terracotta"
                                    />
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeMode === 'knowledge' && (
              <motion.div 
                key="knowledge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 p-12 overflow-y-auto custom-scrollbar"
              >
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="space-y-4 text-center">
                    <h2 className="text-4xl font-serif font-bold text-slate-primary">Knowledge Hub</h2>
                    <p className="text-stone-500">Search for caregiving resources, medical info, and more.</p>
                  </div>

                  <div className="relative max-w-2xl mx-auto">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Ask anything... (e.g., How to manage dementia symptoms?)"
                      className="w-full py-6 pl-8 pr-20 bg-stone-50 border-none rounded-3xl focus:ring-2 focus:ring-terracotta/20 transition-all"
                    />
                    <button 
                      onClick={handleSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-primary text-white rounded-2xl flex items-center justify-center"
                    >
                      <Search size={20} />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {isSearching ? (
                      <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="w-12 h-12 border-4 border-stone-100 border-t-terracotta rounded-full animate-spin" />
                        <p className="text-stone-400 font-medium">Searching global knowledge...</p>
                      </div>
                    ) : searchResult ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose prose-stone max-w-none bg-stone-50 p-10 rounded-[3rem] border border-stone-100"
                      >
                        <div className="flex items-center gap-3 mb-6 text-terracotta">
                          <Sparkles size={24} />
                          <h3 className="m-0 font-serif font-bold text-2xl text-slate-primary">AI Insights</h3>
                        </div>
                        <div className="text-slate-primary leading-relaxed whitespace-pre-wrap">
                          {searchResult}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </Layout>
  );
}

function NavButton({ active, onClick, icon, label, description }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; description: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left",
        active 
          ? "bg-stone-50 text-terracotta shadow-sm" 
          : "text-stone-400 hover:bg-stone-50/50 hover:text-slate-primary"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
        active ? "bg-white text-terracotta shadow-sm" : "bg-stone-50 text-stone-400 group-hover:bg-white"
      )}>
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-sm tracking-tight truncate">{label}</span>
        <span className="text-[10px] opacity-60 truncate">{description}</span>
      </div>
      {active && (
        <motion.div layoutId="active-pill" className="ml-auto shrink-0">
          <ChevronRight size={16} />
        </motion.div>
      )}
    </button>
  );
}
