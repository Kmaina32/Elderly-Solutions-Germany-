import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, MessageSquare, HelpCircle, ShieldAlert, ArrowRight, HeartPulse, Flame, Siren, User, Send } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../utils/cn';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Elderly solutions assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);

  const emergencyActions = [
    { label: 'Medics', icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-50', phone: '911' },
    { label: 'Fire', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', phone: '911' },
    { label: 'Police', icon: Siren, color: 'text-blue-600', bg: 'bg-blue-50', phone: '911' },
  ];

  const suggestedActions = [
    { label: 'Speak with Coordinator', icon: Phone, action: () => window.open('tel:18003533759') },
    { label: 'Message Caregiver', icon: MessageSquare, action: () => {} },
    { label: 'Help & FAQ', icon: HelpCircle, action: () => {} },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-end p-4 sm:p-8 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-primary/20 backdrop-blur-sm pointer-events-auto"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20, x: 20 }}
            className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh] pointer-events-auto"
          >
            {/* Chat Header */}
            <div className="bg-slate-primary p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <ShieldAlert size={20} className="text-terracotta" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-none">Assistance Center</h3>
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Always Online</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.sender === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.sender === 'bot' ? "bg-slate-primary text-white" : "bg-stone-200 text-stone-500")}>
                    {msg.sender === 'bot' ? <ShieldAlert size={14} /> : <User size={14} />}
                  </div>
                  <div className={cn("max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed", msg.sender === 'bot' ? "bg-white border border-stone-200 text-slate-primary rounded-tl-none" : "bg-slate-primary text-white rounded-tr-none")}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Emergency Services Grid */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center">Emergency Services</p>
                <div className="grid grid-cols-3 gap-2">
                  {emergencyActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => window.open(`tel:${action.phone}`)}
                      className={cn("flex flex-col items-center gap-2 p-3 rounded-xl border border-stone-200 transition-all hover:scale-105 active:scale-95 bg-white", action.color)}
                    >
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", action.bg)}>
                        <action.icon size={20} />
                      </div>
                      <span className="text-xs font-bold">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 text-center">Suggested Actions</p>
                <div className="space-y-2">
                  {suggestedActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="w-full flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl text-left transition-all hover:border-slate-primary hover:bg-stone-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <action.icon size={18} className="text-stone-400 group-hover:text-slate-primary" />
                        <span className="text-sm font-medium text-slate-primary">{action.label}</span>
                      </div>
                      <ArrowRight size={16} className="text-stone-300 group-hover:text-slate-primary" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input (Visual Only) */}
            <div className="p-4 bg-white border-t border-stone-200 flex gap-2">
              <div className="flex-1 bg-stone-100 rounded-full px-4 py-2 text-sm text-stone-400 flex items-center">
                Type a message...
              </div>
              <button className="w-10 h-10 bg-slate-primary text-white rounded-full flex items-center justify-center opacity-50 cursor-not-allowed">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
