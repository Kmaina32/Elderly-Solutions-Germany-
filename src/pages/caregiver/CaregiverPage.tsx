import React from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Heart, Users, Activity, Calendar, AlertCircle, MessageSquare, ArrowRight, ClipboardList, ShieldCheck, Pill } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function CaregiverHome({ user }: { user: any }) {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const targetElderlyId = user?.targetElderlyId;

  useEffect(() => {
    if (targetElderlyId) {
      getDoc(doc(db, 'users', targetElderlyId)).then(doc => {
        if (doc.exists()) setPatient(doc.data());
      });
    }
  }, [targetElderlyId]);

  return (
    <Layout userRole={user?.role}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-24"
      >
        {/* Welcome Section */}
        <section className="max-w-3xl">
          <span className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-blue-600 mb-6 block">
            Caregiver Dashboard
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-primary leading-[1.1] mb-8">
            Hello, {user?.name?.split(' ')[0] || 'Caregiver'}.
          </h2>
          <p className="text-xl text-stone-500 font-sans leading-relaxed">
            You are managing care for <span className="text-slate-primary font-bold">{patient?.name || 'your patient'}</span>. Here is the latest status and pending tasks.
          </p>
        </section>

        {/* Health & Care Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-primary">Patient Health Logs</h3>
                  <p className="text-stone-500 mt-1">Record vitals or mood on behalf of {patient?.name?.split(' ')[0] || 'patient'}.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] border border-blue-200 px-3 py-1 rounded-full">
                  <Activity size={12} />
                  <span>Caregiver Access</span>
                </div>
              </div>
              <Card className="p-8">
                <HealthLogger elderlyId={targetElderlyId || ''} />
              </Card>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-primary">Medication Status</h3>
                  <p className="text-stone-500 mt-1">Monitor adherence and confirm doses.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-terracotta font-bold uppercase tracking-widest text-[10px] border border-terracotta/20 px-3 py-1 rounded-full">
                  <Pill size={12} />
                  <span>Next dose in 2h</span>
                </div>
              </div>
              <MedicationTracker elderlyId={targetElderlyId || ''} />
            </section>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-serif font-bold text-slate-primary">Care Team</h3>
                <div className="hidden sm:flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] border border-blue-200 px-3 py-1 rounded-full">
                  <Users size={12} />
                  <span>Coordinated Care</span>
                </div>
              </div>
              <CareCircleMembers elderlyId={targetElderlyId || ''} />
            </section>

            <section className="space-y-6">
              <h3 className="text-3xl font-serif font-bold text-slate-primary">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <Card 
                  title="Messages" 
                  description="Chat with the care team."
                  icon={<MessageSquare size={24} />}
                  className="p-6 hover:border-blue-600 cursor-pointer"
                  onClick={() => navigate('/social')}
                />
                <Card 
                  title="Care Plan" 
                  description="Update daily routines."
                  icon={<ClipboardList size={24} />}
                  className="p-6 hover:border-blue-600 cursor-pointer"
                  onClick={() => navigate('/services')}
                />
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
