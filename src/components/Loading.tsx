import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({ fullScreen = true, message = "Dignified Care" }: LoadingProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center bg-linen-bg",
      fullScreen ? "fixed inset-0 z-[100]" : "w-full h-full p-12"
    )}>
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 border border-sage-accent/30 rounded-full"
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ 
              scale: [0.6, 1, 0.6],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 3,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 border border-terracotta/20 rounded-full"
          />
          
          {/* Central Logo Mark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-slate-primary rounded-2xl flex items-center justify-center shadow-xl mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-linen-bg/30 border-t-linen-bg rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Text Branding */}
        <div className="mt-8 text-center space-y-2">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-serif font-bold text-slate-primary tracking-tight"
          >
            Elderly solutions
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-[1px] bg-stone-300 mx-auto"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4 }}
            className="text-[10px] font-sans font-bold uppercase tracking-[0.4em] text-stone-500"
          >
            {message}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
