
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp, limit } from 'firebase/firestore';

export interface Memory {
    id: string;
    title: string;
    protagonist: string;
    description: string;
    youtubeUrl: string;
    createdAt: Timestamp;
}

const COLLECTION_NAME = 'memories';

export const getMemories = async (): Promise<Memory[]> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Memory));
    } catch (error) {
        console.error("Error getting memories:", error);
        throw error;
    }
};

export const checkHasMemories = async (): Promise<boolean> => {
    try {
        const q = query(collection(db, COLLECTION_NAME), limit(1));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        console.error("Error checking memories:", error);
        return false;
    }
};

export const addMemory = async (memory: Omit<Memory, 'id' | 'createdAt'>): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...memory,
            createdAt: Timestamp.now()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding memory:", error);
        throw error;
    }
};

export const updateMemory = async (id: string, memory: Partial<Omit<Memory, 'id' | 'createdAt'>>): Promise<void> => {
    try {
        const memoryRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(memoryRef, memory);
    } catch (error) {
        console.error("Error updating memory:", error);
        throw error;
    }
};

export const deleteMemory = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error("Error deleting memory:", error);
        throw error;
    }
};
