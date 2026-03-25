import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Button } from './Button';
import { Activity, Heart, Moon, Smile, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export function HealthLogger({ elderlyId }: { elderlyId: string }) {
  const [type, setType] = useState<'vitals' | 'mood' | 'activity' | 'sleep'>('vitals');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!elderlyId) return;
    const q = query(
      collection(db, 'health_logs'),
      where('userId', '==', elderlyId),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [elderlyId]);

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

      {logs.length > 0 && (
        <div className="pt-4 border-t border-stone-100">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-stone-400 hover:text-slate-primary transition-colors mb-4"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Recent Logs</span>
            {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {logs.map((log) => {
                  const Icon = types.find(t => t.id === log.type)?.icon || Activity;
                  return (
                    <div key={log.id} className="flex items-center gap-4 p-3 rounded-xl bg-stone-50/50 border border-stone-100">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", types.find(t => t.id === log.type)?.bg, types.find(t => t.id === log.type)?.color)}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-primary truncate">{log.value}</p>
                        <p className="text-[10px] text-stone-400 truncate">{log.notes || 'No notes'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          <Clock size={10} />
                          <span>{log.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
