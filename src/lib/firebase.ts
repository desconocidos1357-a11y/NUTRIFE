import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { Recipe } from '../types';
import { defaultRecipesData } from '../data/defaultRecipes';

// Firebase configuration. We try to read from potential environment variables or config.
// In the AI Studio workspace, it may inject configuration directly.
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || "",
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || ""
};

let app;
let db: any = null;
let auth: any = null;
let isFirebaseEnabled = false;

// Check if we have at least apiKey and projectId to attempt initialization
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseEnabled = true;
    console.log("NutriFe: Firebase initialized successfully!");
  } catch (error) {
    console.warn("NutriFe: Firebase initialization failed. Falling back to Local Database.", error);
    isFirebaseEnabled = false;
  }
} else {
  console.log("NutriFe: No Firebase config found. Using high-fidelity Local Storage database.");
}

// Ensure the local storage has initial recipes if empty
const LOCAL_STORAGE_KEY = 'nutrife_recipes_v1';
const LOCAL_FAVORITES_KEY = 'nutrife_favorites_v1';

export function initializeLocalDb() {
  const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultRecipesData));
  }
}

// Local Database Helpers
export function getLocalRecipes(): Recipe[] {
  initializeLocalDb();
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : defaultRecipesData;
}

export function saveLocalRecipes(recipes: Recipe[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recipes));
}

// Unified API for Recipes
export async function fetchAllRecipes(): Promise<Recipe[]> {
  if (isFirebaseEnabled && db) {
    try {
      // Test firestore connection first as requested in skill
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (connErr) {
        console.warn("Testing connection failed, reading from local DB or network cache...");
      }

      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const fbRecipes: Recipe[] = [];
      querySnapshot.forEach((doc) => {
        fbRecipes.push({ id: doc.id, ...doc.data() } as Recipe);
      });

      if (fbRecipes.length > 0) {
        // Cache in local storage too
        saveLocalRecipes(fbRecipes);
        return fbRecipes;
      }
    } catch (error) {
      console.error("Error reading from Firestore, using local fallback", error);
    }
  }
  return getLocalRecipes();
}

export async function addRecipeToDb(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
  const newId = 'recipe_' + Date.now();
  const newRecipe: Recipe = { ...recipe, id: newId, isCustom: true };

  if (isFirebaseEnabled && db) {
    try {
      const docRef = await addDoc(collection(db, 'recipes'), recipe);
      const created = { ...recipe, id: docRef.id, isCustom: true };
      // Sync local too
      const local = getLocalRecipes();
      local.push(created);
      saveLocalRecipes(local);
      return created;
    } catch (error) {
      console.error("Error saving to Firestore, saving locally instead", error);
    }
  }

  const local = getLocalRecipes();
  local.push(newRecipe);
  saveLocalRecipes(local);
  return newRecipe;
}

export async function updateRecipeInDb(id: string, updatedFields: Partial<Omit<Recipe, 'id'>>): Promise<boolean> {
  let success = false;

  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, 'recipes', id);
      await updateDoc(docRef, updatedFields);
      success = true;
    } catch (error) {
      console.error("Error updating Firestore, updating locally", error);
    }
  }

  // Update local
  const local = getLocalRecipes();
  const index = local.findIndex(r => r.id === id);
  if (index !== -1) {
    local[index] = { ...local[index], ...updatedFields };
    saveLocalRecipes(local);
    success = true;
  }
  return success;
}

export async function deleteRecipeFromDb(id: string): Promise<boolean> {
  let success = false;

  if (isFirebaseEnabled && db) {
    try {
      const docRef = doc(db, 'recipes', id);
      await deleteDoc(docRef);
      success = true;
    } catch (error) {
      console.error("Error deleting from Firestore, deleting locally", error);
    }
  }

  // Delete local
  const local = getLocalRecipes();
  const filtered = local.filter(r => r.id !== id);
  saveLocalRecipes(filtered);
  success = true;
  return success;
}

// Unified API for Favorites (Stored client-side, since parents do not need login)
export function getFavorites(): string[] {
  const data = localStorage.getItem(LOCAL_FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

export function toggleFavoriteInLocal(recipeId: string): string[] {
  const favs = getFavorites();
  const index = favs.indexOf(recipeId);
  if (index === -1) {
    favs.push(recipeId);
  } else {
    favs.splice(index, 1);
  }
  localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favs));
  return favs;
}

// Admin Authentication
// We support both a fallback local admin credentials (standard for single developer/app demo)
// and Firebase Auth if active.
const LOCAL_ADMIN_EMAIL = "admin@nutrife.com";
const LOCAL_ADMIN_PASS = "admin123";

// Store simple session in local storage for local admin fallback
const LOCAL_SESSION_KEY = 'nutrife_admin_logged_in';

export async function signInAdmin(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseEnabled && auth) {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Fallback local login
  if (email.toLowerCase() === LOCAL_ADMIN_EMAIL && pass === LOCAL_ADMIN_PASS) {
    localStorage.setItem(LOCAL_SESSION_KEY, 'true');
    return { success: true };
  }
  return { success: false, error: "Credenciales de administrador inválidas. Pruebe con admin@nutrife.com / admin123" };
}

export async function signOutAdmin(): Promise<void> {
  if (isFirebaseEnabled && auth) {
    await firebaseSignOut(auth);
  }
  localStorage.removeItem(LOCAL_SESSION_KEY);
}

export function subscribeToAuth(callback: (isAdmin: boolean, email?: string) => void): () => void {
  if (isFirebaseEnabled && auth) {
    return onAuthStateChanged(auth, (user: User | null) => {
      callback(!!user, user?.email || undefined);
    });
  }

  // Local fallback subscription: triggers immediately with current status
  const checkStatus = () => {
    const loggedIn = localStorage.getItem(LOCAL_SESSION_KEY) === 'true';
    callback(loggedIn, loggedIn ? LOCAL_ADMIN_EMAIL : undefined);
  };
  checkStatus();
  
  // Custom polling/event checking since there is no standard listener for localStorage
  const interval = setInterval(checkStatus, 1500);
  return () => clearInterval(interval);
}

export function isFirebaseConfigured() {
  return isFirebaseEnabled;
}
