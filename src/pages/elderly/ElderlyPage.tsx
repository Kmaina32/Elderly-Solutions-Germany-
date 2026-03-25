import React from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Phone, Users, ShoppingBag, Calendar, AlertCircle, MessageSquare, ArrowRight, Heart, Activity, Pill } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { HealthLogger } from '../../components/HealthLogger';
import { MedicationTracker } from '../../components/MedicationTracker';
import { CareCircleMembers } from '../../components/CareCircleMembers';
import { auth } from '../../firebase';

export function ElderlyHome({ user }: { user: any }) {
  const navigate = useNavigate();

  return (
    <Layout userRole={user?.role}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-24"
      >
        {/* Welcome Section */}
        <section className="max-w-3xl">
          <span className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-sage-accent mb-6 block">
            Daily Overview
          </span>
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-primary leading-[1.1] mb-8">
            Good morning, {user?.name?.split(' ')[0] || 'Friend'}.
          </h2>
          <p className="text-xl text-stone-500 font-sans leading-relaxed">
            Your schedule is clear for the next few hours. Here are your recommended actions for a balanced day.
          </p>
        </section>

        {/* Primary Action: Assistance */}
        <section>
          <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-serif font-bold text-slate-primary">Immediate Assistance</h3>
              <p className="text-lg text-stone-500 max-w-lg">
                If you are feeling unwell or need urgent help, our care team is available 24/7.
              </p>
            </div>
            <Button 
              variant="danger" 
              size="lg" 
              className="w-full lg:w-auto px-10"
              onClick={() => navigate('/help')}
            >
              Request Help
            </Button>
          </div>
        </section>

        {/* Health & Care Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-primary">Health & Vitals</h3>
                  <p className="text-stone-500 mt-1">Track your daily wellness and share with your care team.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sage-accent font-bold uppercase tracking-widest text-[10px] border border-sage-accent/20 px-3 py-1 rounded-full">
                  <Activity size={12} />
                  <span>Real-time Sync</span>
                </div>
              </div>
              <Card className="p-8">
                <HealthLogger elderlyId={auth.currentUser?.uid || ''} />
              </Card>
            </section>

            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-slate-primary">Medications</h3>
                  <p className="text-stone-500 mt-1">Your active prescriptions and reminders.</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-terracotta font-bold uppercase tracking-widest text-[10px] border border-terracotta/20 px-3 py-1 rounded-full">
                  <Pill size={12} />
                  <span>Next dose in 2h</span>
                </div>
              </div>
              <MedicationTracker elderlyId={auth.currentUser?.uid || ''} />
            </section>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-serif font-bold text-slate-primary">Care Circle</h3>
                <div className="hidden sm:flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-[10px] border border-blue-200 px-3 py-1 rounded-full">
                  <Users size={12} />
                  <span>Active Team</span>
                </div>
              </div>
              <CareCircleMembers elderlyId={auth.currentUser?.uid || ''} />
            </section>

            <section className="space-y-6">
              <h3 className="text-3xl font-serif font-bold text-slate-primary">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <Card 
                  title="Community" 
                  description="Connect with local groups."
                  icon={<Users size={24} />}
                  className="p-6 hover:border-sage-accent cursor-pointer"
                  onClick={() => navigate('/social')}
                />
                <Card 
                  title="Services" 
                  description="Book medical transport."
                  icon={<ShoppingBag size={24} />}
                  className="p-6 hover:border-sage-accent cursor-pointer"
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
