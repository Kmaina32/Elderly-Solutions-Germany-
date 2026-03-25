import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Heart, Users, Activity, Calendar, AlertCircle, MessageSquare, ArrowRight, ClipboardList, ShieldCheck, Pill, Search, ChevronRight, UserPlus, UserCircle, Brain, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { CareCircleManager } from '../../components/CareCircleManager';
import { auth, db } from '../../firebase';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

export function CaregiverHome({ user }: { user: any }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'care-plan' | 'knowledge' | 'connect'>(
    (tabParam as any) || 'dashboard'
  );

  useEffect(() => {
    if (tabParam && ['dashboard', 'care-plan', 'knowledge', 'connect'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    setSearchParams({ tab });
  };
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Query care circles where the current user is a caregiver
    const q = query(
      collection(db, 'care_circles'),
      where('caregiverIds', 'array-contains', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const patientPromises = snapshot.docs.map(async (circleDoc) => {
        const elderlyId = circleDoc.data().elderlyId;
        const elderlyDoc = await getDoc(doc(db, 'users', elderlyId));
        if (elderlyDoc.exists()) {
          return { id: elderlyId, ...elderlyDoc.data() };
        }
        return null;
      });

      const resolvedPatients = (await Promise.all(patientPromises)).filter(p => p !== null);
      setPatients(resolvedPatients);
      
      // Auto-select first patient if none selected
      if (resolvedPatients.length > 0 && !selectedPatientId) {
        setSelectedPatientId(resolvedPatients[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      const p = patients.find(p => p.id === selectedPatientId);
      setSelectedPatient(p || null);
    } else {
      setSelectedPatient(null);
    }
  }, [selectedPatientId, patients]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'care-plan', label: 'Care Plan', icon: ClipboardList },
    { id: 'knowledge', label: 'Knowledge Hub', icon: Search },
    { id: 'connect', label: 'Connect Patient', icon: UserPlus },
  ];

  return (
    <Layout userRole={user?.role}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-primary">Caregiver Hub</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Management Portal</p>
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left",
                    activeTab === tab.id 
                      ? "bg-stone-50 text-blue-600 shadow-sm" 
                      : "text-stone-400 hover:bg-stone-50/50 hover:text-slate-primary"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                    activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "bg-stone-50 text-stone-400 group-hover:bg-white"
                  )}>
                    <tab.icon size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-pill-caregiver" className="ml-auto shrink-0">
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </nav>
          </section>

          {/* Patient Selector */}
          {patients.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-2">My Patients</h3>
              <div className="space-y-2">
                {patients.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border",
                      selectedPatientId === p.id
                        ? "bg-white border-blue-600 shadow-sm"
                        : "bg-stone-50 border-transparent hover:border-stone-200"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white",
                      selectedPatientId === p.id ? "bg-blue-600" : "bg-stone-300"
                    )}>
                      <UserCircle size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs font-bold truncate",
                        selectedPatientId === p.id ? "text-slate-primary" : "text-stone-500"
                      )}>{p.name}</p>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest">Elderly</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {selectedPatient && (
            <section className="p-6 rounded-3xl bg-stone-50 border border-stone-100 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Selected Patient</p>
                  <h3 className="font-serif font-bold text-slate-primary">{selectedPatient.name}</h3>
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full border-stone-200 text-xs"
                onClick={() => navigate('/social')}
              >
                Message Circle
              </Button>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-2">Resources</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => navigate('/ai-assistant?mode=knowledge')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-blue-600 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-blue-600">
                  <Search size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Knowledge Hub</span>
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-blue-600 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-blue-600">
                  <ClipboardList size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Care Services</span>
              </button>
            </div>
          </section>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <section>
                  <h2 className="text-2xl lg:text-3xl font-serif font-bold text-slate-primary leading-tight">
                    Hello, {user?.name?.split(' ')[0] || 'Caregiver'}.
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    {selectedPatient 
                      ? `Managing care for ${selectedPatient.name}.`
                      : "Connect with a patient to start managing care."}
                  </p>
                </section>

                {/* Mobile Resource Buttons - Side by Side */}
                <div className="lg:hidden grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate('/ai-assistant?mode=knowledge')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Search size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-primary">Knowledge</span>
                  </button>
                  <button 
                    onClick={() => navigate('/services')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <ClipboardList size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-primary">Services</span>
                  </button>
                </div>

                {selectedPatient ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-6 space-y-4 border-2 border-transparent hover:border-blue-600/20 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Activity size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Health Logs</span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl text-slate-primary">Recent Vitals</h3>
                        <p className="text-sm text-stone-500 mt-1">Review or record health data for {selectedPatient.name}.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-stone-100 hover:border-blue-600 hover:text-blue-600"
                        onClick={() => setActiveTab('care-plan')}
                      >
                        Manage Logs
                      </Button>
                    </Card>

                    <Card className="p-6 space-y-4 border-2 border-transparent hover:border-terracotta/20 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-terracotta/5 text-terracotta flex items-center justify-center">
                          <Pill size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Medications</span>
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-xl text-slate-primary">Adherence</h3>
                        <p className="text-sm text-stone-500 mt-1">Monitor medication schedule and adherence.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-stone-100 hover:border-terracotta hover:text-terracotta"
                        onClick={() => setActiveTab('care-plan')}
                      >
                        Check Schedule
                      </Button>
                    </Card>
                  </div>
                ) : null}

                {patients.length === 0 && (
                  <Card className="p-12 text-center space-y-6 bg-stone-50 border-2 border-dashed border-stone-200">
                    <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-stone-300 mx-auto shadow-sm">
                      <UserPlus size={40} />
                    </div>
                    <div className="space-y-2 max-w-sm mx-auto">
                      <h3 className="text-2xl font-serif font-bold text-slate-primary">No Patient Connected</h3>
                      <p className="text-sm text-stone-500">
                        To start managing care, you need to connect with an elderly user's profile.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('connect')}
                      className="px-8"
                    >
                      Connect Now
                    </Button>
                  </Card>
                )}
              </motion.div>
            )}

            {activeTab === 'care-plan' && selectedPatient && (
              <motion.div
                key="care-plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Care Plan</h2>
                  <p className="text-stone-500">Comprehensive care management for {selectedPatient.name}.</p>
                </section>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Medications</h3>
                    <MedicationTracker elderlyId={selectedPatientId || ''} />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Recent Vitals</h3>
                    <Card className="p-6">
                      <HealthLogger elderlyId={selectedPatientId || ''} />
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'knowledge' && (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Knowledge Hub</h2>
                  <p className="text-stone-500">Curated resources and AI-powered care insights.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Dementia Care Guide', desc: 'Practical tips for daily care and communication.', icon: Brain },
                    { title: 'Nutrition for Seniors', desc: 'Healthy meal planning and dietary considerations.', icon: Heart },
                    { title: 'Mobility & Safety', desc: 'Preventing falls and creating a safe home environment.', icon: ShieldCheck },
                    { title: 'Emotional Well-being', desc: 'Managing caregiver stress and patient mood.', icon: Activity },
                  ].map((resource) => (
                    <Card key={resource.title} className="p-6 hover:shadow-lg transition-all border-stone-100 group cursor-pointer">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/5 text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <resource.icon size={24} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-primary">{resource.title}</h3>
                          <p className="text-xs text-stone-500 leading-relaxed">{resource.desc}</p>
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-brand-primary hover:bg-transparent mt-2">
                            Read Article →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 bg-brand-primary text-white overflow-hidden relative">
                  <div className="relative z-10 space-y-4 max-w-lg">
                    <h3 className="text-2xl font-serif font-bold">Need specific advice?</h3>
                    <p className="text-white/80 text-sm">
                      Our AI Care Companion can help you find answers to specific caregiving questions instantly.
                    </p>
                    <Button 
                      variant="outline" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => {
                        // This will trigger the floating assistant if we had a way to communicate, 
                        // for now let's just show a message or redirect
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                    >
                      Ask AI Companion
                    </Button>
                  </div>
                  <Bot size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
                </Card>
              </motion.div>
            )}

            {activeTab === 'connect' && (
              <motion.div
                key="connect"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Connect Patient</h2>
                  <p className="text-stone-500">Link your account to an elderly user to manage their care.</p>
                </section>
                <Card className="p-8">
                  <CareCircleManager userRole="caregiver" />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
