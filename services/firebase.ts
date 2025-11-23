/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { SyncBrief, Track, Application } from '../types';

// Safe environment variable access for browser environments
const getEnv = (key: string, fallback: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key] || fallback;
    }
  } catch (e) {
    // Ignore reference errors
  }
  return fallback;
};

// Configuration
const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY", "YOUR_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN", "YOUR_AUTH_DOMAIN"),
  projectId: getEnv("FIREBASE_PROJECT_ID", "YOUR_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET", "YOUR_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID", "YOUR_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID", "YOUR_APP_ID")
};

// Check if configuration is actually set (not using placeholders)
const isConfigValid = firebaseConfig.apiKey && 
                      !firebaseConfig.apiKey.includes("YOUR_API_KEY") &&
                      !firebaseConfig.authDomain.includes("YOUR_AUTH_DOMAIN");

// Initialize Firebase safely
let app;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("Firebase initialized successfully.");
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
    console.warn("Falling back to Mock Service Mode.");
  }
} else {
  console.warn("Firebase config missing or invalid. Using Mock Service Mode.");
}

// --- Dummy Data Seeder ---
const SEED_BRIEFS: SyncBrief[] = [
  {
    id: '1',
    title: 'Cyberpunk Racing Game Title Track',
    client: 'Neon Interactive',
    budget: '$5,000 - $8,000',
    genre: 'Synthwave / Industrial',
    deadline: '2 Days Left',
    description: 'Looking for a high-energy, aggressive synthwave track for the main menu and title sequence of a AAA racing game. Must feature distorted bass and retro-futuristic synths.',
    tags: ['Gaming', 'High Energy', 'Instrumental']
  },
  {
    id: '2',
    title: 'Futuristic Perfume Commercial',
    client: 'Luxe Digital',
    budget: '$12,000',
    genre: 'Ethereal / Ambient',
    deadline: '1 Week Left',
    description: 'Need a dreamy, floating track with female vocals (optional) for a 30s TV spot. The visual is a woman floating in zero gravity. Think airy, crystalline textures.',
    tags: ['Advertising', 'Atmospheric', 'Luxury']
  },
  {
    id: '3',
    title: 'Sci-Fi Series Background Ambience',
    client: 'StreamNet Original',
    budget: '$2,500 / min',
    genre: 'Dark Ambient / Drone',
    deadline: 'Urgent',
    description: 'Subtle background tension for a dystopian investigation scene. Low rumbles, metallic scrapes, no melody. Needs to sit under dialogue.',
    tags: ['TV', 'Tension', 'Background']
  },
  {
    id: '4',
    title: 'Sports Drink Promo - High Octane',
    client: 'Bolt Energy',
    budget: '$4,000',
    genre: 'Drum & Bass / Breakbeat',
    deadline: '5 Days Left',
    description: 'Fast-paced liquid DnB or Neurofunk. Needs to match quick cuts of athletes training. 170+ BPM required.',
    tags: ['Advertising', 'Sports', 'Fast']
  }
];

export const seedBriefsIfNeeded = async () => {
  if (!db) return;
  try {
    const briefsRef = collection(db, 'briefs');
    const snapshot = await getDocs(briefsRef);
    
    if (snapshot.empty) {
      console.log('Seeding briefs...');
      for (const brief of SEED_BRIEFS) {
        await setDoc(doc(db, 'briefs', brief.id), brief);
      }
      console.log('Briefs seeded.');
    }
  } catch (error) {
    console.error("Error seeding briefs:", error);
  }
};

// --- MOCK DB IMPLEMENTATION (LocalStorage) ---
const MOCK_DB_KEY = 'syncmaster_mock_db';
const MOCK_EVENT = 'mock_db_change';

const getMockDb = () => {
  try {
    const stored = localStorage.getItem(MOCK_DB_KEY);
    return stored ? JSON.parse(stored) : { tracks: [], applications: [] };
  } catch (e) {
    return { tracks: [], applications: [] };
  }
};

const updateMockDb = (data: any) => {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(MOCK_EVENT));
};

// --- Auth Services (Wrapper to handle Mock vs Real) ---

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  } else {
    // Mock Auth Listener
    const checkMockUser = () => {
      const stored = localStorage.getItem('mock_user');
      if (stored) {
        try {
          callback(JSON.parse(stored));
        } catch(e) { callback(null); }
      } else {
        callback(null);
      }
    };
    
    // Initial check
    checkMockUser();
    
    // Listen for custom mock events
    window.addEventListener('mock_auth_changed', checkMockUser);
    
    return () => {
      window.removeEventListener('mock_auth_changed', checkMockUser);
    };
  }
};

