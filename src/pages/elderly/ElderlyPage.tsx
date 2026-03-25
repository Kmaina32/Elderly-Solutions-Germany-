import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Phone, Users, ShoppingBag, Calendar, AlertCircle, MessageSquare, ArrowRight, Heart, Activity, Pill, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { auth } from '../../firebase';

export function ElderlyHome({ user }: { user: any }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'meds' | 'circle'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'health', label: 'Health Logs', icon: Heart },
    { id: 'meds', label: 'Medications', icon: Pill },
    { id: 'circle', label: 'Care Circle', icon: Users },
  ];

  return (
    <Layout userRole={user?.role}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Navigation & Quick Actions */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-primary text-white flex items-center justify-center shadow-lg shadow-slate-primary/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-primary">Care Portal</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Secure & Private</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left",
                    activeTab === tab.id 
                      ? "bg-stone-50 text-terracotta shadow-sm" 
                      : "text-stone-400 hover:bg-stone-50/50 hover:text-slate-primary"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                    activeTab === tab.id ? "bg-white text-terracotta shadow-sm" : "bg-stone-50 text-stone-400 group-hover:bg-white"
                  )}>
                    <tab.icon size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-pill-elderly" className="ml-auto shrink-0">
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </nav>
          </section>

          <section className="p-6 rounded-3xl bg-slate-primary text-white space-y-4 shadow-xl shadow-slate-primary/20">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl leading-tight">Emergency Support</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Need immediate help? Our care team is available 24/7.
              </p>
            </div>
            <Button 
              variant="danger"
              className="w-full bg-white/10 hover:bg-white/20 border-none text-white text-xs uppercase tracking-widest font-bold py-4"
              onClick={() => navigate('/help')}
            >
              Request Help Now
            </Button>
          </section>

          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-2">Quick Access</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => navigate('/social')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-slate-primary transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-slate-primary">
                  <Users size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Community Events</span>
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-slate-primary transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-slate-primary">
                  <ShoppingBag size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Book Services</span>
              </button>
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-terracotta mb-2 block">
                    Daily Overview
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-primary leading-tight mb-4">
                    Good morning, {user?.name?.split(' ')[0] || 'Friend'}.
                  </h2>
                  <p className="text-lg text-stone-500 font-sans leading-relaxed max-w-2xl">
                    Your schedule is clear for the next few hours. Here are your recommended actions for a balanced day.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 space-y-4 border-2 border-transparent hover:border-terracotta/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-terracotta/5 text-terracotta flex items-center justify-center">
                        <Activity size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Health Status</span>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-primary">Vitals Check</h3>
                      <p className="text-sm text-stone-500 mt-1">Record your blood pressure and mood for today.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-stone-100 hover:border-terracotta hover:text-terracotta"
                      onClick={() => setActiveTab('health')}
                    >
                      Log Vitals
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-4 border-2 border-transparent hover:border-sage-accent/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-sage-accent/5 text-sage-accent flex items-center justify-center">
                        <Pill size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Medications</span>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-primary">Morning Dose</h3>
                      <p className="text-sm text-stone-500 mt-1">You have 2 medications scheduled for this morning.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-stone-100 hover:border-sage-accent hover:text-sage-accent"
                      onClick={() => setActiveTab('meds')}
                    >
                      View Schedule
                    </Button>
                  </Card>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Recent Activity</h3>
                    <Button variant="ghost" size="sm" className="text-stone-400 text-xs">View Full History</Button>
                  </div>
                  <div className="bg-white rounded-3xl border border-stone-100 p-2 space-y-1">
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Activity size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-primary">Vitals Recorded</p>
                        <p className="text-xs text-stone-400">Blood pressure: 120/80 mmHg</p>
                      </div>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">2h ago</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-terracotta/5 text-terracotta flex items-center justify-center">
                        <Pill size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-primary">Medication Taken</p>
                        <p className="text-xs text-stone-400">Lisinopril 10mg</p>
                      </div>
                      <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">4h ago</span>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'health' && (
              <motion.div
                key="health"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Health & Vitals</h2>
                  <p className="text-stone-500">Track your daily wellness and share with your care team.</p>
                </section>
                <Card className="p-8">
                  <HealthLogger elderlyId={auth.currentUser?.uid || ''} />
                </Card>
              </motion.div>
            )}

            {activeTab === 'meds' && (
              <motion.div
                key="meds"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Medications</h2>
                  <p className="text-stone-500">Your active prescriptions and reminders.</p>
                </section>
                <MedicationTracker elderlyId={auth.currentUser?.uid || ''} />
              </motion.div>
            )}

            {activeTab === 'circle' && (
              <motion.div
                key="circle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Care Circle</h2>
                  <p className="text-stone-500">The team of professionals and caregivers supporting you.</p>
                </section>
                <CareCircleMembers elderlyId={auth.currentUser?.uid || ''} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
