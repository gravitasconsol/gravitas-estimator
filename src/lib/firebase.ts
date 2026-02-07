// src/lib/firebase.ts - REAL FIREBASE VERSION
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore';
import { auth, db } from './firebase-config';
import type { User, Estimate } from '@/types';

const ADMIN_USERNAME = 'gravitasconsol0828';
const ADMIN_PASSWORD = 'David1david2';

// Convert Firebase user to app User
function convertUser(fbUser: FirebaseUser, extraData: Partial<User> = {}): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || 'User',
    photoURL: fbUser.photoURL || undefined,
    tier: extraData.tier || 'free',
    tierStatus: extraData.tierStatus || 'active',
    estimatesUsedThisMonth: extraData.estimatesUsedThisMonth || 0,
    lastEstimateReset: extraData.lastEstimateReset ? new Date(extraData.lastEstimateReset as any) : new Date(),
    isAdmin: extraData.isAdmin || false,
    loginMethod: extraData.loginMethod || 'email',
    createdAt: extraData.createdAt ? new Date(extraData.createdAt as any) : new Date(),
    updatedAt: extraData.updatedAt ? new Date(extraData.updatedAt as any) : new Date(),
    ...extraData
  };
}

// Get user data from Firestore
async function getUserDataFromDB(uid: string): Promise<Partial<User> | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() as Partial<User> : null;
}

// Save user to Firestore
async function saveUserToDB(uid: string, userData: Partial<User>) {
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      const extraData = await getUserDataFromDB(fbUser.uid) || {};
      callback(convertUser(fbUser, extraData));
    } else {
      callback(null);
    }
  });
}

// Email Sign Up
export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName: string,
  contractorProfile?: {
    companyName?: string;
    contactNumber: string;
    address: string;
    scale: string;
  }
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  
  const userData: Partial<User> = {
    uid: result.user.uid,
    email,
    displayName,
    tier: 'free',
    tierStatus: 'active',
    estimatesUsedThisMonth: 0,
    lastEstimateReset: new Date(),
    isAdmin: false,
    loginMethod: 'email',
    companyName: contractorProfile?.companyName,
    contactNumber: contractorProfile?.contactNumber,
    address: contractorProfile?.address,
    scale: contractorProfile?.scale as any,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await saveUserToDB(result.user.uid, userData);
  return convertUser(result.user, userData);
}

// Email Login
export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const extraData = await getUserDataFromDB(result.user.uid) || {};
  return convertUser(result.user, extraData);
}

// Google Sign In
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  let extraData = await getUserDataFromDB(result.user.uid);
  
  if (!extraData) {
    // New user
    extraData = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName || 'Google User',
      tier: 'free',
      tierStatus: 'active',
      estimatesUsedThisMonth: 0,
      lastEstimateReset: new Date(),
      isAdmin: false,
      loginMethod: 'google',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveUserToDB(result.user.uid, extraData);
  }
  
  return convertUser(result.user, extraData);
}

