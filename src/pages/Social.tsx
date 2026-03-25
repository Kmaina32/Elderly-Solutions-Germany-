import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Users, MessageSquare, Calendar, Plus, UserPlus, MapPin, Clock } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';

export function Social({ user }: { user: any }) {
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'chat'>('events');

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('startTime', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const isProfessional = user?.role === 'professional';

  return (
    <Layout userRole={user?.role}>
      <div className="space-y-24">
        <header className="max-w-3xl">
          <span className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-sage-accent mb-6 block">
            {isProfessional ? 'Clinical Network' : 'Community Hub'}
          </span>
          <h2 className="text-4xl font-serif font-bold text-slate-primary leading-tight mb-8">
            {isProfessional ? 'Patient Care & Coordination' : 'Connection is the cornerstone of health.'}
          </h2>
          <p className="text-xl text-stone-500 font-sans leading-relaxed">
            {isProfessional 
              ? 'Manage your patient list, review clinical alerts, and communicate with care teams.' 
              : 'Engage with local activities or reach out to your dedicated care network.'}
          </p>
        </header>

        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('events')}
            className={cn(
              'px-8 py-4 text-lg font-serif font-bold transition-all border-b-4 -mb-1',
              activeTab === 'events' ? 'border-sage-accent text-slate-primary' : 'border-transparent text-stone-400'
            )}
          >
            {isProfessional ? 'Patient Directory' : 'Local Activities'}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'px-8 py-4 text-lg font-serif font-bold transition-all border-b-4 -mb-1',
              activeTab === 'chat' ? 'border-sage-accent text-slate-primary' : 'border-transparent text-stone-400'
            )}
          >
            Secure Messaging
          </button>
        </div>

        {activeTab === 'events' ? (
          <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-slate-primary">
                  {isProfessional ? 'Active Patients' : 'Upcoming Gatherings'}
                </h3>
                <p className="text-lg text-stone-500">
                  {isProfessional 
                    ? 'Patients currently assigned to your clinical care team.' 
                    : 'Curated events designed for social engagement and physical wellness.'}
                </p>
              </div>
              {isProfessional ? (
                <Button variant="secondary" size="md" className="flex items-center gap-3">
                  <UserPlus size={20} />
                  <span>Add Patient</span>
                </Button>
              ) : (
                <Button variant="secondary" size="md" className="flex items-center gap-3">
                  <Plus size={20} />
                  <span>Propose Event</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {isProfessional ? (
                // Professional Patient List
                [
                  { name: 'Margaret Thompson', id: 'MT-001', status: 'Stable', lastVisit: '2 days ago' },
                  { name: 'Robert Wilson', id: 'RW-002', status: 'Monitoring', lastVisit: 'Today' },
                  { name: 'Alice Gardner', id: 'AG-003', status: 'Critical', lastVisit: '1 week ago' },
                ].map((patient) => (
                  <Card
                    key={patient.id}
                    title={patient.name}
                    description={`Patient ID: ${patient.id}`}
                    className="flex flex-col h-full"
                  >
                    <div className="mt-auto pt-8 space-y-6 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                          patient.status === 'Stable' ? "bg-emerald-50 text-emerald-600" :
                          patient.status === 'Critical' ? "bg-terracotta/10 text-terracotta" : "bg-orange-50 text-orange-600"
                        )}>
                          {patient.status}
                        </span>
                        <span className="text-sm text-stone-400 font-sans italic">Last visit: {patient.lastVisit}</span>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="secondary" size="md" className="flex-1">View Records</Button>
                        <Button variant="accent" size="md" className="flex-1">Schedule Visit</Button>
                      </div>
                    </div>
                  </Card>
                )
              )) : (
                // Elderly Event List
                events.length > 0 ? (
                  events.map((event) => (
                    <Card
                      key={event.id}
                      title={event.title}
                      description={event.description}
                      className="flex flex-col h-full"
                    >
                      <div className="mt-auto pt-8 space-y-6 border-t border-stone-100">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3 text-stone-500">
                            <MapPin size={20} className="text-sage-accent" />
                            <span className="text-lg font-medium">{event.location || 'Local Community Center'}</span>
                          </div>
                          <div className="flex items-center gap-3 text-stone-500">
                            <Clock size={20} className="text-sage-accent" />
                            <span className="text-lg font-medium">Today at 2:00 PM</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200" />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-linen-bg flex items-center justify-center text-xs font-bold text-stone-500">
                              +12
                            </div>
                          </div>
                          <Button variant="accent" size="md">Register Interest</Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-32 text-center bg-white border border-stone-200 rounded-xl">
                    <Users size={64} className="mx-auto text-stone-200 mb-8" />
                    <p className="text-2xl font-serif text-stone-400">No events are currently scheduled in your area.</p>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-4xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif font-bold text-slate-primary">Active Conversations</h3>
              <Button variant="secondary" size="md" className="flex items-center gap-3">
                <UserPlus size={20} />
                <span>New Message</span>
              </Button>
            </div>

            <div className="space-y-6">
              <Card
                title="Clinical Support Team"
                description="Our nurses are available for any health-related inquiries."
                className="border-l-8 border-l-sage-accent cursor-pointer hover:bg-stone-50"
              >
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-sage-accent">Online Now</span>
                  <Button variant="ghost" className="font-bold">Open Secure Chat</Button>
                </div>
              </Card>

              <Card
                title="Family Circle: The Thompsons"
                description="Recent update from Sarah regarding the weekend visit."
                className="cursor-pointer hover:bg-stone-50"
              >
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-widest text-stone-400">2 hours ago</span>
                  <Button variant="ghost" className="font-bold">View Thread</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

