import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

type FontSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: React.ReactNode;
  userId?: string;
  initialFontSize?: FontSize;
}

export function AccessibilityProvider({ children, userId, initialFontSize }: AccessibilityProviderProps) {
  const [fontSize, setFontSizeState] = useState<FontSize>(initialFontSize || 'base');

  useEffect(() => {
    if (userId) {
      const unsubscribe = onSnapshot(doc(db, 'users', userId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.fontSize) {
            setFontSizeState(data.fontSize);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    const root = document.documentElement;
    const fontSizes: Record<FontSize, string> = {
      'sm': '14px',
      'base': '16px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px',
    };
    root.style.fontSize = fontSizes[fontSize];
  }, [fontSize]);

  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          fontSize: size
        });
      } catch (error) {
        console.error('Failed to update font size preference:', error);
      }
    }
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
