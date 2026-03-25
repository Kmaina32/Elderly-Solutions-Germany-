import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Users, MessageSquare, Calendar, Plus, UserPlus, MapPin, Clock, ChevronRight, Search, Info } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
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

  const tabs = [
    { id: 'events', label: isProfessional ? 'Patient Directory' : 'Local Activities', icon: isProfessional ? Users : Calendar, description: isProfessional ? 'Manage your clinical caseload' : 'Find community gatherings' },
    { id: 'chat', label: 'Secure Messaging', icon: MessageSquare, description: 'Private care coordination' },
  ];

  return (
    <Layout userRole={user?.role}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent text-white flex items-center justify-center shadow-lg shadow-brand-accent/20">
                <Users size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-brand-primary">Social</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Community Hub</p>
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
                      ? "bg-stone-50 text-brand-accent shadow-sm" 
                      : "text-stone-400 hover:bg-stone-50/50 hover:text-brand-primary"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                    activeTab === tab.id ? "bg-white text-brand-accent shadow-sm" : "bg-stone-50 text-stone-400 group-hover:bg-white"
                  )}>
                    <tab.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm tracking-tight">{tab.label}</p>
                    <p className="text-[10px] text-stone-400 truncate">{tab.description}</p>
                  </div>
                  {activeTab === tab.id && (
                    <motion.div layoutId="active-pill-social" className="ml-auto shrink-0">
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </nav>
          </section>

          <section className="p-6 rounded-3xl bg-brand-primary text-white space-y-4 shadow-xl shadow-brand-primary/20">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Info size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl leading-tight">Need Support?</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Our team is here to help you connect with the right resources.
              </p>
            </div>
            <Button className="w-full bg-white/10 hover:bg-white/20 border-none text-white text-xs uppercase tracking-widest font-bold py-4">
              Contact Support
            </Button>
          </section>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <header className="mb-12">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-brand-accent mb-2 block">
              {isProfessional ? 'Clinical Network' : 'Community Hub'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary leading-tight mb-4">
              {isProfessional ? 'Patient Care & Coordination' : 'Connection is the cornerstone of health.'}
            </h2>
            <p className="text-lg text-stone-500 font-sans leading-relaxed max-w-2xl">
              {isProfessional 
                ? 'Manage your patient list, review clinical alerts, and communicate with care teams.' 
                : 'Engage with local activities or reach out to your dedicated care network.'}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'events' ? (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">
                    {isProfessional ? 'Active Patients' : 'Upcoming Gatherings'}
                  </h3>
                  {isProfessional ? (
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                      <UserPlus size={16} />
                      <span>Add Patient</span>
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" className="flex items-center gap-2">
                      <Plus size={16} />
                      <span>Propose Event</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isProfessional ? (
                    [
                      { name: 'Margaret Thompson', id: 'MT-001', status: 'Stable', lastVisit: '2 days ago' },
                      { name: 'Robert Wilson', id: 'RW-002', status: 'Monitoring', lastVisit: 'Today' },
                      { name: 'Alice Gardner', id: 'AG-003', status: 'Critical', lastVisit: '1 week ago' },
                    ].map((patient) => (
                      <Card key={patient.id} className="p-6 flex flex-col h-full border-2 border-transparent hover:border-brand-accent/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center">
                            <Users size={24} className="text-stone-400" />
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            patient.status === 'Stable' ? "bg-emerald-50 text-emerald-600" :
                            patient.status === 'Critical' ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {patient.status}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif font-bold text-xl text-brand-primary mb-1">{patient.name}</h4>
                          <p className="text-xs text-stone-400 font-sans">Patient ID: {patient.id}</p>
                        </div>
                        <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-[10px] text-stone-400 font-sans italic">Last visit: {patient.lastVisit}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Records</Button>
                            <Button size="sm">Schedule</Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    events.length > 0 ? (
                      events.map((event) => (
                        <Card key={event.id} className="p-6 flex flex-col h-full border-2 border-transparent hover:border-brand-accent/20 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center">
                              <Calendar size={24} className="text-stone-400" />
                            </div>
                            <div className="flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-200" />
                              ))}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-serif font-bold text-xl text-brand-primary mb-2">{event.title}</h4>
                            <p className="text-sm text-stone-500 leading-relaxed line-clamp-2">{event.description}</p>
                          </div>
                          <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-stone-500">
                                <MapPin size={14} className="text-brand-accent" />
                                <span className="text-xs font-medium">{event.location || 'Local Community Center'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-stone-500">
                                <Clock size={14} className="text-brand-accent" />
                                <span className="text-xs font-medium">Today at 2:00 PM</span>
                              </div>
                            </div>
                            <Button className="w-full">Register for Event</Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full py-24 text-center bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl">
                        <Users size={48} className="mx-auto text-stone-300 mb-4" />
                        <p className="text-xl font-serif text-stone-400">No events are currently scheduled.</p>
                      </div>
                    )
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-brand-primary">Active Conversations</h3>
                  <Button variant="secondary" size="sm" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>New Thread</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Clinical Support Team', desc: 'Our nurses are available for any health-related inquiries.', status: 'Online Now', color: 'brand-accent' },
                    { title: 'Family Circle: The Thompsons', desc: 'Recent update from Sarah regarding the weekend visit.', status: '2 hours ago', color: 'stone-400' }
                  ].map((chat, i) => (
                    <Card key={i} className="p-6 cursor-pointer hover:bg-stone-50 transition-colors border-l-4 border-l-brand-accent">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-serif font-bold text-lg text-brand-primary">{chat.title}</h4>
                          <p className="text-sm text-stone-500">{chat.desc}</p>
                        </div>
                        <div className="text-right space-y-2">
                          <span className={cn("text-[10px] font-bold uppercase tracking-widest", chat.color === 'brand-accent' ? 'text-brand-accent' : 'text-stone-400')}>
                            {chat.status}
                          </span>
                          <Button variant="ghost" size="sm" className="block text-xs font-bold">Open Chat</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </Layout>
  );
}

