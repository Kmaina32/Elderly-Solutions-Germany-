import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Bell, X, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

export function MedicationReminderManager({ userRole }: { userRole?: string }) {
  const [meds, setMeds] = useState<any[]>([]);
  const [activeReminders, setActiveReminders] = useState<any[]>([]);
  const [dismissedToday, setDismissedToday] = useState<string[]>([]);
  const [targetElderlyId, setTargetElderlyId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    if (userRole === 'elderly') {
      setTargetElderlyId(auth.currentUser.uid);
    } else if (userRole === 'caregiver' || userRole === 'professional') {
      // Find the care circle where this user is a member
      const q = query(
        collection(db, 'care_circles'),
        where(userRole === 'caregiver' ? 'caregiverIds' : 'professionalIds', 'array-contains', auth.currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setTargetElderlyId(snapshot.docs[0].data().elderlyId);
        }
      });

      return () => unsubscribe();
    }
  }, [userRole]);

  useEffect(() => {
    if (!targetElderlyId) return;

    const q = query(
      collection(db, 'medications'),
      where('userId', '==', targetElderlyId),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [targetElderlyId]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      const today = now.toDateString();

      const due = meds.filter(med => {
        if (!med.reminderTimes) return false;
        
        // Check if any reminder time matches current time
        const isTimeMatch = med.reminderTimes.includes(currentTime);
        if (!isTimeMatch) return false;

        // Check if already taken today after this time (approximate)
        // Or if already dismissed for this specific time today
        const reminderKey = `${med.id}-${currentTime}-${today}`;
        if (dismissedToday.includes(reminderKey)) return false;

        const lastTakenDate = med.lastTaken?.toDate();
        if (lastTakenDate && lastTakenDate.toDateString() === today) {
          const lastTakenTime = lastTakenDate.getHours().toString().padStart(2, '0') + ':' + lastTakenDate.getMinutes().toString().padStart(2, '0');
          if (lastTakenTime >= currentTime) return false;
        }

        return true;
      });

      if (due.length > 0) {
        setActiveReminders(prev => {
          const newReminders = [...prev];
          due.forEach(d => {
            const reminderKey = `${d.id}-${currentTime}-${today}`;
            if (!newReminders.find(r => r.key === reminderKey)) {
              newReminders.push({ ...d, key: reminderKey, time: currentTime });
            }
          });
          return newReminders;
        });
      }
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [meds, dismissedToday]);

  const dismiss = (key: string) => {
    setDismissedToday(prev => [...prev, key]);
    setActiveReminders(prev => prev.filter(r => r.key !== key));
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {activeReminders.map((reminder) => (
          <motion.div
            key={reminder.key}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 w-80 pointer-events-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                <Bell size={20} className="animate-bounce" />
              </div>
              <button onClick={() => dismiss(reminder.key)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1 mb-6">
              <h4 className="text-sm font-bold text-sage-accent uppercase tracking-widest">Medication Reminder</h4>
              <h3 className="text-xl font-serif font-bold text-slate-primary">{reminder.name}</h3>
              <p className="text-stone-500">{reminder.dosage} • Scheduled for {reminder.time}</p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" size="sm" onClick={() => dismiss(reminder.key)}>I've taken it</Button>
              <Button variant="outline" className="flex-1" size="sm" onClick={() => dismiss(reminder.key)}>Snooze</Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
