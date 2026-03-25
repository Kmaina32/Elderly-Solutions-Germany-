import React from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ShieldCheck, Users, Activity, Calendar, AlertCircle, MessageSquare, ArrowRight, ClipboardList, Stethoscope, Search, Pill } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function ProfessionalHome({ user }: { user: any }) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, 'care_circles'),
        where('professionalIds', 'array-contains', auth.currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const patientIds = snapshot.docs.map(doc => doc.data().elderlyId);
      
      const patientData = await Promise.all(
        patientIds.map(async (id) => {
          const userDoc = await getDoc(doc(db, 'users', id));
          return userDoc.exists() ? { id, ...userDoc.data() } : null;
        })
      );
      const validPatients = patientData.filter(p => p !== null);
      setPatients(validPatients);
      if (validPatients.length > 0) {
        setSelectedPatientId(validPatients[0].id);
        setSelectedPatient(validPatients[0]);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patient: any) => {
    setSelectedPatientId(patient.id);
    setSelectedPatient(patient);
  };

  return (
    <Layout userRole={user?.role}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-24"
      >
        {/* Welcome Section */}
        <section className="max-w-3xl">
          <span className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-emerald-600 mb-6 block">
            Professional Dashboard
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-primary leading-[1.1] mb-8">
            Welcome, Dr. {user?.name?.split(' ')[0] || 'Professional'}.
          </h2>
          <p className="text-xl text-stone-500 font-sans leading-relaxed">
            You have <span className="text-slate-primary font-bold">{patients.length} patients</span> under your care today. Here is your clinical overview.
          </p>
        </section>

        {/* Patient Selector */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-slate-primary">Active Patients</h3>
            <Button variant="ghost" size="sm" className="text-stone-400">View All</Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePatientSelect(p)}
                className={cn(
                  "flex-shrink-0 flex items-center gap-4 p-4 rounded-2xl border-2 transition-all",
                  selectedPatientId === p.id ? "border-emerald-600 bg-emerald-50/50 shadow-sm" : "border-stone-100 hover:border-stone-200"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <p className="font-serif text-lg text-slate-primary">{p.name}</p>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">{p.role}</p>
                </div>
              </button>
            ))}
            {patients.length === 0 && (
              <div className="w-full p-8 text-center text-stone-400 italic bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
                No patients linked to your profile yet.
              </div>
            )}
          </div>
        </section>

        {selectedPatient && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-slate-primary">Clinical Logs</h3>
                    <p className="text-stone-500 mt-1">Reviewing logs for {selectedPatient.name}.</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-[10px] border border-emerald-200 px-3 py-1 rounded-full">
                    <Activity size={12} />
                    <span>Clinical Review</span>
                  </div>
                </div>
                <Card className="p-8">
                  <HealthLogger elderlyId={selectedPatientId || ''} />
                </Card>
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-slate-primary">Medication Regimen</h3>
                    <p className="text-stone-500 mt-1">Active prescriptions and adherence history.</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-terracotta font-bold uppercase tracking-widest text-[10px] border border-terracotta/20 px-3 py-1 rounded-full">
                    <Pill size={12} />
                    <span>Next dose in 2h</span>
                  </div>
                </div>
                <MedicationTracker elderlyId={selectedPatientId || ''} />
              </section>
            </div>

            <div className="space-y-12">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-serif font-bold text-slate-primary">Care Circle</h3>
                  <div className="hidden sm:flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] border border-blue-200 px-3 py-1 rounded-full">
                    <Users size={12} />
                    <span>Team Overview</span>
                  </div>
                </div>
                <CareCircleMembers elderlyId={selectedPatientId || ''} />
              </section>

              <section className="space-y-6">
                <h3 className="text-3xl font-serif font-bold text-slate-primary">Clinical Tools</h3>
                <div className="grid grid-cols-1 gap-4">
                  <Card 
                    title="Consultations" 
                    description="Schedule a virtual visit."
                    icon={<Calendar size={24} />}
                    className="p-6 hover:border-emerald-600 cursor-pointer"
                    onClick={() => navigate('/services')}
                  />
                  <Card 
                    title="Secure Messaging" 
                    description="Chat with caregivers."
                    icon={<MessageSquare size={24} />}
                    className="p-6 hover:border-emerald-600 cursor-pointer"
                    onClick={() => navigate('/social')}
                  />
                </div>
              </section>
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
