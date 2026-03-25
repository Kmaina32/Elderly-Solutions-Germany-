import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ShieldCheck, Users, Activity, Calendar, AlertCircle, MessageSquare, ArrowRight, ClipboardList, Stethoscope, Search, Pill, UserPlus, ChevronRight, UserCircle, Heart, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { CareCircleManager } from '../../components/CareCircleManager';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

export function ProfessionalHome({ user }: { user: any }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'clinical-plan' | 'knowledge' | 'empathy' | 'connect'>(
    (tabParam as any) || 'dashboard'
  );

  useEffect(() => {
    if (tabParam && ['dashboard', 'patients', 'clinical-plan', 'knowledge', 'empathy', 'connect'].includes(tabParam)) {
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

    // Query care circles where the current user is a professional
    const q = query(
      collection(db, 'care_circles'),
      where('professionalIds', 'array-contains', auth.currentUser.uid)
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

  const handlePatientSelect = (patient: any) => {
    setSelectedPatientId(patient.id);
    setActiveTab('clinical-plan');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patient List', icon: Users },
    { id: 'clinical-plan', label: 'Clinical Plan', icon: ClipboardList },
    { id: 'knowledge', label: 'Clinical Hub', icon: Search },
    { id: 'empathy', label: 'Empathy Lab', icon: Heart },
    { id: 'connect', label: 'Add Patient', icon: UserPlus },
  ];

  return (
    <Layout userRole={user?.role}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-primary">Clinical Portal</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Professional Access</p>
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
                      ? "bg-stone-50 text-emerald-600 shadow-sm" 
                      : "text-stone-400 hover:bg-stone-50/50 hover:text-slate-primary"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                    activeTab === tab.id ? "bg-white text-emerald-600 shadow-sm" : "bg-stone-50 text-stone-400 group-hover:bg-white"
                  )}>
                    <tab.icon size={18} />
                  </div>
                  <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-pill-professional" className="ml-auto shrink-0">
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
                        ? "bg-white border-emerald-600 shadow-sm"
                        : "bg-stone-50 border-transparent hover:border-stone-200"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white",
                      selectedPatientId === p.id ? "bg-emerald-600" : "bg-stone-300"
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
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1 border-stone-200 text-[10px] py-2"
                  onClick={() => navigate('/social')}
                >
                  Message
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 border-stone-200 text-[10px] py-2"
                  onClick={() => setActiveTab('patients')}
                >
                  Switch
                </Button>
              </div>
            </section>
          )}

          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 px-2">Clinical Tools</h3>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => navigate('/services')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-emerald-600 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600">
                  <Calendar size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Consultations</span>
              </button>
              <button 
                onClick={() => setActiveTab('empathy')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-emerald-600 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600">
                  <Heart size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Empathy Lab</span>
              </button>
              <button 
                onClick={() => setActiveTab('knowledge')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-emerald-600 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600">
                  <Search size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Clinical Hub</span>
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
                    Welcome, Dr. {user?.name?.split(' ')[0] || 'Professional'}.
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    You have <span className="text-slate-primary font-bold">{patients.length} patients</span> under your care.
                  </p>
                </section>

                {/* Mobile Clinical Tools - Side by Side */}
                <div className="lg:hidden grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => navigate('/services')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Calendar size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-primary">Consults</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('empathy')}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Heart size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-primary">Empathy Lab</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-6 space-y-4 border-2 border-transparent hover:border-emerald-600/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Users size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Patient Management</span>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-primary">Active Caseload</h3>
                      <p className="text-sm text-stone-500 mt-1">Review and manage your list of active patients.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-stone-100 hover:border-emerald-600 hover:text-emerald-600"
                      onClick={() => setActiveTab('patients')}
                    >
                      View Patient List
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-4 border-2 border-transparent hover:border-blue-600/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Communication</span>
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-primary">Secure Messaging</h3>
                      <p className="text-sm text-stone-500 mt-1">Coordinate with caregivers and patients.</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-stone-100 hover:border-blue-600 hover:text-blue-600"
                      onClick={() => navigate('/social')}
                    >
                      Open Messages
                    </Button>
                  </Card>
                </div>

                {patients.length > 0 && (
                  <section className="space-y-4">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Recent Patient Activity</h3>
                    <div className="bg-white rounded-3xl border border-stone-100 p-2 space-y-1">
                      {patients.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-stone-50 transition-colors cursor-pointer" onClick={() => handlePatientSelect(p)}>
                          <div className="w-10 h-10 rounded-xl bg-stone-50 text-stone-400 flex items-center justify-center">
                            <Users size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-primary">{p.name}</p>
                            <p className="text-xs text-stone-400">Last log: 2 hours ago</p>
                          </div>
                          <ChevronRight size={16} className="text-stone-300" />
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeTab === 'patients' && (
              <motion.div
                key="patients"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Patient List</h2>
                  <p className="text-stone-500">Manage and select patients for clinical review.</p>
                </section>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patients.map((p) => (
                    <Card 
                      key={p.id} 
                      className={cn(
                        "p-6 cursor-pointer border-2 transition-all",
                        selectedPatientId === p.id ? "border-emerald-600 bg-emerald-50/50" : "border-stone-100 hover:border-stone-200"
                      )}
                      onClick={() => handlePatientSelect(p)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-stone-400 shadow-sm">
                          <Users size={24} />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-primary">{p.name}</h4>
                          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">{p.role}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {patients.length === 0 && (
                    <div className="col-span-full p-12 text-center text-stone-400 italic bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
                      No patients linked to your profile yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'clinical-plan' && selectedPatient && (
              <motion.div
                key="clinical-plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Clinical Plan</h2>
                  <p className="text-stone-500">Comprehensive clinical review for {selectedPatient.name}.</p>
                </section>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Medication Regimen</h3>
                    <MedicationTracker elderlyId={selectedPatientId || ''} />
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-slate-primary">Clinical Logs</h3>
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
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Clinical Hub</h2>
                  <p className="text-stone-500">Advanced medical resources and geriatric care research.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Geriatric Pharmacology', desc: 'Latest research on medication management for the elderly.', icon: Pill },
                    { title: 'Cognitive Assessment', desc: 'Standardized tools and protocols for dementia screening.', icon: Brain },
                    { title: 'Palliative Care Protocols', desc: 'Best practices for end-of-life care and comfort.', icon: Heart },
                    { title: 'Telehealth Best Practices', desc: 'Optimizing remote consultations for senior patients.', icon: Activity },
                  ].map((resource) => (
                    <Card key={resource.title} className="p-6 hover:shadow-lg transition-all border-stone-100 group cursor-pointer">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <resource.icon size={24} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-primary">{resource.title}</h3>
                          <p className="text-xs text-stone-500 leading-relaxed">{resource.desc}</p>
                          <Button variant="ghost" size="sm" className="p-0 h-auto text-emerald-600 hover:bg-transparent mt-2">
                            Access Resource →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'empathy' && (
              <motion.div
                key="empathy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Empathy Lab</h2>
                  <p className="text-stone-500">Refine your communication skills with AI-powered empathy analysis.</p>
                </section>

                <Card className="p-8 bg-white border-stone-100 shadow-sm space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm text-stone-600 leading-relaxed">
                      The Empathy Lab helps you practice responding to sensitive patient or caregiver concerns. 
                      Use the floating AI assistant in the bottom right to access the full Empathy Lab analysis tool.
                    </p>
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100 italic text-stone-500 text-sm">
                      "Doctor, I'm worried that my father isn't eating enough, but he gets angry when I bring it up."
                    </div>
                    <Button 
                      onClick={() => {
                        // In a real app, we'd trigger the floating assistant's empathy mode
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Open Empathy Lab in Assistant
                    </Button>
                  </div>
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
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Add New Patient</h2>
                  <p className="text-stone-500">Search for a patient to add them to your clinical caseload.</p>
                </section>
                <Card className="p-8">
                  <CareCircleManager userRole="professional" />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}
