
import { GameState, PuzzleData, Character, Place, GameFeedback } from '../types';
import { db, storage, analytics, auth } from '../firebaseConfig';
import { doc, getDoc, setDoc, writeBatch, updateDoc, collection, getDocs, addDoc, query, orderBy, limit } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logEvent } from "firebase/analytics";
import { PUZZLES, CHARACTERS, FRAGMENTS, PLACES_INFO } from '../constants';
import { PlaceWithKeys } from '../data/places';

// Analytics Helper
export const logGameEvent = (eventName: string, params?: { [key: string]: any }) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

const INITIAL_STATE: GameState = {
  currentStageIndex: 0,
  isGameStarted: false,
  isGameFinished: false,
  inventory: [],
  showDialogue: true,
  hintsUsed: 0,
  mistakesMade: 0,
};

// Helper to get or create a persistent User ID
export const getUserId = (): string => {
  let uid = localStorage.getItem('estella_user_id');
  if (!uid) {
    uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('estella_user_id', uid);
  }
  return uid;
};

export const setUserId = (id: string) => {
  if (id && id.length > 5) {
    localStorage.setItem('estella_user_id', id);
  }
};

// --- GEO FENCING HELPERS ---

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
};

// --- FUNCIONES DE BASE DE DATOS (ADMIN & CONTENT) ---

export const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  if (!db) {
    return { success: false, message: "Error: Firebase no está configurado." };
  }

  try {
    const batch = writeBatch(db);

    // 1. Subir Puzzles
    PUZZLES.forEach((puzzle) => {
      // Usamos { merge: true } para no sobrescribir las imágenes si ya las has subido manualmente
      const ref = doc(db, "puzzles", puzzle.id);
      batch.set(ref, puzzle, { merge: true });
    });

    // 2. Subir Personajes (Merge para respetar fotos subidas)
    Object.values(CHARACTERS).forEach((char) => {
      const ref = doc(db, "characters", char.id);
      batch.set(ref, char, { merge: true });
    });

    // 3. Subir Lugares (Places)
    PLACES_INFO.forEach((place) => {
      const ref = doc(db, "places", place.id);
      batch.set(ref, place, { merge: true });
    });

    // 4. Subir Fragmentos
    FRAGMENTS.forEach((frag) => {
      const ref = doc(db, "fragments", frag.id.toString());
      batch.set(ref, frag, { merge: true });
    });

    await batch.commit();
    console.log("Base de datos sincronizada correctamente");
    return {
      success: true,
      message: "✅ Base de datos sincronizada. Se han respetado las imágenes personalizadas si existían."
    };
  } catch (error: any) {
    console.error("Error al subir datos:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, message: "❌ Error al sincronizar: " + errorMessage };
  }
};

// Nueva función para subir imágenes a Storage (DESACTIVADA por facturación)
export const uploadAsset = async (
  file: File,
  folder: 'characters' | 'places' | 'resources',
  id: string
): Promise<{ success: boolean; url?: string; message: string }> => {
  return { success: false, message: "Storage desactivado. Usa la carpeta public/assets local." };
};

// Obtener configuración de recursos (video/audio)
export const fetchResourceConfig = async () => {
  if (!db) return {};
  try {
    const docRef = doc(db, "config", "resources");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  } catch (e) {
    return {};
  }
}

// In-memory cache for storage URLs to prevent redundant network calls
const urlCache: Record<string, string> = {};

// Obtener URL de Storage (MODIFICADA: devuelve el path local)
export const getStorageUrl = async (path: string): Promise<string | null> => {
  // Devolvemos el path tal cual, asumiendo que es una ruta local en /public
  // O podemos prefijarla si es necesario.
  if (path.startsWith('assets/')) return '/' + path;
  return path;
};

