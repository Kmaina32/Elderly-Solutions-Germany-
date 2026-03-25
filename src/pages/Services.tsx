import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ShoppingBag, Truck, HeartPulse, Home, Search, Star, Clock, Plus, Activity, Stethoscope, Pill, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils/cn';

export function Services({ user }: { user: any }) {
  const [services, setServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddService, setShowAddService] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  
  // Form states
  const [newService, setNewService] = useState({ title: '', description: '', category: 'healthcare', price: 0 });
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', status: 'active', reminderTimes: [] as string[] });
  const [tempTime, setTempTime] = useState('');

  useEffect(() => {
    let q = query(collection(db, 'services'));
    if (activeCategory !== 'all') {
      q = query(collection(db, 'services'), where('category', '==', activeCategory));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [activeCategory]);

  const handleAddService = async () => {
    if (!auth.currentUser) return;
    await addDoc(collection(db, 'services'), {
      ...newService,
      providerId: auth.currentUser.uid,
      verified: false,
      createdAt: serverTimestamp(),
    });
    setShowAddService(false);
  };

  const handleAddMed = async () => {
    if (!user?.targetElderlyId) return;
    await addDoc(collection(db, 'medications'), {
      ...newMed,
      userId: user.targetElderlyId,
      createdAt: serverTimestamp(),
    });
    setShowAddMed(false);
    setNewMed({ name: '', dosage: '', frequency: '', status: 'active', reminderTimes: [] });
  };

  const addReminderTime = () => {
    if (tempTime && !newMed.reminderTimes.includes(tempTime)) {
      setNewMed({ ...newMed, reminderTimes: [...newMed.reminderTimes, tempTime] });
      setTempTime('');
    }
  };

  const removeReminderTime = (time: string) => {
    setNewMed({ ...newMed, reminderTimes: newMed.reminderTimes.filter(t => t !== time) });
  };

  const categories = [
    { id: 'all', label: 'All Services', icon: Search, description: 'Browse all available care services' },
    { id: 'transport', label: 'Transport', icon: Truck, description: 'Medical and daily transportation' },
    { id: 'healthcare', label: 'Healthcare', icon: HeartPulse, description: 'Professional medical assistance' },
    { id: 'home-help', label: 'Home Help', icon: Home, description: 'Daily chores and home maintenance' },
  ];

  const isCaregiver = user?.role === 'caregiver';
  const isProfessional = user?.role === 'professional';

  return (
    <Layout userRole={user?.role}>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-lg shadow-terracotta/20">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-slate-primary">Services</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Curated Care</p>
              </div>
            </div>

            <nav className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left",
                    activeCategory === cat.id 
                      ? "bg-stone-50 text-terracotta shadow-sm" 
                      : "text-stone-400 hover:bg-stone-50/50 hover:text-slate-primary"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
                    activeCategory === cat.id ? "bg-white text-terracotta shadow-sm" : "bg-stone-50 text-stone-400 group-hover:bg-white"
                  )}>
                    <cat.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm tracking-tight">{cat.label}</p>
                    <p className="text-[10px] text-stone-400 truncate">{cat.description}</p>
                  </div>
                  {activeCategory === cat.id && (
                    <motion.div layoutId="active-pill-services" className="ml-auto shrink-0">
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </nav>
          </section>

          {(isCaregiver || isProfessional) && (
            <section className="p-6 rounded-3xl bg-slate-primary text-white space-y-4 shadow-xl shadow-slate-primary/20">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Plus size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif font-bold text-xl leading-tight">
                  {isCaregiver ? 'Add Medication' : 'Register Service'}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {isCaregiver ? 'Add a new medication to the care plan.' : 'List a new professional service for patients.'}
                </p>
              </div>
              <Button 
                className="w-full bg-white/10 hover:bg-white/20 border-none text-white text-xs uppercase tracking-widest font-bold py-4"
                onClick={() => isCaregiver ? setShowAddMed(true) : setShowAddService(true)}
              >
                {isCaregiver ? 'Add Medication' : 'Add Service'}
              </Button>
            </section>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <header className="mb-12">
            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-terracotta mb-2 block">
              {isCaregiver ? 'Care Management' : isProfessional ? 'Clinical Registry' : 'Concierge Services'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-slate-primary leading-tight mb-4">
              {isCaregiver ? 'Coordinating Care' : isProfessional ? 'Professional Registry' : 'Exceptional care, delivered.'}
            </h2>
            <p className="text-lg text-stone-500 font-sans leading-relaxed max-w-2xl">
              {isCaregiver 
                ? 'Manage care plans, schedule medical transport, and coordinate with professional helpers.' 
                : isProfessional 
                ? 'Register your professional services, manage bookings, and review patient referrals.'
                : 'Professional assistance for your daily needs, from gourmet dining to specialized medical transport.'}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {services.length > 0 ? (
                services.map((service) => (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="p-6 flex flex-col h-full group border-2 border-transparent hover:border-terracotta/20 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-stone-50 text-stone-400 flex items-center justify-center group-hover:bg-terracotta/5 group-hover:text-terracotta transition-colors">
                          {categories.find(c => c.id === service.category)?.icon ? 
                            React.createElement(categories.find(c => c.id === service.category)!.icon, { size: 24 }) : 
                            <ShoppingBag size={24} />
                          }
                        </div>
                        {service.verified && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-sage-accent uppercase tracking-widest bg-sage-accent/5 px-2 py-1 rounded-full">
                            <ShieldCheck size={12} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif font-bold text-xl text-slate-primary mb-2">{service.title}</h3>
                        <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">{service.description}</p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Price</span>
                          <span className="text-xl font-serif font-bold text-slate-primary">${service.price}</span>
                        </div>
                        <Button size="sm" className="px-6">Request</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-24 text-center bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl">
                  <Search size={48} className="mx-auto text-stone-300 mb-4" />
                  <p className="text-xl font-serif text-stone-400">No services found in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg"
            >
              <Card className="p-8 space-y-6 bg-white shadow-2xl rounded-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-slate-primary">Register Service</h3>
                  <button onClick={() => setShowAddService(false)} className="text-stone-400 hover:text-slate-primary"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Service Title" 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:border-terracotta"
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  />
                  <textarea 
                    placeholder="Description" 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none h-32 focus:border-terracotta"
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                  <select 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none bg-white focus:border-terracotta"
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  >
                    <option value="healthcare">Healthcare</option>
                    <option value="transport">Transport</option>
                    <option value="home-help">Home Help</option>
                  </select>
                  <input 
                    type="number" 
                    placeholder="Price ($)" 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:border-terracotta"
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  />
                  <Button onClick={handleAddService} className="w-full py-4">Register Service</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {showAddMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-primary/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg"
            >
              <Card className="p-8 space-y-6 bg-white shadow-2xl rounded-3xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-slate-primary">Add Medication</h3>
                  <button onClick={() => setShowAddMed(false)} className="text-stone-400 hover:text-slate-primary"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Medication Name" 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:border-terracotta"
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Dosage (e.g. 500mg)" 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:border-terracotta"
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  />
                  <input 
                    type="text" 
                    placeholder="Frequency (e.g. Twice daily)" 
                    className="w-full p-4 border border-stone-200 rounded-xl outline-none focus:border-terracotta"
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-primary uppercase tracking-widest">Reminders</label>
                    <div className="flex gap-2">
                      <input 
                        type="time" 
                        className="flex-1 p-4 border border-stone-200 rounded-xl outline-none focus:border-terracotta"
                        value={tempTime}
                        onChange={(e) => setTempTime(e.target.value)}
                      />
                      <Button onClick={addReminderTime} variant="outline" className="px-6">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newMed.reminderTimes.map(time => (
                        <span key={time} className="bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-slate-primary">
                          {time}
                          <button onClick={() => removeReminderTime(time)} className="text-stone-400 hover:text-red-500"><X size={14} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddMed} className="w-full py-4">Add to Care Plan</Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

