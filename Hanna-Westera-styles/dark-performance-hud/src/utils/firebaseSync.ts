import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { getFirestore, Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { WorkoutLog, WorkoutSplit, MobilityRoutine } from '../types';
import { LocalOnlySyncFields } from './exerciseUtils';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Sync is entirely optional. Without a configured Firebase project (env vars
// unset), every export below becomes a safe no-op and the app behaves exactly
// as it did before this feature existed -- fully local, no account required.
export const isSyncAvailable = (): boolean => Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const getFirebase = (): { auth: Auth; db: Firestore } | null => {
  if (!isSyncAvailable()) return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { auth: auth!, db: db! };
};

export interface SyncUser {
  uid: string;
  email: string | null;
}

const toSyncUser = (user: User): SyncUser => ({ uid: user.uid, email: user.email });

// Returns an unsubscribe function. Calls back with null immediately (and never
// again) when sync isn't configured, so callers don't need to branch on
// isSyncAvailable() themselves.
export const subscribeToAuthState = (callback: (user: SyncUser | null) => void): (() => void) => {
  const fb = getFirebase();
  if (!fb) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(fb.auth, (user) => callback(user ? toSyncUser(user) : null));
};

const cleanAuthErrorMessage = (err: unknown): string => {
  const raw = err instanceof Error ? err.message : 'Something went wrong.';
  return raw.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/[^)]+\)\.?/, '').trim();
};

export const signUpWithEmail = async (email: string, password: string): Promise<void> => {
  const fb = getFirebase();
  if (!fb) throw new Error('Cloud sync is not configured for this build.');
  try {
    await createUserWithEmailAndPassword(fb.auth, email, password);
  } catch (err) {
    throw new Error(cleanAuthErrorMessage(err));
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<void> => {
  const fb = getFirebase();
  if (!fb) throw new Error('Cloud sync is not configured for this build.');
  try {
    await signInWithEmailAndPassword(fb.auth, email, password);
  } catch (err) {
    throw new Error(cleanAuthErrorMessage(err));
  }
};

export const signOutOfSync = async (): Promise<void> => {
  const fb = getFirebase();
  if (!fb) return;
  await firebaseSignOut(fb.auth);
};

export interface SyncedData extends LocalOnlySyncFields {
  workoutLogs: WorkoutLog[];
  customSplits: Record<number, WorkoutSplit>;
  userCreatedSplits: WorkoutSplit[];
  customWarmups: MobilityRoutine[];
  updatedAt?: number;
}

export const pullSyncedData = async (uid: string): Promise<SyncedData | null> => {
  const fb = getFirebase();
  if (!fb) return null;
  const snap = await getDoc(doc(fb.db, 'users', uid));
  return snap.exists() ? (snap.data() as SyncedData) : null;
};

export const pushSyncedData = async (uid: string, data: SyncedData): Promise<void> => {
  const fb = getFirebase();
  if (!fb) return;
  await setDoc(doc(fb.db, 'users', uid), { ...data, updatedAt: Date.now() });
};
