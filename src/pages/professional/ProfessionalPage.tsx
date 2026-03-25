import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ShieldCheck, Users, Activity, Calendar, AlertCircle, MessageSquare, ArrowRight, ClipboardList, Stethoscope, Search, Pill, UserPlus, ChevronRight, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { CareCircleManager } from '../../components/CareCircleManager';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';

export function ProfessionalHome({ user }: { user: any }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'clinical' | 'meds' | 'connect'>('dashboard');
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
    setActiveTab('clinical');
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patient List', icon: Users },
    { id: 'clinical', label: 'Clinical Logs', icon: Stethoscope },
    { id: 'meds', label: 'Medications', icon: Pill },
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
                  onClick={() => setActiveTab(tab.id as any)}
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
                onClick={() => navigate('/ai-assistant?mode=empathy')}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-emerald-600 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-emerald-600">
                  <Activity size={16} />
                </div>
                <span className="text-xs font-bold text-slate-primary">Empathy Lab</span>
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
                className="space-y-8"
              >
                <section>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2 block">
                    Professional Dashboard
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-primary leading-tight mb-4">
                    Welcome, Dr. {user?.name?.split(' ')[0] || 'Professional'}.
                  </h2>
                  <p className="text-lg text-stone-500 font-sans leading-relaxed max-w-2xl">
                    You have <span className="text-slate-primary font-bold">{patients.length} patients</span> under your care today. Here is your clinical overview.
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {activeTab === 'clinical' && selectedPatient && (
              <motion.div
                key="clinical"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Clinical Logs</h2>
                  <p className="text-stone-500">Reviewing health data for {selectedPatient.name}.</p>
                </section>
                <Card className="p-8">
                  <HealthLogger elderlyId={selectedPatientId || ''} />
                </Card>
              </motion.div>
            )}

            {activeTab === 'meds' && selectedPatient && (
              <motion.div
                key="meds"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <section>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary mb-2">Medication Regimen</h2>
                  <p className="text-stone-500">Active prescriptions and adherence for {selectedPatient.name}.</p>
                </section>
                <MedicationTracker elderlyId={selectedPatientId || ''} />
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