// Función para obtener datos dinámicos (Personajes y Lugares con fotos actualizadas)
export const fetchDynamicContent = async () => {
  // Inicializamos con los datos locales para asegurar que los nuevos personajes siempre estén
  const characterMap: Record<string, Character> = { ...CHARACTERS };
  const placeMap: Record<string, PlaceWithKeys> = {};
  PLACES_INFO.forEach(p => placeMap[p.id] = p);

  if (db) {
    try {
      // Fetch Characters and MERGE with local (don't replace)
      const charSnapshot = await getDocs(collection(db, "characters"));
      charSnapshot.forEach(doc => {
        const data = doc.data() as Character;
        // Sobrescribir datos locales con los de DB (para tener imágenes actualizadas)
        // pero manteniendo los locales que no estén en DB (para los nuevos como Ordoiz)
        characterMap[data.id] = data;
      });

      // Fetch Places - preserve translation keys from PLACES_INFO
      const placeSnapshot = await getDocs(collection(db, "places"));
      placeSnapshot.forEach(doc => {
        const data = doc.data() as Place;
        // Merge with local data to preserve nameKey and descKey
        const localPlace = PLACES_INFO.find(p => p.id === data.id);
        if (localPlace) {
          placeMap[data.id] = { ...localPlace, ...data };
        } else {
          // If no local place, use data from DB but might be missing translation keys
          placeMap[data.id] = data as PlaceWithKeys;
        }
      });

    } catch (error) {
      console.error("Error fetching dynamic content, using static fallback", error);
    }
  }

  let finalCharacters = Object.values(characterMap);
  let finalPlaces = Object.values(placeMap);

  // Resolver URLs de Storage (para estáticos o dinámicos)
  const processedCharacters = await Promise.all(finalCharacters.map(async (char) => {
    if (char.storageUrl) {
      const url = await getStorageUrl(char.storageUrl);
      if (url) return { ...char, image: url };
    }
    return char;
  }));

  const processedPlaces = await Promise.all(finalPlaces.map(async (place) => {
    if (place.storageUrl) {
      const url = await getStorageUrl(place.storageUrl);
      if (url) return { ...place, image: url };
    }
    return place;
  }));

  // Filter out any places that don't have enough data to be displayed AND check if they are valid known places
  const knownIds = new Set(PLACES_INFO.map(p => p.id));

  const validPlaces = processedPlaces.filter(p => {
    // 1. Must be a known place ID (prevents ghost entries from DB like 'palacio' or 'puente')
    if (!knownIds.has(p.id)) return false;

    // 2. Must have minimal data
    const hasImage = p.image && p.image.length > 0;
    const hasName = p.name && p.name.trim().length > 0;
    const hasKey = (p as PlaceWithKeys).nameKey && (p as PlaceWithKeys).nameKey.trim().length > 0;

    return hasImage && (hasName || hasKey);
  });

  return { characters: processedCharacters, places: validPlaces };
};


// --- GESTIÓN DEL ESTADO DEL JUEGO ---

export const getLocalState = (): GameState => {
  const userId = getUserId();
  const localSaved = localStorage.getItem(`estella_backup_${userId}`);
  return localSaved ? JSON.parse(localSaved) : INITIAL_STATE;
};

export const getSavedState = async (): Promise<GameState> => {
  const userId = getUserId();

  // If user is authenticated, load from their user-specific game progress
  if (auth.currentUser) {
    try {
      if (db) {
        // Try to load from user's subcollection first (gameProgress/elgacena)
        const progressRef = doc(db, 'users', auth.currentUser.uid, 'gameProgress', 'elgacena');
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
          const data = progressSnap.data();
          // Convert UserGameProgress to GameState
          const gameState: GameState = {
            currentStageIndex: data.currentStageIndex || 0,
            isGameStarted: false,
            isGameFinished: data.isCompleted || false,
            inventory: [],
            showDialogue: true,
            hintsUsed: data.hintsUsed || 0,
            mistakesMade: data.mistakesMade || 0,
            startTime: Date.now()
          };

          // Cache to localStorage
          localStorage.setItem(`estella_backup_${userId}`, JSON.stringify(gameState));
          return gameState;
        }
      }
    } catch (e) {
      console.warn("Error loading from user's Firestore, falling back to localStorage", e);
    }
  }

  // Fallback to localStorage (for anonymous users or if Firestore fails)
  const localSaved = localStorage.getItem(`estella_backup_${userId}`);

  // Legacy: Try old games collection (for migration)
  try {
    if (db) {
      const docRef = doc(db, "games", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudState = docSnap.data() as GameState;
        localStorage.setItem(`estella_backup_${userId}`, JSON.stringify(cloudState));
        return cloudState;
      }
    }
  } catch (e) {
    console.warn("No se pudo conectar con Firestore para cargar, usando local.", e);
  }

  return localSaved ? JSON.parse(localSaved) : INITIAL_STATE;
};

