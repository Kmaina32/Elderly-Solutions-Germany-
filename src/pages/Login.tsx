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
    <div className="min-h-screen bg-linen-bg flex flex-col lg:flex-row relative overflow-hidden">
      {/* Mobile Background Image (Only visible on mobile) */}
      <div className="lg:hidden absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=2000" 
          alt="Elderly care background"
          className="w-full h-full object-cover opacity-15 grayscale-[0.3]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linen-bg/40 backdrop-blur-[2px]" />
      </div>

      {/* Left Side: Editorial Content */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-20 bg-white/80 lg:bg-white border-r border-stone-200 relative z-10 backdrop-blur-sm lg:backdrop-blur-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl"
        >
          <div className="flex flex-col mb-12">
            <span className="text-2xl font-serif font-bold tracking-tight text-slate-primary leading-none">
              Elderly solutions
            </span>
            <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-stone-400 mt-2">
              Dignified Care
            </span>
          </div>

          <nav className="flex gap-8 mb-12 border-b border-stone-100 pb-4">
            <Link to="/login" className="text-sm font-sans font-bold uppercase tracking-widest text-slate-primary border-b-2 border-slate-primary pb-4 -mb-[18px]">Login</Link>
            <Link to="/signup" className="text-sm font-sans font-bold uppercase tracking-widest text-stone-400 hover:text-slate-primary transition-colors">Register</Link>
          </nav>
          <h1 className="text-4xl lg:text-6xl font-serif font-bold text-slate-primary leading-[0.9] tracking-tight mb-8">
            Dignified Care for the Modern Elder.
          </h1>
          <p className="text-xl text-stone-500 font-sans leading-relaxed mb-16">
            Elderly solutions is a premium care technology studio dedicated to connecting elders with their community and essential services through thoughtful, accessible design.
          </p>
          
          <div className="space-y-6">
            <button 
              onClick={handleLogin}
              className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-white text-stone-700 font-sans font-semibold border border-stone-300 rounded-lg hover:bg-stone-50 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign In with Google</span>
            </button>
            <p className="text-sm font-sans font-medium uppercase tracking-[0.2em] text-stone-400">
              Secure Access via Google Healthcare ID
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Immersive Visual */}
      <div className="hidden lg:flex flex-1 bg-stone-100 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6958?auto=format&fit=crop&q=80&w=2000" 
          alt="Elderly care companion"
          className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale-[0.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-primary/10" />
        <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl">
          <p className="text-xl font-serif italic text-slate-primary leading-relaxed">
            "Design is not just what it looks like and feels like. Design is how it works for those who need it most."
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-sage-accent" />
            <div>
              <p className="font-bold text-slate-primary">Dr. Elena Sorenson</p>
              <p className="text-sm text-stone-500 uppercase tracking-widest">Chief Medical Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
