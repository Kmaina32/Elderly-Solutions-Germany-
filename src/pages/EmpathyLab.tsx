import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Heart, Send, ShieldAlert, Info, Brain, MessageSquare, Sparkles, Bot, User, Stethoscope, Calendar, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

interface AnalysisResult {
  label: string;
  score: number;
  advice: string;
}

export function EmpathyLab({ user }: { user: any }) {
  const [seekerPost, setSeekerPost] = useState('');
  const [responsePost, setResponsePost] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const handleAnalyze = async () => {
    if (!seekerPost || !responsePost) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults: AnalysisResult[] = [
        { 
          label: 'Low Empathy', 
          score: 0.15,
          advice: 'The response feels a bit detached. Try acknowledging the seeker\'s feelings more directly to build a stronger connection.'
        },
        { 
          label: 'Medium Empathy', 
          score: 0.25,
          advice: 'Good start! You\'ve acknowledged the situation, but adding a personal touch or a more supportive closing could help.'
        },
        { 
          label: 'High Empathy', 
          score: 0.60,
          advice: 'Excellent. This response shows deep understanding and emotional resonance. It creates a safe space for the seeker.'
        }
      ];
      
      const topResult = mockResults.sort((a, b) => b.score - a.score)[0];
      setResult(topResult);
    } catch (err) {
      setError('Failed to connect with the AI Companion. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout userRole={user.role}>
      <div className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center text-terracotta mb-4"
          >
            <Bot size={32} />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-terracotta block"
          >
            AI Psychologist & Companion
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-serif font-bold text-slate-primary leading-tight"
          >
            Empathetic Support Lab
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-stone-500 font-sans leading-relaxed"
          >
            Refine your communication and deepen your emotional intelligence with our AI-powered companion, designed to foster genuine human connection.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <Card className="p-8 space-y-8 border-none shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-primary">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
                    <User size={16} />
                  </div>
                  The Seeker's Voice
                </label>
                <textarea
                  value={seekerPost}
                  onChange={(e) => setSeekerPost(e.target.value)}
                  placeholder="What is the person sharing? (e.g., I've been feeling isolated lately...)"
                  className="w-full h-32 p-6 bg-stone-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all font-sans resize-none text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-primary">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400">
                    <MessageSquare size={16} />
                  </div>
                  Your Empathetic Response
                </label>
                <textarea
                  value={responsePost}
                  onChange={(e) => setResponsePost(e.target.value)}
                  placeholder="How would you respond to offer support?"
                  className="w-full h-32 p-6 bg-stone-50 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all font-sans resize-none text-lg"
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !seekerPost || !responsePost}
                className="w-full py-6 text-lg rounded-2xl shadow-lg shadow-terracotta/20"
                variant="primary"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Companion is Thinking...
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <Sparkles size={20} />
                    Analyze Connection
                  </span>
                )}
              </Button>
            </Card>

            {/* Human Booking Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-8 bg-sage-accent/5 border-sage-accent/20 border-2 rounded-3xl flex flex-col sm:flex-row items-center gap-8 group">
                <div className="w-20 h-20 shrink-0 bg-white rounded-2xl flex items-center justify-center text-sage-accent shadow-sm group-hover:scale-105 transition-transform">
                  <UserCheck size={40} />
                </div>
                <div className="space-y-4 flex-1 text-center sm:text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Speak to a Professional</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      Sometimes AI isn't enough. Connect with a licensed psychologist for a personalized session.
                    </p>
                  </div>
                  <Button 
                    variant="primary" 
                    className="bg-sage-accent hover:bg-slate-primary text-white px-8 py-3 rounded-xl flex items-center gap-2 mx-auto sm:mx-0"
                    onClick={() => setShowBooking(true)}
                  >
                    <Calendar size={18} />
                    Book a Session
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Results Section */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-white/50 backdrop-blur-sm border-2 border-dashed border-stone-200 rounded-[3rem]"
                >
                  <Bot className="text-stone-200 mb-8" size={80} />
                  <h3 className="text-3xl font-serif font-bold text-stone-300">Awaiting Dialogue</h3>
                  <p className="text-stone-400 max-w-xs mt-4 leading-relaxed">Share a conversation to receive empathetic insights from your AI Companion.</p>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-terracotta/10 border-t-terracotta rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-terracotta">
                      <Brain size={40} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-slate-primary mt-12">Deep Analysis</h3>
                  <p className="text-stone-500 mt-4 font-medium">Evaluating emotional resonance and context...</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <Card className="p-12 border-none shadow-[0_20px_60px_rgba(0,0,0,0.06)] rounded-[3rem] overflow-hidden relative bg-white">
                    <div className="absolute top-0 right-0 p-8">
                      <div className="bg-stone-50 text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-stone-100">
                        Companion Insight
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400">Connection Quality</span>
                        <h2 className={cn(
                          "text-7xl font-serif font-bold tracking-tight",
                          result.label === 'High Empathy' ? "text-emerald-600" : 
                          result.label === 'Medium Empathy' ? "text-amber-600" : "text-terracotta"
                        )}>
                          {result.label}
                        </h2>
                      </div>

                      <div className="p-8 bg-stone-50 rounded-3xl border border-stone-100 relative">
                        <div className="absolute -top-4 left-8 px-4 py-1 bg-white border border-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          Companion's Advice
                        </div>
                        <p className="text-lg text-slate-primary font-medium leading-relaxed italic">
                          "{result.advice}"
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
                          <span>Emotional Resonance</span>
                          <span>{(result.score * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score * 100}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={cn(
                              "h-full rounded-full",
                              result.label === 'High Empathy' ? "bg-emerald-500" : 
                              result.label === 'Medium Empathy' ? "bg-amber-500" : "bg-terracotta"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <div className="p-10 bg-slate-primary text-white rounded-[2.5rem] space-y-6 shadow-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-terracotta">
                        <ShieldAlert size={28} />
                      </div>
                      <h4 className="font-serif font-bold text-2xl">Professional Guidance</h4>
                    </div>
                    <p className="text-base text-linen-bg/70 leading-relaxed">
                      While our AI Companion offers valuable insights, it is not a clinical tool. For serious mental health concerns, please consult with a professional.
                    </p>
                    <div className="pt-4 flex items-center justify-between">
                      <button 
                        onClick={() => setShowBooking(true)}
                        className="text-sm font-bold uppercase tracking-widest hover:text-terracotta transition-colors flex items-center gap-3 group"
                      >
                        Book Human Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Booking Modal Simulation */}
      <AnimatePresence>
        {showBooking && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBooking(false)}
              className="fixed inset-0 bg-slate-primary/40 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-12 z-[110] overflow-hidden"
            >
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-serif font-bold text-slate-primary">Book a Session</h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Professional Care</p>
                  </div>
                  <button onClick={() => setShowBooking(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-stone-50 text-stone-400 hover:text-slate-primary transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-sage-accent/10 flex items-center justify-center text-sage-accent">
                      <Stethoscope size={32} />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-primary">Dr. Sarah Mitchell</p>
                      <p className="text-xs text-stone-500 uppercase tracking-widest">Clinical Psychologist</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2">Select Date</label>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-sm font-medium text-slate-primary flex items-center justify-between">
                        March 25, 2026
                        <Calendar size={16} className="text-stone-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-2">Select Time</label>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-sm font-medium text-slate-primary flex items-center justify-between">
                        10:00 AM
                        <Calendar size={16} className="text-stone-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full py-6 text-lg rounded-2xl"
                  onClick={() => {
                    alert('Booking confirmed! You will receive a confirmation email shortly.');
                    setShowBooking(false);
                  }}
                >
                  Confirm Appointment
                </Button>

                <p className="text-center text-xs text-stone-400 italic">
                  Available for video call or in-person consultation.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}

const X = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
