import { UserProfile, UserGameProgress, UserEnigmaProgress } from '../types';
import { db, storage } from '../firebaseConfig';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Re-export types for convenience
export type { UserGameProgress, UserEnigmaProgress };

/**
 * User Service
 * Manages user profiles and game progress in Firestore
 */

// Create user profile in Firestore
export const createUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const userProfile: UserProfile = {
            uid: userId,
            email: data.email || '',
            displayName: data.displayName || '',
            photoURL: data.photoURL,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Filter out undefined values (Firestore doesn't accept undefined)
        const cleanedProfile = Object.fromEntries(
            Object.entries(userProfile).filter(([_, value]) => value !== undefined)
        );

        await setDoc(doc(db, 'users', userId), cleanedProfile);
    } catch (error: any) {
        console.error('Error creating user profile:', error);
        throw new Error('No se pudo crear el perfil de usuario');
    }
};

// Get user profile from Firestore
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!db) return null;

    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error: any) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

// Update user profile
export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<void> => {
    if (!db) throw new Error('Firestore not initialized');

    try {
        const docRef = doc(db, 'users', userId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        throw new Error('No se pudo actualizar el perfil');
    }
};

// Upload profile image to Storage
export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
    if (!storage) throw new Error('Storage not initialized');

    try {
        // Create a reference to the profile image
        const storageRef = ref(storage, `profiles/${userId}/avatar_${Date.now()}`);

        // Upload the file
        await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);

        // Update user profile with new photo URL
        await updateUserProfile(userId, { photoURL: downloadURL });

        return downloadURL;
    } catch (error: any) {
        console.error('Error uploading profile image:', error);
        throw new Error('No se pudo subir la imagen');
    }
};

// Save game progress for user
export const saveGameProgressForUser = async (
    userId: string,
    gameId: string,
    progress: Partial<UserGameProgress>
): Promise<void> => {
    if (!db) return;

    try {
        const progressRef = doc(db, 'users', userId, 'gameProgress', gameId);
        const existingProgress = await getDoc(progressRef);

        const gameProgress: UserGameProgress = {
            gameId,
            currentStageIndex: progress.currentStageIndex || 0,
            isCompleted: progress.isCompleted || false,
            bestScore: progress.bestScore,
            lastPlayed: new Date().toISOString(),
            hintsUsed: progress.hintsUsed || 0,
            mistakesMade: progress.mistakesMade || 0,
            completedAt: progress.completedAt
        };

        // If game is completed and we have a score, update best score
        if (existingProgress.exists()) {
            const existing = existingProgress.data() as UserGameProgress;
            if (existing.bestScore && gameProgress.bestScore) {
                gameProgress.bestScore = Math.max(existing.bestScore, gameProgress.bestScore);
            }
        }

        await setDoc(progressRef, gameProgress, { merge: true });
    } catch (error: any) {
        console.error('Error saving game progress:', error);
    }
};

// Get user's game progress
export const getUserGameProgress = async (userId: string): Promise<UserGameProgress[]> => {
    if (!db) return [];

    try {
        const progressCollection = collection(db, 'users', userId, 'gameProgress');
        const querySnapshot = await getDocs(progressCollection);

        const progress: UserGameProgress[] = [];
        querySnapshot.forEach((doc) => {
            progress.push(doc.data() as UserGameProgress);
        });

        return progress;
    } catch (error: any) {
        console.error('Error getting game progress:', error);
        return [];
    }
};

// Mark enigma as completed
export const markEnigmaCompleted = async (userId: string, enigmaId: string): Promise<void> => {
    if (!db) return;

    try {
        const enigmaRef = doc(db, 'users', userId, 'enigmasCompleted', enigmaId);
        const enigmaData: UserEnigmaProgress = {
            enigmaId,
            completedAt: new Date().toISOString()
        };

        await setDoc(enigmaRef, enigmaData);
    } catch (error: any) {
        console.error('Error marking enigma as completed:', error);
    }
};

// Get user's completed enigmas
export const getUserEnigmasCompleted = async (userId: string): Promise<UserEnigmaProgress[]> => {
    if (!db) return [];

    try {
        const enigmasCollection = collection(db, 'users', userId, 'enigmasCompleted');
        const querySnapshot = await getDocs(enigmasCollection);

        const enigmas: UserEnigmaProgress[] = [];
        querySnapshot.forEach((doc) => {
            enigmas.push(doc.data() as UserEnigmaProgress);
        });

        return enigmas;
    } catch (error: any) {
        console.error('Error getting completed enigmas:', error);
        return [];
    }
};

// Get user's game completions from the main completions collection
export const getUserCompletions = async (userId: string): Promise<any[]> => {
    if (!db) return [];

    try {
        const completionsRef = collection(db, 'completions');
        const q = query(
            completionsRef,
            where('userId', '==', userId)
        );
        const querySnapshot = await getDocs(q);

        const completions: any[] = [];
        querySnapshot.forEach((doc) => {
            completions.push({ id: doc.id, ...doc.data() });
        });

        // Sort client-side to avoid composite index requirement
        completions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return completions;
    } catch (error: any) {
        console.error('Error getting user completions:', error);
        return [];
    }
};

// Check if an enigma is completed by user
export const isEnigmaCompleted = async (userId: string, enigmaId: string): Promise<boolean> => {
    if (!db) return false;

    try {
        const enigmaRef = doc(db, 'users', userId, 'enigmasCompleted', enigmaId);
        const enigmaSnap = await getDoc(enigmaRef);
        return enigmaSnap.exists();
    } catch (error: any) {
        console.error('Error checking enigma completion:', error);
        return false;
    }
};
