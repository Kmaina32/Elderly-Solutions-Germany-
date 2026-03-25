import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Shield, Calendar, Settings, Bell, Lock, LogOut, Camera, ChevronRight, CheckCircle, Eye, EyeOff, Volume2, Globe } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Layout } from '../components/Layout';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { cn } from '../utils/cn';

interface ProfileProps {
  user: any;
}

export default function Profile({ user: profile }: ProfileProps) {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { fontSize, setFontSize } = useAccessibility();
  
  const [settings, setSettings] = useState({
    notifications: true,
    twoFactor: false,
    publicProfile: true,
    voiceAssistance: false,
    highContrast: false
  });

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: 'Personal Information',
      items: [
        { icon: User, label: 'Full Name', value: user?.displayName || 'G-Maina' },
        { icon: Mail, label: 'Email Address', value: user?.email || 'GMaina424@gmail.com' },
        { icon: Calendar, label: 'Member Since', value: 'March 2026' },
      ]
    },
    {
      title: 'Security & Privacy',
      items: [
        { icon: Lock, label: 'Password', value: '••••••••' },
        { icon: Shield, label: 'Two-Factor Auth', value: 'Disabled' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', value: 'On' },
        { icon: Settings, label: 'Language', value: 'English (US)' },
      ]
    }
  ];

  return (
    <Layout userRole={profile?.role}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white rounded-[2rem] p-10 shadow-sm border border-stone-100 overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-slate-primary/5" />
          
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-sage-accent/10 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={64} className="text-sage-accent" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-primary hover:bg-stone-50 transition-colors border border-stone-100">
                <Camera size={18} />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-serif font-bold text-slate-primary">
                {profile?.name || user?.displayName || 'G-Maina'}
              </h1>
              <p className="text-stone-400 font-medium">{user?.email || 'GMaina424@gmail.com'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full">Verified Account</span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-full">{profile?.role === 'admin' ? 'Administrator' : 'Premium Member'}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="border-stone-200 text-stone-600 hover:bg-stone-50"
              onClick={() => {}}
            >
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Accessibility Settings (Moved here as requested) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sage-accent/10 flex items-center justify-center text-sage-accent">
                  <Settings size={20} />
                </div>
                <h2 className="text-lg font-serif font-bold text-slate-primary">Visual Accessibility</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Font Size Scaling</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'sm', label: 'Small' },
                    { id: 'base', label: 'Normal' },
                    { id: 'lg', label: 'Large' },
                    { id: 'xl', label: 'Extra' },
                    { id: '2xl', label: 'Max' },
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setFontSize(size.id as any)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-wider",
                        fontSize === size.id 
                          ? "border-sage-accent bg-sage-accent/5 text-slate-primary" 
                          : "border-stone-50 text-stone-400 hover:border-stone-100"
                      )}
                    >
                      <span>{size.label}</span>
                      {fontSize === size.id && <CheckCircle size={14} className="text-sage-accent" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 size={18} className="text-stone-400" />
                    <span className="text-sm font-medium text-slate-primary">Voice Assistance</span>
                  </div>
                  <button 
                    onClick={() => toggleSetting('voiceAssistance')}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      settings.voiceAssistance ? "bg-sage-accent" : "bg-stone-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      settings.voiceAssistance ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Functional Settings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Bell size={20} />
                </div>
                <h2 className="text-lg font-serif font-bold text-slate-primary">Notifications & Privacy</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-primary">Push Notifications</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Alerts for care & community</p>
                  </div>
                  <button 
                    onClick={() => toggleSetting('notifications')}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      settings.notifications ? "bg-sage-accent" : "bg-stone-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      settings.notifications ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-primary">Public Profile</p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider">Visible to community members</p>
                  </div>
                  <button 
                    onClick={() => toggleSetting('publicProfile')}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative",
                      settings.publicProfile ? "bg-sage-accent" : "bg-stone-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      settings.publicProfile ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Personal Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 space-y-6"
            >
              <h2 className="text-lg font-serif font-bold text-slate-primary">Personal Information</h2>
              <div className="space-y-4">
                {[
                  { icon: User, label: 'Full Name', value: profile?.name || user?.displayName || 'G-Maina' },
                  { icon: Mail, label: 'Email Address', value: user?.email || 'GMaina424@gmail.com' },
                  { icon: Globe, label: 'Language', value: 'English (US)' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.label}</p>
                        <p className="text-slate-primary font-medium">{item.value}</p>
                      </div>
                    </div>
                    <button className="text-stone-300 hover:text-slate-primary transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-primary rounded-[2rem] p-8 text-white space-y-6"
            >
              <h3 className="text-xl font-serif font-bold">Care Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-linen-bg/60 text-sm">Active Services</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-linen-bg/60 text-sm">Next Appointment</span>
                  <span className="font-bold">Tomorrow</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-linen-bg/60 text-sm">Community Posts</span>
                  <span className="font-bold">12</span>
                </div>
              </div>
              <Button className="w-full bg-white text-slate-primary hover:bg-linen-bg">
                View Care Plan
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-8 border border-stone-100 space-y-6"
            >
              <h3 className="text-lg font-serif font-bold text-slate-primary">Account Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-stone-50 text-slate-primary hover:bg-stone-100 transition-colors">
                  <span className="text-sm font-bold">Download Data</span>
                  <ChevronRight size={18} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-terracotta/5 text-terracotta hover:bg-terracotta/10 transition-colors"
                >
                  <span className="text-sm font-bold">Logout</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
