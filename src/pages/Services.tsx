import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ShoppingBag, Truck, HeartPulse, Home, Search, Star, Clock, Plus, Activity, Stethoscope, Pill, X } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore';

export function Services({ user }: { user: any }) {
  const [services, setServices] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showAddService, setShowAddService] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  
  // Form states
  const [newService, setNewService] = useState({ title: '', description: '', category: 'healthcare', price: 0 });
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', status: 'active', reminderTimes: [] as string[] });
  const [tempTime, setTempTime] = useState('');

  useEffect(() => {
    let q = query(collection(db, 'services'));
    if (filter !== 'all') {
      q = query(collection(db, 'services'), where('category', '==', filter));
    }
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [filter]);

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
    { id: 'all', label: 'All Services', icon: Search },
    { id: 'transport', label: 'Transport', icon: Truck },
    { id: 'healthcare', label: 'Medical', icon: HeartPulse },
    { id: 'home-help', label: 'Home Help', icon: Home },
  ];

  const isCaregiver = user?.role === 'caregiver';
  const isProfessional = user?.role === 'professional';

  return (
    <Layout userRole={user?.role}>
      <div className="space-y-24">
        <header className="max-w-3xl">
          <span className="text-sm font-sans font-bold uppercase tracking-[0.3em] text-sage-accent mb-6 block">
            {isCaregiver ? 'Care Management' : isProfessional ? 'Clinical Services' : 'Concierge Services'}
          </span>
          <h2 className="text-4xl font-serif font-bold text-slate-primary leading-tight mb-8">
            {isCaregiver ? 'Coordinating Care for Margaret' : isProfessional ? 'Professional Service Registry' : 'Exceptional care, delivered to your door.'}
          </h2>
          <p className="text-xl text-stone-500 font-sans leading-relaxed">
            {isCaregiver 
              ? 'Manage care plans, schedule medical transport, and coordinate with professional helpers.' 
              : isProfessional 
              ? 'Register your professional services, manage bookings, and review patient referrals.'
              : 'Professional assistance for your daily needs, from gourmet dining to specialized medical transport.'}
          </p>
        </header>

        {isCaregiver || isProfessional ? (
          <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-stone-200 pb-6">
              <h3 className="text-2xl font-serif font-bold text-slate-primary">
                {isCaregiver ? 'Care Plan Management' : 'Your Registered Services'}
              </h3>
              <Button 
                variant="secondary" 
                size="md" 
                className="flex items-center gap-3"
                onClick={() => isCaregiver ? setShowAddMed(true) : setShowAddService(true)}
              >
                <Plus size={20} />
                <span>{isCaregiver ? 'Add Medication' : 'Add Service'}</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {isCaregiver ? (
                <>
                  <Card title="Daily Medication" description="Manage prescriptions and schedules for your patient." icon={<Pill size={32} />}>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Active</span>
                      <Button variant="ghost" className="font-bold" onClick={() => setShowAddMed(true)}>Add New</Button>
                    </div>
                  </Card>
                  <Card title="Physical Therapy" description="Weekly home visits and exercise routines." icon={<Activity size={32} />}>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Next: Tomorrow</span>
                      <Button variant="ghost" className="font-bold">View History</Button>
                    </div>
                  </Card>
                </>
              ) : (
                <>
                  <Card title="Mobile Nursing" description="Professional health checkups at home" icon={<HeartPulse size={32} />}>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Verified</span>
                      <Button variant="ghost" className="font-bold">Manage Bookings</Button>
                    </div>
                  </Card>
                  <Card title="Clinical Consultation" description="Virtual or in-person medical advice" icon={<Stethoscope size={32} />}>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Verified</span>
                      <Button variant="ghost" className="font-bold">Manage Bookings</Button>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full border-2 transition-all font-sans font-bold text-lg ${
                    filter === cat.id
                      ? 'bg-slate-primary border-slate-primary text-white'
                      : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400'
                  }`}
                >
                  <cat.icon size={20} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {services.length > 0 ? (
                services.map((service) => (
                  <Card
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    className="flex flex-col h-full group"
                  >
                    <div className="mt-auto pt-8 space-y-6 border-t border-stone-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sage-accent">
                          <Star size={20} fill="currentColor" />
                          <span className="font-bold text-lg">4.9</span>
                        </div>
                        <div className="flex items-center gap-2 text-stone-400">
                          <Clock size={20} />
                          <span className="font-medium">30-45 min</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4">
                        <span className="text-2xl font-serif font-bold text-slate-primary">
                          ${service.price || '25.00'}
                        </span>
                        <Button variant="accent" size="md">Request Service</Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-32 text-center bg-white border border-stone-200 rounded-xl">
                  <Search size={64} className="mx-auto text-stone-200 mb-8" />
                  <p className="text-2xl font-serif text-stone-400">No services found in this category.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Featured Section */}
        <section className="bg-slate-primary rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <h3 className="text-2xl font-serif font-bold">Premium Care Package</h3>
            <p className="text-lg text-stone-300 leading-relaxed">
              Our all-inclusive monthly subscription provides priority access to all services, 
              weekly wellness checks, and a dedicated care coordinator.
            </p>
            <Button variant="accent" size="lg">Learn More About Premium</Button>
          </div>
        </section>

        {/* Modals */}
        {showAddService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-primary/20 backdrop-blur-sm">
            <Card className="w-full max-w-lg p-8 space-y-6 bg-white shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-slate-primary">Register Service</h3>
                <button onClick={() => setShowAddService(false)} className="text-stone-400 hover:text-slate-primary"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Service Title" 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none"
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                />
                <textarea 
                  placeholder="Description" 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none h-32"
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
                <select 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none bg-white"
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                >
                  <option value="healthcare">Healthcare</option>
                  <option value="transport">Transport</option>
                  <option value="home-help">Home Help</option>
                </select>
                <input 
                  type="number" 
                  placeholder="Price ($)" 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none"
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                />
                <Button onClick={handleAddService} className="w-full">Register Service</Button>
              </div>
            </Card>
          </div>
        )}

        {showAddMed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-primary/20 backdrop-blur-sm">
            <Card className="w-full max-w-lg p-8 space-y-6 bg-white shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-serif font-bold text-slate-primary">Add Medication</h3>
                <button onClick={() => setShowAddMed(false)} className="text-stone-400 hover:text-slate-primary"><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Medication Name" 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none"
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Dosage (e.g. 500mg)" 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none"
                  onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                />
                <input 
                  type="text" 
                  placeholder="Frequency (e.g. Twice daily)" 
                  className="w-full p-4 border border-stone-200 rounded-xl outline-none"
                  onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                />
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-primary uppercase tracking-widest">Reminders</label>
                  <div className="flex gap-2">
                    <input 
                      type="time" 
                      className="flex-1 p-4 border border-stone-200 rounded-xl outline-none"
                      value={tempTime}
                      onChange={(e) => setTempTime(e.target.value)}
                    />
                    <Button onClick={addReminderTime} variant="secondary">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newMed.reminderTimes.map(time => (
                      <span key={time} className="bg-stone-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold">
                        {time}
                        <button onClick={() => removeReminderTime(time)} className="text-stone-400 hover:text-red-500"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddMed} className="w-full">Add to Care Plan</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

