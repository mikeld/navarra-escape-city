import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    updateProfile,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from '../firebaseConfig';

/**
 * Authentication Service
 * Provides Firebase Authentication methods for the app
 */

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<User> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, { displayName });

        return user;
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
    } catch (error: any) {
        // If user closes popup, don't show error
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
            throw new Error('POPUP_CLOSED');
        }
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Sign out
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Update user profile (display name and photo URL)
export const updateUserProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
    if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
    }

    try {
        const updates: { displayName?: string; photoURL?: string } = {};
        if (displayName !== undefined) updates.displayName = displayName;
        if (photoURL !== undefined) updates.photoURL = photoURL;

        await updateProfile(auth.currentUser, updates);
    } catch (error: any) {
        throw new Error(getAuthErrorMessage(error.code));
    }
};

// Auth state observer
export const onAuthStateChanged = (callback: (user: User | null) => void) => {
    return firebaseOnAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

// Helper function to translate Firebase error codes to user-friendly messages
const getAuthErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'Este email ya está registrado',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
        'auth/user-not-found': 'No existe una cuenta con este email',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-credential': 'Credenciales inválidas',
        'auth/too-many-requests': 'Demasiados intentos. Por favor, intenta más tarde',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
        'auth/popup-blocked': 'El popup fue bloqueado. Por favor, habilita popups para este sitio',
        'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email usando otro método de login'
    };

    return errorMessages[errorCode] || 'Error de autenticación: ' + errorCode;
};

// Email validation helper
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    message: string;
} => {
    if (password.length < 6) {
        return { isValid: false, strength: 'weak', message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score >= 3) strength = 'strong';
    else if (score >= 2) strength = 'medium';

    const messages = {
        weak: 'Contraseña débil',
        medium: 'Contraseña media',
        strong: 'Contraseña fuerte'
    };

    return { isValid: true, strength, message: messages[strength] };
};
