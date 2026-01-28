import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const NewsletterSignup: React.FC = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setErrorMessage('');

        // Basic validation
        if (!name.trim() || !email.trim() || !email.includes('@')) {
            setStatus('ERROR');
            setErrorMessage('Por favor, introduce un nombre y un email válido.'); // Fallback if translation missing
            return;
        }

        try {
            await addDoc(collection(db, 'newsletter'), {
                name: name.trim(),
                email: email.trim(),
                createdAt: serverTimestamp(),
                source: 'home_view',
                language: navigator.language || 'es'
            });
            setStatus('SUCCESS');
            setName('');
            setEmail('');
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus('ERROR');
            setErrorMessage(t('newsletter.error', 'Ha ocurrido un error. Inténtalo de nuevo.'));
        }
    };

    return (
        <section className="py-16 px-6 bg-navarra-dark border-t border-navarra-gold/30">
            <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                    <span className="text-navarra-gold text-xs uppercase tracking-[0.2em] font-bold border-b border-navarra-gold/30 pb-1">
                        {t('newsletter.tag', 'Novedades')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mt-4 mb-3">
                        {t('newsletter.title', 'Únete a la Aventura')}
                    </h2>
                    <p className="text-gray-400 font-light max-w-2xl mx-auto">
                        {t('newsletter.description', 'Déjanos tu nombre y correo para ser el primero en enterarte de nuevas misiones, juegos y secretos de Navarra.')}
                    </p>
                </div>

                {status === 'SUCCESS' ? (
                    <div className="bg-navarra-gold/10 border border-navarra-gold p-8 rounded-lg animate-fade-in">
                        <svg className="w-16 h-16 text-navarra-gold mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl text-white font-serif font-bold mb-2">
                            {t('newsletter.successTitle', '¡Gracias por apuntarte!')}
                        </h3>
                        <p className="text-gray-300">
                            {t('newsletter.successMessage', 'Te avisaremos cuando haya novedades.')}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-navarra-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('newsletter.namePlaceholder', 'Tu Nombre')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md leading-5 bg-black/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-navarra-gold focus:ring-1 focus:ring-navarra-gold sm:text-sm transition-colors"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500 group-focus-within:text-navarra-gold transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('newsletter.emailPlaceholder', 'Tu Email')}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-md leading-5 bg-black/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-navarra-gold focus:ring-1 focus:ring-navarra-gold sm:text-sm transition-colors"
                            />
                        </div>

                        {status === 'ERROR' && (
                            <p className="text-red-400 text-sm">{errorMessage || t('newsletter.genericError', 'Error al enviar. Verifica tus datos.')}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'LOADING'}
                            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-bold uppercase tracking-widest rounded-md text-black bg-navarra-gold hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navarra-gold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
                        >
                            {status === 'LOADING' ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {t('newsletter.subscribe', 'Suscribirme')}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};