export const saveState = async (state: GameState, gameId: string = 'elgacena') => {
  const userId = getUserId();
  // Always save to localStorage as backup
  localStorage.setItem(`estella_backup_${userId}`, JSON.stringify(state));

  // If user is authenticated, save to their user-specific progress
  if (auth.currentUser && db) {
    try {
      const progressRef = doc(db, 'users', auth.currentUser.uid, 'gameProgress', gameId);

      // Save as UserGameProgress format
      const progressData = {
        gameId,
        currentStageIndex: state.currentStageIndex,
        isCompleted: state.isGameFinished,
        lastPlayed: new Date().toISOString(),
        hintsUsed: state.hintsUsed,
        mistakesMade: state.mistakesMade,
        bestScore: undefined // Will be set on completion
      };

      await setDoc(progressRef, progressData, { merge: true });
    } catch (error) {
      console.error("Error saving to user's Firestore:", error);
    }
  }

  // Legacy: Also save to old games collection for backward compatibility
  if (db) {
    try {
      const docRef = doc(db, "games", userId);
      setDoc(docRef, state, { merge: true }).catch(e => console.error("Error background save:", e));
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  }
};

export const saveGameCompletion = async (name: string, timeElapsed: number, score: number, hintsUsed: number, mistakesMade: number, gameId: string = 'elgacena'): Promise<string | null> => {
  if (!db) return null;
  try {
    // Prepare completion data
    const completionData: any = {
      gameId: gameId,
      name: name,
      date: new Date().toISOString(),
      timeElapsed: timeElapsed,
      score: score,
      hintsUsed: hintsUsed,
      mistakesMade: mistakesMade,
      platform: navigator.userAgent
    };

    // Add userId if user is authenticated
    if (auth.currentUser) {
      completionData.userId = auth.currentUser.uid;

      // Also update user's game progress to mark as completed with best score
      try {
        const progressRef = doc(db, 'users', auth.currentUser.uid, 'gameProgress', gameId);
        const progressSnap = await getDoc(progressRef);

        let bestScore = score;
        if (progressSnap.exists()) {
          const existing = progressSnap.data();
          bestScore = existing.bestScore ? Math.max(existing.bestScore, score) : score;
        }

        await setDoc(progressRef, {
          gameId,
          currentStageIndex: 0, // Reset for replay
          isCompleted: true,
          completedAt: new Date().toISOString(),
          lastPlayed: new Date().toISOString(),
          bestScore: bestScore,
          hintsUsed,
          mistakesMade
        }, { merge: true });
      } catch (e) {
        console.error("Error updating user progress:", e);
      }
    }

    const docRef = await addDoc(collection(db, "completions"), completionData);
    console.log("Completion saved with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving completion", e);
    return null;
  }
};

export const updateGameCompletionPlayer = async (docId: string, name: string) => {
  if (!db || !docId) return;
  try {
    const docRef = doc(db, "completions", docId);
    await updateDoc(docRef, { name: name });
    console.log("Completion user updated:", name);
  } catch (e) {
    console.error("Error updating completion user", e);
  }
};

export const saveGameFeedback = async (feedback: GameFeedback) => {
  if (!db) return;
  try {
    await addDoc(collection(db, "feedback"), feedback);
  } catch (e) {
    console.error("Error saving feedback", e);
  }
};

// Nueva función para obtener reseñas (para futura implementación en UI)
export const getTopReviews = async (limitCount: number = 5): Promise<GameFeedback[]> => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "feedback"),
      orderBy("rating", "desc"),
      orderBy("date", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const reviews: GameFeedback[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push(doc.data() as GameFeedback);
    });
    return reviews;
  } catch (e) {
    console.error("Error fetching reviews", e);
    return [];
  }
}

export const resetGame = async (): Promise<GameState> => {
  const userId = getUserId();

  localStorage.setItem(`estella_backup_${userId}`, JSON.stringify(INITIAL_STATE));

  if (db) {
    try {
      const docRef = doc(db, "games", userId);
      await setDoc(docRef, INITIAL_STATE);
    } catch (e) {
      console.error("Error resetting DB", e);
    }
  }

  return INITIAL_STATE;
};

export const checkAnswer = (puzzle: PuzzleData, input: any): boolean => {
  if (puzzle.type === 'SELECT_MULTI') {
    const correct = puzzle.correctAnswer as string[];
    const user = input as string[];
    if (!user || correct.length !== user.length) return false;
    return correct.every(c => user.includes(c));
  }

  if (puzzle.type === 'COIN_BALANCE') {
    return input.toString() === puzzle.correctAnswer.toString();
  }

  if (puzzle.type === 'CONSTELLATION') {
    const correct = puzzle.correctAnswer as string[];
    const user = input as string[];
    if (!user) return false;
    return correct.every(c => user.includes(c)) && user.length === correct.length;
  }

  if (!input) return false;
  return input.toString().toLowerCase().trim() === puzzle.correctAnswer.toString().toLowerCase();
};
