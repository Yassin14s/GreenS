import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  currentUser: User & { 
    firstName?: string;
    lastName?: string;
    organization?: string;
    role?: string;
  } | null;
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userId: string, data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthContextType['currentUser']>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, userData: any = {}) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email,
      createdAt: new Date().toISOString()
    });
  }

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserProfile(userId: string, data: any) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
    
    // Update local user state
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        ...data
      });
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        // Combine auth user with Firestore data
        setCurrentUser({
          ...user,
          firstName: userData?.firstName,
          lastName: userData?.lastName,
          organization: userData?.organization,
          role: userData?.role
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}