
import React, { useState, useEffect } from 'react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import UserMenu from './UserMenu';

interface HeaderProps {
    onNavigateToLogin: () => void;
    onNavigateToProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToLogin, onNavigateToProfile }) => {

    const [scrolled, setScrolled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [scrolled]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'py-3 bg-black/90 backdrop-blur-md border-b border-navarra-gold/30 shadow-lg'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Optional: Add Logo here if scrolled down for better branding */}
                <div className={`transition-opacity duration-300 ${scrolled ? 'opacity-100' : 'opacity-0'} hidden md:block`}>
                    <span className="text-navarra-gold font-serif font-bold text-lg tracking-widest">Navarra</span>
                </div>

                {/* Right Side: Lang Switcher & User Menu */}
                <div className="flex items-center gap-4 ml-auto">
                    {deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="bg-navarra-gold/20 hover:bg-navarra-gold text-navarra-gold hover:text-black border border-navarra-gold px-3 py-1 rounded text-xs uppercase font-bold tracking-widest transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)] animate-pulse"
                        >
                            Instalar App
                        </button>
                    )}
                    <LanguageSwitcher />
                    {/* <UserMenu
                        onNavigateToLogin={onNavigateToLogin}
                        onNavigateToProfile={onNavigateToProfile}
                    /> */}
                </div>
            </div>
        </header>
    );
};

export default Header;
