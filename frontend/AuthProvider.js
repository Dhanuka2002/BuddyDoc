// Polyfills for Firebase in React Native / Expo
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { decode as atob, encode as btoa } from 'base-64';
if (!global.btoa) global.btoa = btoa;
if (!global.atob) global.atob = atob;
global.Buffer = global.Buffer || require('buffer').Buffer;

import React, { createContext, useEffect, useState, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInAnonymously,
  getIdToken
} from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase app if not already initialized
let auth = null;
let _firebaseInitError = null;
let _useMockAuth = false;
try {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  auth = getAuth();
} catch (err) {
  // If Firebase initialization fails in this environment (common on Expo/React Native
  // when web-only SDKs are used), fall back to a lightweight mock auth so the app
  // can continue to run in development. Log the error for debugging.
  console.warn('Firebase init failed, falling back to mock auth:', err);
  _firebaseInitError = err;
  _useMockAuth = true;
}

const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  signInAnon: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (_useMockAuth) {
      // simple mock behavior: no authenticated user initially
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const t = await getIdToken(u, /* forceRefresh */ false);
          setToken(t);
          // persist token securely
          try {
            await SecureStore.setItemAsync('fb_token', t);
          } catch (e) {
            console.warn('Failed to persist token:', e);
          }
        } catch (err) {
          console.warn('Failed getting id token', err);
          setToken(null);
        }
      } else {
        setToken(null);
        try {
          await SecureStore.deleteItemAsync('fb_token');
        } catch (e) {
          console.warn('Failed to delete token from secure store:', e);
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async (email, password) => {
    if (_useMockAuth) {
      // mock sign-in: accept any credentials in development
      const mock = { uid: 'mock-user', email };
      setUser(mock);
      setToken(null);
      return { user: mock };
    }
    const res = await signInWithEmailAndPassword(auth, email, password);
    const t = await getIdToken(res.user, true);
    setToken(t);
    return res;
  };

  const signUp = async (email, password) => {
    if (_useMockAuth) {
      const mock = { uid: 'mock-user', email };
      setUser(mock);
      setToken(null);
      return { user: mock };
    }
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const t = await getIdToken(res.user, true);
    setToken(t);
    return res;
  };

  const signOut = async () => {
    if (_useMockAuth) {
      setToken(null);
      setUser(null);
      return;
    }
    await firebaseSignOut(auth);
    setToken(null);
    setUser(null);
  };

  const signInAnon = async () => {
    if (_useMockAuth) {
      const mock = { uid: 'guest' };
      setUser(mock);
      setToken(null);
      return { user: mock };
    }
    const res = await signInAnonymously(auth);
    const t = await getIdToken(res.user, true);
    setToken(t);
    return res;
  };

  // expose firebase init error for debugging in the UI if needed
  const initError = _firebaseInitError;

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signUp, signOut, signInAnon, initError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
