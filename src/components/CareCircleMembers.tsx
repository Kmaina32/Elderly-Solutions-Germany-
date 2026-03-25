import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { User, Shield, Stethoscope } from 'lucide-react';
import { Card } from './Card';
import { cn } from '../utils/cn';

export function CareCircleMembers({ elderlyId }: { elderlyId: string }) {
  const [circle, setCircle] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!elderlyId) {
      setLoading(false);
      return;
    }
    const unsubscribe = onSnapshot(doc(db, 'care_circles', elderlyId), async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCircle(data);
        
        // Fetch member details
        const allIds = [...(data.caregiverIds || []), ...(data.professionalIds || [])].filter(id => id && typeof id === 'string' && id.trim() !== '');
        const memberData = await Promise.all(
          allIds.map(async (id) => {
            const userDoc = await getDoc(doc(db, 'users', id));
            return userDoc.exists() ? { id, ...userDoc.data() } : null;
          })
        );
        setMembers(memberData.filter(m => m !== null));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [elderlyId]);

  if (loading) return <div className="p-8 text-center text-stone-400 italic">Loading care circle...</div>;
  if (!circle || members.length === 0) return <div className="p-8 text-center text-stone-400 italic">No care circle members yet.</div>;

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card key={member.id} className="p-6">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              member.role === 'professional' ? "bg-blue-50 text-blue-600" : "bg-sage-accent/10 text-sage-accent"
            )}>
              {member.role === 'professional' ? <Stethoscope size={24} /> : <Shield size={24} />}
            </div>
            <div>
              <h3 className="font-serif text-xl text-slate-primary">{member.name}</h3>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                  member.role === 'professional' ? "border-blue-200 text-blue-600" : "border-sage-accent/20 text-sage-accent"
                )}>
                  {member.role}
                </span>
                <span className="text-xs text-stone-400 italic">Active now</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
