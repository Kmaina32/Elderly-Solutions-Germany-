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
      <div className="space-y-8 lg:space-y-10">
        <header className="max-w-2xl">
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.3em] text-brand-accent mb-3 block">
            {isProfessional ? 'Clinical Network' : 'Community Hub'}
          </span>
          <h2 className="text-xl lg:text-2xl font-serif font-bold text-brand-primary leading-tight mb-4">
            {isProfessional ? 'Patient Care & Coordination' : 'Connection is the cornerstone of health.'}
          </h2>
          <p className="text-sm lg:text-base text-stone-500 font-sans leading-relaxed">
            {isProfessional 
              ? 'Manage your patient list, review clinical alerts, and communicate with care teams.' 
              : 'Engage with local activities or reach out to your dedicated care network.'}
          </p>
        </header>

        <div className="flex border-b border-stone-200 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('events')}
            className={cn(
              'px-5 py-2.5 text-sm font-serif font-bold transition-all border-b-2 -mb-[1px] whitespace-nowrap',
              activeTab === 'events' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-stone-400'
            )}
          >
            {isProfessional ? 'Patient Directory' : 'Local Activities'}
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'px-5 py-2.5 text-sm font-serif font-bold transition-all border-b-2 -mb-[1px] whitespace-nowrap',
              activeTab === 'chat' ? 'border-brand-accent text-brand-primary' : 'border-transparent text-stone-400'
            )}
          >
            Secure Messaging
          </button>
        </div>

        {activeTab === 'events' ? (
          <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-0.5">
                <h3 className="text-lg font-serif font-bold text-brand-primary">
                  {isProfessional ? 'Active Patients' : 'Upcoming Gatherings'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isProfessional 
                    ? 'Patients currently assigned to your clinical care team.' 
                    : 'Curated events designed for social engagement and physical wellness.'}
                </p>
              </div>
              {isProfessional ? (
                <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs">
                  <UserPlus size={14} />
                  <span>Add Patient</span>
                </Button>
              ) : (
                <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs">
                  <Plus size={14} />
                  <span>Propose Event</span>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
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
                    <div className="mt-auto pt-4 space-y-3 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest",
                          patient.status === 'Stable' ? "bg-emerald-50 text-emerald-600" :
                          patient.status === 'Critical' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                        )}>
                          {patient.status}
                        </span>
                        <span className="text-[10px] text-stone-400 font-sans italic">Last visit: {patient.lastVisit}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" className="flex-1 text-[10px] py-1.5">View Records</Button>
                        <Button variant="accent" size="sm" className="flex-1 text-[10px] py-1.5">Schedule Visit</Button>
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
                      <div className="mt-auto pt-4 space-y-3 border-t border-stone-100">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-stone-500">
                            <MapPin size={14} className="text-brand-accent" />
                            <span className="text-xs font-medium">{event.location || 'Local Community Center'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-stone-500">
                            <Clock size={14} className="text-brand-accent" />
                            <span className="text-xs font-medium">Today at 2:00 PM</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1.5">
                          <div className="flex -space-x-1.5">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-stone-200" />
                            ))}
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-stone-50 flex items-center justify-center text-[9px] font-bold text-stone-500">
                              +12
                            </div>
                          </div>
                          <Button variant="accent" size="sm" className="text-xs py-1.5">Register</Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-white border border-stone-200 rounded-xl">
                    <Users size={40} className="mx-auto text-stone-200 mb-4" />
                    <p className="text-lg font-serif text-stone-400">No events are currently scheduled.</p>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5 max-w-3xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-brand-primary">Active Conversations</h3>
              <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-xs">
                <UserPlus size={14} />
                <span>New Message</span>
              </Button>
            </div>

            <div className="space-y-3">
              <Card
                title="Clinical Support Team"
                description="Our nurses are available for any health-related inquiries."
                className="border-l-4 border-l-brand-accent cursor-pointer hover:bg-stone-50"
              >
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-accent">Online Now</span>
                  <Button variant="ghost" size="sm" className="font-bold text-[10px]">Open Secure Chat</Button>
                </div>
              </Card>

              <Card
                title="Family Circle: The Thompsons"
                description="Recent update from Sarah regarding the weekend visit."
                className="cursor-pointer hover:bg-stone-50"
              >
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">2 hours ago</span>
                  <Button variant="ghost" size="sm" className="font-bold text-[10px]">View Thread</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

