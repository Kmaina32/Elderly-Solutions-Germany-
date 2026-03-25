import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from './Button';
import { Activity, Heart, Moon, Smile } from 'lucide-react';
import { cn } from '../utils/cn';

export function HealthLogger({ elderlyId }: { elderlyId: string }) {
  const [type, setType] = useState<'vitals' | 'mood' | 'activity' | 'sleep'>('vitals');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  const handleLog = async () => {
    if (!value) return;
    setIsLogging(true);
    try {
      await addDoc(collection(db, 'health_logs'), {
        userId: elderlyId,
        type,
        value,
        notes,
        timestamp: serverTimestamp(),
      });
      setValue('');
      setNotes('');
    } catch (error) {
      console.error('Error logging health data:', error);
    } finally {
      setIsLogging(false);
    }
  };

  const types = [
    { id: 'vitals', label: 'Vitals', icon: Heart, color: 'text-terracotta', bg: 'bg-terracotta/5' },
    { id: 'mood', label: 'Mood', icon: Smile, color: 'text-sage-accent', bg: 'bg-sage-accent/5' },
    { id: 'activity', label: 'Activity', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id as any)}
            className={cn(
              "flex flex-col items-center p-4 rounded-2xl border-2 transition-all",
              type === t.id ? "border-slate-primary bg-slate-primary/5" : "border-stone-100 hover:border-stone-200"
            )}
          >
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-2", t.bg, t.color)}>
              <t.icon size={20} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-slate-primary">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === 'vitals' ? 'e.g. 120/80 mmHg' : 'e.g. Feeling energetic'}
          className="w-full p-4 border border-stone-200 rounded-xl focus:border-sage-accent outline-none font-sans"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes (optional)..."
          className="w-full p-4 border border-stone-200 rounded-xl focus:border-sage-accent outline-none font-sans h-24"
        />
        <Button 
          onClick={handleLog} 
          disabled={isLogging || !value} 
          className="w-full"
        >
          {isLogging ? 'Logging...' : 'Record Health Data'}
        </Button>
      </div>
    </div>
  );
}
