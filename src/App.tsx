/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { Social } from './pages/Social';
import { Services } from './pages/Services';
import { Admin } from './pages/Admin';
import { KnowledgeHub } from './pages/KnowledgeHub';
import { EmpathyLab } from './pages/EmpathyLab';
import Profile from './pages/Profile';
import { Loading } from './components/Loading';
import { MedicationReminderManager } from './components/MedicationReminderManager';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      
      if (firebaseUser) {
        setProfileLoading(true);
        const profileUnsub = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            setProfile(null);
          }
          setProfileLoading(false);
        });
        return () => profileUnsub();
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading || profileLoading) {
    return <Loading message="Preparing your care environment" />;
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!profile) {
    return <Onboarding onComplete={() => {}} />;
  }

  return (
    <AccessibilityProvider userId={user.uid} initialFontSize={profile.fontSize}>
      <MedicationReminderManager userRole={profile.role} />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home user={profile} />} />
          <Route path="/social" element={<Social user={profile} />} />
          <Route path="/services" element={<Services user={profile} />} />
          <Route path="/knowledge" element={<KnowledgeHub user={profile} />} />
          <Route path="/empathy-lab" element={<EmpathyLab user={profile} />} />
          <Route path="/profile" element={<Profile user={profile} />} />
          <Route path="/admin" element={<Admin user={profile} />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