export const loginUser = async (email: string, pass: string) => {
  if (auth) return signInWithEmailAndPassword(auth, email, pass);
  
  // Mock Login
  console.log("Mock Login Success");
  const mockUser = { 
    uid: 'mock-user-123', 
    email: email, 
    displayName: 'Mock Artist',
    emailVerified: true,
    isAnonymous: false,
    metadata: {},
    providerData: [],
    refreshToken: '',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({} as any),
    reload: async () => {},
    toJSON: () => ({}),
    phoneNumber: null,
    photoURL: null
  } as unknown as User;

  localStorage.setItem('mock_user', JSON.stringify(mockUser));
  window.dispatchEvent(new Event('mock_auth_changed'));
  return { user: mockUser };
};

export const registerUser = async (email: string, pass: string, name: string) => {
  if (auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential;
  }

  // Mock Register
  const mockUser = { 
    uid: 'mock-user-' + Date.now(), 
    email: email, 
    displayName: name,
    emailVerified: true
  } as unknown as User;

  localStorage.setItem('mock_user', JSON.stringify(mockUser));
  window.dispatchEvent(new Event('mock_auth_changed'));
  return { user: mockUser };
};

export const logoutUser = async () => {
  if (auth) return firebaseSignOut(auth);
  
  localStorage.removeItem('mock_user');
  window.dispatchEvent(new Event('mock_auth_changed'));
};

// --- Data Services ---

export const subscribeToBriefs = (callback: (briefs: SyncBrief[]) => void) => {
  if (!db) {
    callback(SEED_BRIEFS); // Fallback to seed data
    return () => {};
  }
  const q = query(collection(db, 'briefs'));
  return onSnapshot(q, (snapshot) => {
    const briefs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SyncBrief));
    callback(briefs);
  });
};

export const subscribeToUserTracks = (userId: string, callback: (tracks: Track[]) => void) => {
  if (!db) {
    const handler = () => {
      const dbData = getMockDb();
      // Filter tracks by this mock user ID
      const userTracks = dbData.tracks.filter((t: any) => t.userId === userId);
      callback(userTracks);
    };
    
    window.addEventListener(MOCK_EVENT, handler);
    handler(); // Initial load
    
    return () => window.removeEventListener(MOCK_EVENT, handler);
  }
  const q = query(collection(db, 'tracks'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const tracks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Track));
    callback(tracks);
  });
};

export const subscribeToUserApplications = (userId: string, callback: (apps: Application[]) => void) => {
  if (!db) {
    const handler = () => {
      const dbData = getMockDb();
      const userApps = dbData.applications.filter((a: any) => a.userId === userId);
      callback(userApps);
    };

    window.addEventListener(MOCK_EVENT, handler);
    handler(); // Initial load

    return () => window.removeEventListener(MOCK_EVENT, handler);
  }
  const q = query(collection(db, 'applications'), where('userId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
    callback(apps);
  });
};

export const uploadTrackFile = async (file: File, userId: string): Promise<string> => {
  if (!storage) {
    console.warn("Storage not configured. Returning dummy audio URL.");
    // Return a dummy audio file for testing playback
    return "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 
  }
  try {
    const storageRef = ref(storage, `tracks/${userId}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Upload failed", error);
    throw error;
  }
};

export const saveTrackMetadata = async (track: Omit<Track, 'id'>, userId: string) => {
  if (!db) {
    const dbData = getMockDb();
    const newTrack = { id: 'mock-track-' + Date.now(), ...track, userId };
    dbData.tracks.push(newTrack);
    updateMockDb(dbData);
    return newTrack;
  }
  const docRef = await addDoc(collection(db, 'tracks'), { ...track, userId });
  return { id: docRef.id, ...track };
};

export const updateTrackMetadata = async (trackId: string, updates: Partial<Track>) => {
  if (!db) {
    const dbData = getMockDb();
    const index = dbData.tracks.findIndex((t: any) => t.id === trackId);
    if (index !== -1) {
      dbData.tracks[index] = { ...dbData.tracks[index], ...updates };
      updateMockDb(dbData);
    }
    return;
  }
  await setDoc(doc(db, 'tracks', trackId), updates, { merge: true });
};

export const submitApplication = async (application: Omit<Application, 'id'>, userId: string) => {
  if (!db) {
     const dbData = getMockDb();
     const newApp = { id: 'mock-app-' + Date.now(), ...application, userId };
     dbData.applications.push(newApp);
     updateMockDb(dbData);
     return newApp.id;
  }
  const docRef = await addDoc(collection(db, 'applications'), { ...application, userId });
  return docRef.id;
};
