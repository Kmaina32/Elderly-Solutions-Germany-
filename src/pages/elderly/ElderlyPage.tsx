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
        className="space-y-6 lg:space-y-8"
      >
        {/* Welcome Section */}
        <section className="max-w-xl">
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-brand-accent mb-1.5 block">
            Daily Overview
          </span>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary leading-tight mb-3">
            Good morning, {user?.name?.split(' ')[0] || 'Friend'}.
          </h2>
          <p className="text-sm text-stone-500 font-sans leading-relaxed">
            Your schedule is clear for the next few hours. Here are your recommended actions for a balanced day.
          </p>
        </section>

        {/* Primary Action: Assistance */}
        <section>
          <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex-1 space-y-0.5">
              <h3 className="text-base font-serif font-bold text-brand-primary">Immediate Assistance</h3>
              <p className="text-xs text-stone-500 max-w-lg">
                If you are feeling unwell or need urgent help, our care team is available 24/7.
              </p>
            </div>
            <Button 
              variant="danger" 
              size="sm" 
              className="w-full lg:w-auto px-5 py-2 text-xs"
              onClick={() => navigate('/help')}
            >
              Request Help
            </Button>
          </div>
        </section>

        {/* Health & Care Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-brand-primary">Health & Vitals</h3>
                  <p className="text-[10px] text-stone-500 mt-0.5">Track your daily wellness and share with your care team.</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-brand-accent font-bold uppercase tracking-widest text-[7px] border border-brand-accent/20 px-1.5 py-0.5 rounded-full">
                  <Activity size={9} />
                  <span>Real-time Sync</span>
                </div>
              </div>
              <Card className="p-3 lg:p-4">
                <HealthLogger elderlyId={auth.currentUser?.uid || ''} />
              </Card>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-serif font-bold text-brand-primary">Medications</h3>
                  <p className="text-[10px] text-stone-500 mt-0.5">Your active prescriptions and reminders.</p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-red-600 font-bold uppercase tracking-widest text-[7px] border border-red-100 px-1.5 py-0.5 rounded-full">
                  <Pill size={9} />
                  <span>Next dose in 2h</span>
                </div>
              </div>
              <MedicationTracker elderlyId={auth.currentUser?.uid || ''} />
            </section>
          </div>

          <div className="space-y-6 lg:space-y-8">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-serif font-bold text-brand-primary">Care Circle</h3>
                <div className="hidden sm:flex items-center gap-1.5 text-blue-600 font-bold uppercase tracking-widest text-[7px] border border-blue-100 px-1.5 py-0.5 rounded-full">
                  <Users size={9} />
                  <span>Active Team</span>
                </div>
              </div>
              <CareCircleMembers elderlyId={auth.currentUser?.uid || ''} />
            </section>

            <section className="space-y-2.5">
              <h3 className="text-lg font-serif font-bold text-brand-primary">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-2">
                <Card 
                  title="Community" 
                  description="Connect with local groups."
                  icon={<Users size={16} />}
                  className="p-3 hover:border-brand-accent cursor-pointer"
                  onClick={() => navigate('/social')}
                />
                <Card 
                  title="Services" 
                  description="Book medical transport."
                  icon={<ShoppingBag size={16} />}
                  className="p-3 hover:border-brand-accent cursor-pointer"
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
