import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Signup() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Signup failed:', error);
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
            <p className="text-brand-muted text-sm font-medium tracking-[0.2em] uppercase mt-2">Join our global community</p>
          </div>

          <div className="mb-10">
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-brand-primary leading-[1.1] mb-6">
              Start Your <br />
              <span className="text-brand-accent italic">Journey.</span>
            </h1>
            <p className="text-lg text-brand-muted leading-relaxed">
              Create an account to connect with verified caregivers, track health vitals, and discover community events.
            </p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-brand-primary text-white font-bold rounded-2xl hover:bg-brand-primary/90 transition-all active:scale-[0.98] shadow-xl shadow-brand-primary/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.8"/>
              </svg>
              <span>Register with Google</span>
            </button>

            <div className="pt-8 border-t border-brand-border">
              <p className="text-brand-muted text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-brand-accent font-bold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:flex flex-1 relative bg-brand-accent">
        <img 
          src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=2000" 
          alt="Community connection"
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-accent via-transparent to-transparent opacity-60" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute bottom-16 left-16 right-16 glass-card p-10 rounded-3xl"
        >
          <p className="text-2xl font-serif italic text-brand-primary leading-snug mb-8">
            "Belonging is a fundamental human need. We build the bridges that bring us together, ensuring no one walks alone."
          </p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-primary/20 border-2 border-brand-primary overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-brand-primary text-lg">Sarah Jenkins</p>
              <p className="text-brand-muted text-sm uppercase tracking-widest font-semibold">Community Director</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