// Facebook Sign In
export async function signInWithFacebook(): Promise<User> {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  let extraData = await getUserDataFromDB(result.user.uid);
  
  if (!extraData) {
    extraData = {
      uid: result.user.uid,
      email: result.user.email || '',
      displayName: result.user.displayName || 'Facebook User',
      tier: 'free',
      tierStatus: 'active',
      estimatesUsedThisMonth: 0,
      lastEstimateReset: new Date(),
      isAdmin: false,
      loginMethod: 'facebook',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await saveUserToDB(result.user.uid, extraData);
  }
  
  return convertUser(result.user, extraData);
}

// Admin Login (special case)
export async function loginAsAdmin(username: string, password: string): Promise<User> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Sign in with predefined admin email
    try {
      const result = await signInWithEmailAndPassword(auth, 'gravitasconsol@gmail.com', 'admin123456');
      const extraData = {
        uid: result.user.uid,
        email: 'gravitasconsol@gmail.com',
        displayName: 'Gravitas Admin',
        tier: 'premium',
        tierStatus: 'active',
        isAdmin: true,
        loginMethod: 'username' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await saveUserToDB(result.user.uid, extraData);
      return convertUser(result.user, extraData);
    } catch {
      // If admin doesn't exist, create it
      const result = await createUserWithEmailAndPassword(auth, 'gravitasconsol@gmail.com', 'admin123456');
      await updateProfile(result.user, { displayName: 'Gravitas Admin' });
      const extraData = {
        uid: result.user.uid,
        email: 'gravitasconsol@gmail.com',
        displayName: 'Gravitas Admin',
        tier: 'premium',
        tierStatus: 'active',
        isAdmin: true,
        loginMethod: 'username' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await saveUserToDB(result.user.uid, extraData);
      return convertUser(result.user, extraData);
    }
  }
  throw new Error('Invalid admin credentials');
}

// Username Login (check if username exists in DB)
export async function loginWithUsername(username: string, password: string): Promise<User> {
  // Query users collection for username
  const q = query(collection(db, 'users'), where('username', '==', username));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error('User not found');
  }
  
  const userData = snapshot.docs[0].data();
  const email = userData.email;
  
  const result = await signInWithEmailAndPassword(auth, email, password);
  return convertUser(result.user, userData);
}

// Logout
export async function logout(): Promise<void> {
  await signOut(auth);
}

// Update user tier
export async function updateUserTier(uid: string, tier: 'free' | 'standard' | 'premium'): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    tier,
    updatedAt: serverTimestamp()
  });
}

// Create estimate
export async function createEstimate(estimate: Omit<Estimate, 'id' | 'createdAt' | 'updatedAt'>): Promise<Estimate> {
  const estimateRef = doc(collection(db, 'estimates'));
  const newEstimate = {
    ...estimate,
    id: estimateRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  await setDoc(estimateRef, newEstimate);
  
  // Increment user's estimate count
  const userRef = doc(db, 'users', estimate.userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const current = userDoc.data().estimatesUsedThisMonth || 0;
    await updateDoc(userRef, {
      estimatesUsedThisMonth: current + 1,
      updatedAt: serverTimestamp()
    });
  }
  
  return newEstimate as Estimate;
}

// Get user estimates
export async function getUserEstimates(userId: string): Promise<Estimate[]> {
  const q = query(
    collection(db, 'estimates'), 
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Estimate[];
}

// Delete estimate
export async function deleteEstimate(estimateId: string): Promise<void> {
  await deleteEstimate(estimateId);
}

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'FREE',
    price: 0,
    maxEstimates: 5,
    features: ['5 estimates/month', 'Basic materials', 'Email support']
  },
  standard: {
    id: 'standard',
    name: 'STANDARD',
    price: 499,
    maxEstimates: 100,
    features: ['100 estimates/month', 'All materials', 'PDF export', 'Priority support']
  },
  premium: {
    id: 'premium',
    name: 'PREMIUM',
    price: 1499,
    maxEstimates: 'unlimited',
    features: ['Unlimited estimates', 'All features', 'Offline mode', '24/7 support']
  }
};

// Contractor scales
export const CONTRACTOR_SCALES = {
  micro: { id: 'micro', name: 'Micro', description: '1-5 workers', recommendedPlan: 'free' },
  small: { id: 'small', name: 'Small', description: '6-20 workers', recommendedPlan: 'standard' },
  medium: { id: 'medium', name: 'Medium', description: '21-100 workers', recommendedPlan: 'premium' },
  large: { id: 'large', name: 'Large', description: '101-500 workers', recommendedPlan: 'premium' },
  conglomerate: { id: 'conglomerate', name: 'Conglomerate', description: '500+ workers', recommendedPlan: 'premium' }
};

// Create subscription (calls PayMongo)
export async function createSubscription(tier: 'standard' | 'premium'): Promise<{
  clientSecret: string;
  subscriptionId: string;
}> {
  // This will call your Cloud Function
  const response = await fetch('https://YOUR_CLOUD_FUNCTION_URL/createSubscription', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, userId: auth.currentUser?.uid })
  });
  
  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }
  
  return response.json();
}