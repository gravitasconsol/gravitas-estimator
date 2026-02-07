// REAL FIREBASE VERSION - Gravitas Construction Estimator
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
  deleteDoc,
  serverTimestamp,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from './firebase-config';
import type { User, Estimate, UserTier, ContractorScale } from '@/types';

const ADMIN_USERNAME = 'gravitasconsol0828';
const ADMIN_PASSWORD = 'David1david2';

function convertUser(fbUser: FirebaseUser, extraData: Partial<User> = {}): User {
  const toDate = (val: unknown): Date => {
    if (val && typeof val === 'object' && 'toDate' in val && typeof (val as Timestamp).toDate === 'function') {
      return (val as Timestamp).toDate();
    }
    if (val instanceof Date) return val;
    return new Date();
  };

  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    displayName: fbUser.displayName || 'User',
    photoURL: fbUser.photoURL || undefined,
    tier: (extraData.tier as UserTier) || 'free',
    tierStatus: (extraData.tierStatus as 'active' | 'canceled') || 'active',
    estimatesUsedThisMonth: extraData.estimatesUsedThisMonth || 0,
    lastEstimateReset: toDate(extraData.lastEstimateReset),
    isAdmin: extraData.isAdmin || false,
    loginMethod: (extraData.loginMethod as 'email' | 'google' | 'facebook' | 'username') || 'email',
    createdAt: toDate(extraData.createdAt),
    updatedAt: toDate(extraData.updatedAt),
    companyName: extraData.companyName,
    contactNumber: extraData.contactNumber,
    address: extraData.address,
    scale: extraData.scale as ContractorScale,
  };
}

async function getUserDataFromDB(uid: string): Promise<Partial<User> | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() as Partial<User> : null;
}

async function saveUserToDB(uid: string, userData: Partial<User>) {
  const cleanData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v !== undefined)
  );
  await setDoc(doc(db, 'users', uid), {
    ...cleanData,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

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

export async function signUpWithEmail(email: string, password: string, displayName: string, contractorProfile?: any): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  
  const userData: any = {
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
    scale: contractorProfile?.scale,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await saveUserToDB(result.user.uid, userData);
  return convertUser(result.user, userData);
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const extraData = await getUserDataFromDB(result.user.uid) || {};
  return convertUser(result.user, extraData);
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  let extraData = await getUserDataFromDB(result.user.uid);
  
  if (!extraData) {
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

export async function loginAsAdmin(username: string, password: string): Promise<User> {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const adminEmail = 'gravitasconsol@gmail.com';
    const adminPassword = 'admin123456';
    
    try {
      const result = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      const extraData: any = {
        uid: result.user.uid,
        email: adminEmail,
        displayName: 'Gravitas Admin',
        tier: 'premium',
        tierStatus: 'active',
        isAdmin: true,
        loginMethod: 'username',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await saveUserToDB(result.user.uid, extraData);
      return convertUser(result.user, extraData);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        const result = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        await updateProfile(result.user, { displayName: 'Gravitas Admin' });
        const extraData: any = {
          uid: result.user.uid,
          email: adminEmail,
          displayName: 'Gravitas Admin',
          tier: 'premium',
          tierStatus: 'active',
          isAdmin: true,
          loginMethod: 'username',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await saveUserToDB(result.user.uid, extraData);
        return convertUser(result.user, extraData);
      }
      throw error;
    }
  }
  throw new Error('Invalid admin credentials');
}

export async function loginWithUsername(username: string, password: string): Promise<User> {
  const q = query(collection(db, 'users'), where('username', '==', username));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    throw new Error('User not found');
  }
  
  const userData = snapshot.docs[0].data();
  const email = userData.email;
  
  if (!email) {
    throw new Error('User email not found');
  }
  
  const result = await signInWithEmailAndPassword(auth, email, password);
  return convertUser(result.user, userData);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function updateUserTier(uid: string, tier: UserTier): Promise<void> {
  await updateDoc(doc(db, 'users', uid), {
    tier,
    updatedAt: serverTimestamp()
  });
}

export async function createEstimate(estimate: any): Promise<any> {
  const estimateRef = doc(collection(db, 'estimates'));
  const now = new Date();
  const newEstimate = {
    ...estimate,
    id: estimateRef.id,
    createdAt: now,
    updatedAt: now
  };
  
  await setDoc(estimateRef, {
    ...newEstimate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  const userRef = doc(db, 'users', estimate.userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    const data = userDoc.data();
    const current = data?.estimatesUsedThisMonth || 0;
    await updateDoc(userRef, {
      estimatesUsedThisMonth: current + 1,
      updatedAt: serverTimestamp()
    });
  }
  
  return newEstimate;
}

export async function getUserEstimates(userId: string): Promise<any[]> {
  const q = query(collection(db, 'estimates'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  });
}

export async function deleteEstimate(estimateId: string): Promise<void> {
  await deleteDoc(doc(db, 'estimates', estimateId));
}

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(collection(db, 'users'));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return convertUser({ uid: doc.id } as FirebaseUser, data);
  });
}

export const SUBSCRIPTION_PLANS: any = {
  free: {
    id: 'free',
    name: 'FREE',
    price: 0,
    priceFormatted: 'FREE',
    maxEstimates: 5,
    features: ['5 estimates/month', 'Basic materials', 'Email support'],
    limitations: ['PDF Export', 'Offline Mode', 'Priority Support', 'All Project Types']
  },
  standard: {
    id: 'standard',
    name: 'STANDARD',
    price: 499,
    priceFormatted: '₱499/month',
    maxEstimates: 100,
    features: ['100 estimates/month', 'All materials', 'PDF export', 'Priority support'],
    limitations: ['Offline Mode', 'Bulk Estimates', 'API Access']
  },
  premium: {
    id: 'premium',
    name: 'PREMIUM',
    price: 1499,
    priceFormatted: '₱1,499/month',
    maxEstimates: Infinity,
    features: ['Unlimited estimates', 'All features', 'Offline mode', '24/7 support'],
    limitations: []
  }
};

export const CONTRACTOR_SCALES: any = {
  micro: { id: 'micro', name: 'Micro', description: '1-5 workers', recommendedPlan: 'free' },
  small: { id: 'small', name: 'Small', description: '6-20 workers', recommendedPlan: 'standard' },
  medium: { id: 'medium', name: 'Medium', description: '21-100 workers', recommendedPlan: 'premium' },
  large: { id: 'large', name: 'Large', description: '101-500 workers', recommendedPlan: 'premium' },
  conglomerate: { id: 'conglomerate', name: 'Conglomerate', description: '500+ workers', recommendedPlan: 'premium' }
};