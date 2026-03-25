import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';
import { Search, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { Card } from './Card';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export function CareCircleManager({ userRole }: { userRole: string }) {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSearch = async () => {
    if (!searchEmail) return;
    setSearching(true);
    setError(null);
    setSearchResult(null);
    setSuccess(false);

    try {
      const q = query(collection(db, 'users'), where('email', '==', searchEmail), where('role', '==', 'elderly'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setError('No patient found with this email address.');
      } else {
        const patientData = snapshot.docs[0].data();
        setSearchResult({ id: snapshot.docs[0].id, ...patientData });
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching.');
    } finally {
      setSearching(false);
    }
  };

  const handleConnect = async () => {
    if (!searchResult || !auth.currentUser) return;
    setConnecting(true);
    setError(null);

    try {
      const circleRef = doc(db, 'care_circles', searchResult.id);
      const circleSnap = await getDoc(circleRef);

      const fieldToUpdate = userRole === 'professional' ? 'professionalIds' : 'caregiverIds';

      if (!circleSnap.exists()) {
        // Create circle if it doesn't exist
        await setDoc(circleRef, {
          elderlyId: searchResult.id,
          caregiverIds: userRole === 'caregiver' ? [auth.currentUser.uid] : [],
          professionalIds: userRole === 'professional' ? [auth.currentUser.uid] : [],
          updatedAt: new Date().toISOString()
        });
      } else {
        // Update existing circle
        await updateDoc(circleRef, {
          [fieldToUpdate]: arrayUnion(auth.currentUser.uid),
          updatedAt: new Date().toISOString()
        });
      }

      // If caregiver, also update their targetElderlyId for quick access
      if (userRole === 'caregiver') {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
          targetElderlyId: searchResult.id
        });
      }

      setSuccess(true);
      setSearchResult(null);
      setSearchEmail('');
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect to the patient.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-serif font-bold text-slate-primary">Connect with a Patient</h3>
        <p className="text-xs text-stone-500">Search for a patient by their email address to join their care circle.</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            placeholder="patient@example.com"
            className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:border-slate-primary outline-none font-sans text-sm"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={searching || !searchEmail}
          className="px-6"
        >
          {searching ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
        </Button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm"
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-sage-accent/10 border border-sage-accent/20 flex items-center gap-3 text-sage-accent text-sm"
        >
          <CheckCircle2 size={18} />
          <span>Successfully connected to the patient!</span>
        </motion.div>
      )}

      {searchResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-stone-50 border-2 border-slate-primary/20 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-primary shadow-sm">
                <Search size={24} />
              </div>
              <div>
                <h4 className="font-serif text-xl text-slate-primary">{searchResult.name}</h4>
                <p className="text-xs text-stone-500">{searchResult.email}</p>
              </div>
            </div>
            <Button 
              onClick={handleConnect} 
              disabled={connecting}
              className="flex items-center gap-2"
            >
              {connecting ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
              <span>Connect</span>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
