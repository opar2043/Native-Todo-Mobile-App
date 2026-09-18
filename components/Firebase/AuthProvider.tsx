import React, { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import auth from "./firebase.config";

interface AuthContextValue {
  user: any;
  loading: boolean;
  googleSignIn: () => Promise<any>;
  setUser: (user: any) => void;
  logOut: () => Promise<void>;
  handleLogin: (email: string, password: string) => Promise<any>;
  handleRegister: (name: string, email: string, password: string) => Promise<any>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<any>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // Google Sign In
  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async ( name,email , pass) => {
    try {
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth , email , pass)
       await updateProfile(result.user , {
        displayName: name
       })
       return result.user
    } catch (error) {
      throw error
    }
  }

  const handleLogin = (email ,pass) => {
    try {
      setLoading(true)
      return signInWithEmailAndPassword(auth , email , pass)
    } catch (error) {
      throw error
    }
  }

  const updateUserProfile = async (data) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, data);
        setUser({ ...auth.currentUser });
        return auth.currentUser;
      }
    } catch (error) {
      throw error;
    }
  };

  // Log Out
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Track Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const data = {
    user ,
    loading ,
    googleSignIn,
    setUser,
    logOut,
    handleLogin , 
    handleRegister,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;