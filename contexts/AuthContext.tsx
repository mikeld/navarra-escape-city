import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { AuthContextType, UserProfile } from '../types';
import {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut as authSignOut,
    resetPassword as authResetPassword,
    onAuthStateChanged
} from '../services/authService';
import {
    createUserProfile,
    getUserProfile,
    updateUserProfile
} from '../services/userService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Load user profile from Firestore
                const profile = await getUserProfile(firebaseUser.uid);

                if (profile) {
                    setUserProfile(profile);
                } else {
                    // Create profile if it doesn't exist (e.g., first time Google login)
                    const newProfile: Partial<UserProfile> = {
                        email: firebaseUser.email || '',
                        displayName: firebaseUser.displayName || '',
                        photoURL: firebaseUser.photoURL || undefined
                    };

                    await createUserProfile(firebaseUser.uid, newProfile);
                    const createdProfile = await getUserProfile(firebaseUser.uid);
                    setUserProfile(createdProfile);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            await signInWithEmail(email, password);
            // onAuthStateChanged will handle the rest
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        setLoading(true);
        try {
            const firebaseUser = await signUpWithEmail(email, password, displayName);

            // Create user profile in Firestore
            await createUserProfile(firebaseUser.uid, {
                email: firebaseUser.email || email,
                displayName: displayName,
                photoURL: firebaseUser.photoURL || undefined
            });

            // onAuthStateChanged will handle loading the profile
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogleProvider = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            // onAuthStateChanged will handle the rest (including profile creation)
        } catch (error: any) {
            setLoading(false);
            // Re-throw if it's not a popup closed error
            if (error.message !== 'POPUP_CLOSED') {
                throw error;
            }
        }
    };

    const signOutUser = async () => {
        setLoading(true);
        try {
            await authSignOut();
            setUser(null);
            setUserProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const resetPasswordForUser = async (email: string) => {
        await authResetPassword(email);
    };

    const updateUserProfileData = async (data: Partial<UserProfile>) => {
        if (!user) throw new Error('No user logged in');

        await updateUserProfile(user.uid, data);

        // Update local state
        setUserProfile(prev => prev ? { ...prev, ...data } : null);
    };

    const value: AuthContextType = {
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle: signInWithGoogleProvider,
        signOut: signOutUser,
        resetPassword: resetPasswordForUser,
        updateUserProfileData
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
