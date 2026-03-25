import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '../components/Button';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Content */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-10 lg:py-16 bg-white z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-sm w-full mx-auto lg:mx-0"
        >
          <div className="mb-8">
            <h2 className="text-xl font-serif font-black text-brand-primary flex items-center gap-2">
              <span className="w-7 h-7 bg-brand-accent rounded-lg flex items-center justify-center text-white text-base italic">E</span>
              ElderlyCare
            </h2>
            <p className="text-brand-muted text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Solutions for a dignified life</p>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-4">
              Welcome <br />
              <span className="text-brand-accent italic">Back.</span>
            </h1>
            <p className="text-sm text-brand-muted leading-relaxed">
              Log in to access your personalized care dashboard and manage health services.
            </p>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-brand-bg border-2 border-transparent focus:border-brand-accent rounded-xl text-sm transition-all outline-hidden"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-brand-bg border-2 border-transparent focus:border-brand-accent rounded-xl text-sm transition-all outline-hidden"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={16} />
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-brand-muted">Or continue with</span>
            </div>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-brand-primary text-sm font-bold border-2 border-brand-border rounded-xl hover:border-brand-primary hover:bg-brand-bg transition-all active:scale-[0.98] shadow-xs"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <div className="pt-6 border-t border-brand-border">
              <p className="text-brand-muted text-xs">
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
          className="absolute bottom-12 left-12 right-12 glass-card p-8 rounded-2xl"
        >
          <div className="flex gap-1 mb-4">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-4 h-4 text-brand-accent fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-xl font-serif italic text-brand-primary leading-snug mb-6">
            "The care my mother receives through this platform is exceptional. It's not just technology; it's a bridge to a better life."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-accent/20 border-2 border-brand-accent overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=elena" alt="Dr. Elena" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-brand-primary text-base">Dr. Elena Sorenson</p>
              <p className="text-brand-muted text-[10px] uppercase tracking-widest font-semibold">Chief Medical Officer</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
