import React from 'react';
import { motion } from 'motion/react';
import { Heart, Stethoscope } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-brand-bg flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1 
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative mb-10"
      >
        {/* Pulsing background circle */}
        <motion.div
          animate={{ 
            scale: [1, 1.8, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-brand-accent rounded-full blur-3xl"
        />
        
        <div className="relative p-8 bg-white rounded-[2.5rem] shadow-2xl border border-brand-border flex items-center justify-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-brand-primary"
          >
            <Stethoscope size={56} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center"
      >
        <h2 className="text-3xl font-serif font-black text-brand-primary flex items-center gap-3 justify-center">
          <span className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white text-xl italic shadow-lg shadow-brand-accent/20">E</span>
          Elderly Solutions
        </h2>
        <motion.div 
          className="flex items-center justify-center gap-1 mt-4"
        >
          {["S", "e", "c", "u", "r", "i", "n", "g", " ", "c", "a", "r", "e", "..."].map((char, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.1,
                ease: "easeInOut"
              }}
              className="text-brand-muted text-[11px] font-bold tracking-widest uppercase"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>

      {/* Progress bar animation */}
      <div className="mt-16 w-56 h-1.5 bg-brand-border rounded-full overflow-hidden shadow-inner">
        <motion.div
          animate={{ 
            x: [-250, 250]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-1/2 h-full bg-brand-accent rounded-full shadow-[0_0_10px_rgba(242,125,38,0.5)]"
        />
      </div>
    </div>
  );
}
