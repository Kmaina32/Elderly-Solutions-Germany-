import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'motion/react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'lg', ...props }, ref) => {
    const variants = {
      primary: 'bg-slate-primary text-linen-bg hover:bg-slate-primary/90 shadow-lg shadow-slate-primary/20 border border-slate-primary',
      secondary: 'bg-transparent text-slate-primary border-2 border-slate-primary hover:bg-slate-primary hover:text-linen-bg',
      accent: 'bg-sage-accent text-linen-bg hover:bg-sage-accent/90 shadow-lg shadow-sage-accent/20 border border-sage-accent',
      danger: 'bg-terracotta text-linen-bg hover:bg-terracotta/90 shadow-lg shadow-terracotta/20 border border-terracotta',
      ghost: 'bg-transparent text-slate-primary hover:bg-stone-100',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[40px]',
      md: 'px-6 py-3 text-base font-bold uppercase tracking-wider min-h-[56px]',
      lg: 'px-8 py-4 text-lg font-bold uppercase tracking-widest min-h-[64px]',
      xl: 'px-10 py-5 text-xl font-bold uppercase tracking-[0.2em] min-h-[72px]',
    };

    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-slate-primary/30 disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
