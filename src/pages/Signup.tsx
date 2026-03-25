import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleManualSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: 'elderly', // Default role
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
            <p className="text-brand-muted text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Join our global community</p>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-brand-primary leading-tight mb-4">
              Start Your <br />
              <span className="text-brand-accent italic">Journey.</span>
            </h1>
            <p className="text-sm text-brand-muted leading-relaxed">
              Create an account to connect with verified caregivers and track health vitals.
            </p>
          </div>

          <form onSubmit={handleManualSignup} className="space-y-4 mb-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-brand-muted ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-brand-bg border-2 border-transparent focus:border-brand-accent rounded-xl text-sm transition-all outline-hidden"
                  placeholder="John Doe"
                />
              </div>
            </div>
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
              {loading ? 'Creating Account...' : 'Create Account'}
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
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl hover:bg-brand-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.8"/>
              </svg>
              <span>Google</span>
            </button>

            <div className="pt-6 border-t border-brand-border">
              <p className="text-brand-muted text-xs">
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
          className="absolute bottom-12 left-12 right-12 glass-card p-8 rounded-2xl"
        >
          <p className="text-xl font-serif italic text-brand-primary leading-snug mb-6">
            "Belonging is a fundamental human need. We build the bridges that bring us together, ensuring no one walks alone."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary/20 border-2 border-brand-primary overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=sarah" alt="Sarah" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-brand-primary text-base">Sarah Jenkins</p>
              <p className="text-brand-muted text-[10px] uppercase tracking-widest font-semibold">Community Director</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
