import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Pill, CheckCircle2, Clock } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { cn } from '../utils/cn';

export function MedicationTracker({ elderlyId }: { elderlyId: string }) {
  const [meds, setMeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'medications'),
      where('userId', '==', elderlyId),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMeds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [elderlyId]);

  const handleTake = async (medId: string) => {
    try {
      await updateDoc(doc(db, 'medications', medId), {
        lastTaken: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-stone-400 italic">Loading medications...</div>;
  if (meds.length === 0) return <div className="p-8 text-center text-stone-400 italic">No active medications found.</div>;

  return (
    <div className="space-y-4">
      {meds.map((med) => (
        <Card key={med.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-terracotta/5 text-terracotta flex items-center justify-center">
                <Pill size={24} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-slate-primary">{med.name}</h3>
                <p className="text-sm text-stone-500 font-medium">{med.dosage} • {med.frequency}</p>
                {med.reminderTimes && med.reminderTimes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {med.reminderTimes.map((time: string) => (
                      <span key={time} className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {time}
                      </span>
                    ))}
                  </div>
                )}
                {med.lastTaken && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-sage-accent font-bold uppercase tracking-widest">
                    <Clock size={12} />
                    <span>Last taken: {new Date(med.lastTaken.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTake(med.id)}
              className={cn(
                "rounded-full px-6",
                med.lastTaken && new Date(med.lastTaken.toDate()).toDateString() === new Date().toDateString() 
                  ? "bg-sage-accent/10 border-sage-accent text-sage-accent" 
                  : ""
              )}
            >
              {med.lastTaken && new Date(med.lastTaken.toDate()).toDateString() === new Date().toDateString() ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Taken</span>
                </div>
              ) : 'Confirm'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
