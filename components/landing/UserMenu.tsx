import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { isAdmin } from '../../utils/adminCheck';

interface UserMenuProps {
    onNavigateToLogin?: () => void;
    onNavigateToProfile?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onNavigateToLogin, onNavigateToProfile }) => {
    const { t } = useTranslation();
    const { user, userProfile, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleSignOut = async () => {
        try {
            await signOut();
            setIsOpen(false);
            // Reload to clear any cached state
            window.location.reload();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleLogin = () => {
        if (onNavigateToLogin) {
            onNavigateToLogin();
        } else {
            window.history.pushState({}, '', '/login');
            window.location.reload();
        }
    };

    const handleProfile = () => {
        setIsOpen(false);
        if (onNavigateToProfile) {
            onNavigateToProfile();
        } else {
            window.history.pushState({}, '', '/profile');
            window.location.reload();
        }
    };

    const handleAdminPanel = () => {
        setIsOpen(false);
        window.history.pushState({}, '', '/admin');
        window.location.reload();
    };

    const userIsAdmin = isAdmin(user?.email);

    // If not logged in, show login button
    if (!user) {
        return (
            <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-4 py-2 bg-navarra-gold/10 border border-navarra-gold/50 text-navarra-gold rounded hover:bg-navarra-gold hover:text-black transition-all duration-300 font-semibold"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">{t('auth.userMenu.signIn')}</span>
            </button>
        );
    }

    // If logged in, show avatar with dropdown
    const displayName = userProfile?.displayName || user.email?.split('@')[0] || 'Usuario';
    const photoURL = userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=D4AF37&color=000`;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-full border-2 border-navarra-gold/30 hover:border-navarra-gold transition-all duration-300 bg-black/30 hover:bg-black/50"
            >
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-navarra-gold">
                    <img
                        src={photoURL}
                        alt={displayName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span className="hidden md:inline text-navarra-parchment font-semibold">{displayName}</span>
                <svg
                    className={`w-4 h-4 text-navarra-gold transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-3rem)] bg-gradient-to-br from-gray-900 to-black border-2 border-navarra-gold rounded-lg shadow-2xl overflow-hidden z-[60] animate-fade-in">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-navarra-gold/30">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-navarra-parchment font-semibold truncate">{displayName}</p>
                            {userIsAdmin && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-navarra-gold text-black rounded uppercase tracking-wider">
                                    Admin
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Menu Options */}
                    <div className="py-2">
                        {userIsAdmin && (
                            <button
                                onClick={handleAdminPanel}
                                className="w-full px-4 py-2 text-left text-navarra-gold hover:bg-navarra-gold/10 transition-colors flex items-center gap-3 font-semibold"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Panel de Admin</span>
                            </button>
                        )}
                        <button
                            onClick={handleProfile}
                            className="w-full px-4 py-2 text-left text-navarra-parchment hover:bg-navarra-gold/10 hover:text-navarra-gold transition-colors flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>{t('auth.userMenu.profile')}</span>
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>{t('auth.userMenu.signOut')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;
