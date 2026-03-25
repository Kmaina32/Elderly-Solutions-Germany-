import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp, query, collection, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Accessibility, ArrowRight, CheckCircle, User, Search as SearchIcon, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  const [linkedUser, setLinkedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    role: '',
    mobilityNeeds: '',
    healthAlerts: '',
    interests: [] as string[],
    targetElderlyId: '',
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => {
    setStep(step - 1);
    setFoundUser(null);
    setSearchError('');
    setSearchTerm('');
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    setIsSearching(true);
    setSearchError('');
    setFoundUser(null);

    try {
      // Search by ID first
      const qId = query(collection(db, 'users'), where('uid', '==', searchTerm), where('role', '==', 'elderly'));
      const snapId = await getDocs(qId);
      
      if (!snapId.empty) {
        setFoundUser(snapId.docs[0].data());
      } else {
        // Search by Email
        const qEmail = query(collection(db, 'users'), where('email', '==', searchTerm), where('role', '==', 'elderly'));
        const snapEmail = await getDocs(qEmail);
        if (!snapEmail.empty) {
          setFoundUser(snapEmail.docs[0].data());
        } else {
          setSearchError('No elderly user found with that ID or email.');
        }
      }
    } catch (error) {
      setSearchError('Error searching for user. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleLink = (user: any) => {
    setLinkedUser(user);
    setFormData({ ...formData, targetElderlyId: user.uid });
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    
    // 1. Save User Profile
    await setDoc(doc(db, 'users', auth.currentUser.uid), {
      name: formData.name,
      role: formData.role,
      mobilityNeeds: formData.mobilityNeeds,
      healthAlerts: formData.healthAlerts,
      interests: formData.interests,
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      createdAt: serverTimestamp(),
    });

    // 2. Role-specific ecosystem setup
    if (formData.role === 'elderly') {
      // Create their own Care Circle
      await setDoc(doc(db, 'care_circles', auth.currentUser.uid), {
        elderlyId: auth.currentUser.uid,
        caregiverIds: [],
        professionalIds: [],
        updatedAt: serverTimestamp(),
      });
    } else if (formData.role === 'caregiver' || formData.role === 'professional') {
      if (formData.targetElderlyId && formData.targetElderlyId.trim() !== '') {
        const circleRef = doc(db, 'care_circles', formData.targetElderlyId);
        const field = formData.role === 'caregiver' ? 'caregiverIds' : 'professionalIds';
        
        try {
          await updateDoc(circleRef, {
            [field]: arrayUnion(auth.currentUser.uid),
            updatedAt: serverTimestamp()
          });
        } catch (error) {
          console.error("Error linking to care circle:", error);
          // Fallback: if circle doesn't exist, create it (shouldn't happen if elderly onboarded first)
          await setDoc(circleRef, {
            elderlyId: formData.targetElderlyId,
            caregiverIds: formData.role === 'caregiver' ? [auth.currentUser.uid] : [],
            professionalIds: formData.role === 'professional' ? [auth.currentUser.uid] : [],
            updatedAt: serverTimestamp()
          }, { merge: true });
        }
      }
    }
    
    onComplete();
  };

  const steps = [
    {
      title: "Your Role",
      description: "How will you be using the Elderly solutions platform?",
      icon: <User size={40} />,
      content: (
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'elderly', label: 'Elderly Resident', desc: 'I am looking for care and community for myself.' },
            { id: 'caregiver', label: 'Family Caregiver', desc: 'I am managing care for a loved one.' },
            { id: 'professional', label: 'Medical Professional', desc: 'I am a doctor, nurse, or therapist providing services.' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setFormData({ ...formData, role: role.id })}
              className={cn(
                "flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left group",
                formData.role === role.id 
                  ? "border-sage-accent bg-sage-accent/5 shadow-md" 
                  : "border-stone-100 hover:border-stone-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-lg font-serif font-bold text-slate-primary">{role.label}</span>
                {formData.role === role.id && <CheckCircle size={20} className="text-sage-accent" />}
              </div>
              <p className="text-sm text-stone-500 font-sans leading-relaxed">{role.desc}</p>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Personal Identity",
      description: "How should we address you within the Elderly solutions community?",
      icon: <User size={40} />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 text-xl border border-stone-200 rounded-lg focus:border-sage-accent outline-none font-serif bg-stone-50"
              placeholder="e.g. Margaret Thompson"
            />
          </div>
        </div>
      )
    },
    {
      title: "Mobility & Access",
      description: "Understanding your physical needs helps us tailor your experience.",
      icon: <Accessibility size={40} />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Mobility Requirements</label>
            <textarea
              value={formData.mobilityNeeds}
              onChange={(e) => setFormData({ ...formData, mobilityNeeds: e.target.value })}
              className="w-full p-4 text-lg border border-stone-200 rounded-lg focus:border-sage-accent outline-none font-sans bg-stone-50 h-32 leading-relaxed"
              placeholder="Please describe any assistance you use (e.g. walker, wheelchair) or specific access needs for events."
            />
          </div>
        </div>
      )
    },
    {
      title: "Care Coordination",
      description: "Critical health information for your dedicated care team.",
      icon: <Heart size={40} />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Health Alerts & Medications</label>
            <textarea
              value={formData.healthAlerts}
              onChange={(e) => setFormData({ ...formData, healthAlerts: e.target.value })}
              className="w-full p-4 text-lg border border-stone-200 rounded-lg focus:border-sage-accent outline-none font-sans bg-stone-50 h-32 leading-relaxed"
              placeholder="List any allergies, chronic conditions, or essential medications that our team should be aware of."
            />
          </div>
        </div>
      )
    },
    {
      title: "Link to Patient",
      description: "Search for the person you are caring for by their ID or Email.",
      icon: <SearchIcon size={40} />,
      content: (
        <div className="space-y-6">
          {!linkedUser ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-400">Patient ID / Email</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 text-xl border border-stone-200 rounded-lg focus:border-sage-accent outline-none font-serif bg-stone-50"
                    placeholder="e.g. margaret@example.com"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearch();
                    }}
                  />
                </div>
                <div className="pt-6">
                  <Button 
                    variant="secondary" 
                    className="h-[60px] px-6"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    {isSearching ? <Loader2 className="animate-spin" /> : <SearchIcon size={24} />}
                  </Button>
                </div>
              </div>

              {searchError && (
                <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 italic">
                  {searchError}
                </p>
              )}

              {foundUser && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-white border-2 border-sage-accent/20 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-sage-accent/10 rounded-full flex items-center justify-center text-sage-accent">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-slate-primary text-lg">{foundUser.name}</h4>
                      <p className="text-sm text-stone-500">{foundUser.email}</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleLink(foundUser)}>
                    Link Patient
                  </Button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 bg-emerald-50 border-2 border-emerald-200 rounded-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle size={32} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif font-bold text-slate-primary">Successfully Linked!</h4>
                <p className="text-stone-600">
                  You are now connected to <strong>{linkedUser.name}'s</strong> care circle.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setLinkedUser(null); setFoundUser(null); setFormData({ ...formData, targetElderlyId: '' }); }}>
                Change Patient
              </Button>
            </motion.div>
          )}
          
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-100">
            <p className="text-sm text-stone-500 leading-relaxed italic">
              Linking allows you to access health logs, medication schedules, and coordinate with other care circle members.
            </p>
          </div>
        </div>
      )
    }
  ].filter((s, i) => {
    if (formData.role === 'elderly') return i !== 4; // Skip linking step for elderly
    if (formData.role === 'caregiver' || formData.role === 'professional') return i === 0 || i === 1 || i === 4; // Only role, identity, and linking for others
    return true;
  });

  const currentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-linen-bg flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-12">
        {/* Progress Indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-16 rounded-full transition-all duration-500 ${
                  i + 1 <= step ? 'bg-sage-accent' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-stone-400">
            Step {step} of {steps.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="p-10 border-stone-200 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linen-bg -mr-16 -mt-16 rounded-full opacity-50" />
              
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-linen-bg border border-stone-200 rounded-lg flex items-center justify-center text-slate-primary">
                    {currentStep.icon}
                  </div>
                  <h2 className="text-3xl font-serif font-bold text-slate-primary leading-tight">
                    {currentStep.title}
                  </h2>
                  <p className="text-lg text-stone-500 font-sans leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                <div className="py-6 border-t border-stone-100">
                  {currentStep.content}
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                  {step > 1 && (
                    <Button 
                      variant="secondary" 
                      size="xl" 
                      onClick={handleBack} 
                      className="flex-1"
                    >
                      Previous Step
                    </Button>
                  )}
                  {step < steps.length ? (
                    <Button 
                      size="xl" 
                      onClick={handleNext} 
                      className="flex-1 group"
                      disabled={step === 1 && !formData.role}
                    >
                      <span>Continue</span>
                      <ArrowRight size={24} className="ml-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  ) : (
                    <Button 
                      size="xl" 
                      onClick={handleSubmit} 
                      className="flex-1 bg-sage-accent border-sage-accent"
                    >
                      Complete Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-stone-400 font-medium italic">
          Your information is encrypted and handled with the highest clinical standards.
        </p>
      </div>
    </div>
  );
}
