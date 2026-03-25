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
      primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-md shadow-brand-primary/10 border border-brand-primary',
      secondary: 'bg-transparent text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white',
      accent: 'bg-brand-accent text-white hover:bg-brand-accent/90 shadow-md shadow-brand-accent/10 border border-brand-accent',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/10 border border-red-600',
      ghost: 'bg-transparent text-brand-primary hover:bg-stone-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider min-h-[36px]',
      md: 'px-5 py-2.5 text-sm font-bold uppercase tracking-wider min-h-[48px]',
      lg: 'px-6 py-3 text-base font-bold uppercase tracking-widest min-h-[56px]',
      xl: 'px-8 py-4 text-lg font-bold uppercase tracking-[0.2em] min-h-[64px]',
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
