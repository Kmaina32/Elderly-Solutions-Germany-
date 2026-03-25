import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '../components/Button';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Login() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Content */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 lg:py-20 bg-white z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full mx-auto lg:mx-0"
        >
          <div className="mb-12">
            <h2 className="text-2xl font-serif font-black text-brand-primary flex items-center gap-2">
              <span className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center text-white text-lg italic">E</span>
              ElderlyCare
            </h2>
            <p className="text-brand-muted text-sm font-medium tracking-[0.2em] uppercase mt-2">Solutions for a dignified life</p>
          </div>

          <div className="mb-10">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-brand-primary leading-[1.1] mb-6">
              Welcome <br />
              <span className="text-brand-accent italic">Back.</span>
            </h1>
            <p className="text-lg text-brand-muted leading-relaxed">
              Log in to access your personalized care dashboard, connect with your circle, and manage health services.
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-white text-brand-primary font-bold border-2 border-brand-border rounded-2xl hover:border-brand-primary hover:bg-brand-bg transition-all active:scale-[0.98] shadow-sm"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="pt-8 border-t border-brand-border">
              <p className="text-brand-muted text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-brand-accent font-bold hover:underline">
                  Register for free
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:flex flex-1 relative bg-brand-primary">
        <img 
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=2000" 
          alt="Elderly care"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-primary via-transparent to-transparent opacity-60" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-16 left-16 right-16 glass-card p-10 rounded-3xl"
        >
          <div className="flex gap-1 mb-6">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-5 h-5 text-brand-accent fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-2xl font-serif italic text-brand-primary leading-snug mb-8">
            "The care my mother receives through this platform is exceptional. It's not just technology; it's a bridge to a better life."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-accent/20 border-2 border-brand-accent overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=elena" alt="Dr. Elena" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-brand-primary text-lg">Dr. Elena Sorenson</p>
              <p className="text-brand-muted text-sm uppercase tracking-widest font-semibold">Chief Medical Officer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
