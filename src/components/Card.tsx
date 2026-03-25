import React from 'react';
import { cn } from '../utils/cn';
import { motion } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  key?: React.Key;
}

export function Card({ className, title, description, icon, children, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        'bg-white border border-stone-200 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 group',
        className
      )}
      {...props}
    >
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6 mb-6 lg:mb-8">
        {icon && (
          <div className="p-3 bg-stone-50 rounded-xl text-brand-primary border border-stone-100 group-hover:scale-105 transition-transform duration-300 shadow-xs">
            {icon}
          </div>
        )}
        <div className="flex-1 space-y-2">
          {title && (
            <h3 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary leading-tight tracking-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm lg:text-base text-stone-500 font-sans leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="font-sans">
        {children}
      </div>
    </motion.div>
  );
}
