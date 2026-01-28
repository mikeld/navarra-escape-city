
import React, { useEffect } from 'react';
import { SafeImage } from '../UIComponents';
import { PlaceWithKeys } from '../../data/places';
import { useTranslation } from 'react-i18next';

interface PlaceDetailModalProps {
    place: PlaceWithKeys | null;
    onClose: () => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({ place, onClose }) => {
    const { t } = useTranslation();

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (place) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [place, onClose]);

    if (!place) return null;

    // Helper to get extended info keys
    // place.descKey is like "places.palacio_reyes.desc"
    // We want "places.palacio_reyes.history"
    const baseKey = place.descKey.replace('.desc', '');
    const historyKey = `${baseKey}.history`;
    const curiositiesKey = `${baseKey}.curiosities`;
    const architectureKey = `${baseKey}.architecture`;

    // Check if this place has extended information
    const hasHistory = t(historyKey, { defaultValue: '' }) !== '';
    const hasCuriosities = t(curiositiesKey, { defaultValue: '' }) !== '';
    const hasArchitecture = t(architectureKey, { defaultValue: '' }) !== '';
    const hasExtendedInfo = hasHistory || hasCuriosities || hasArchitecture;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>

            {/* Modal Content */}
            <div
                className="relative bg-gradient-to-br from-navarra-dark to-navarra-panel border-2 border-navarra-gold/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(212,175,55,0.3)] animate-scale-in flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button - Moved outside overflow container or fixed z-index context */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/60 hover:bg-navarra-gold/20 border border-navarra-gold/30 hover:border-navarra-gold rounded-full flex items-center justify-center transition-all duration-300 group shadow-lg"
                    aria-label={t('common.close', { defaultValue: 'Cerrar' })}
                >
                    <svg className="w-6 h-6 text-navarra-gold group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Image Header */}
                <div className="relative h-64 md:h-80 shrink-0 overflow-hidden rounded-t-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-navarra-dark via-transparent to-transparent z-10"></div>
                    <SafeImage
                        src={place.image}
                        alt={t(place.nameKey)}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 space-y-8">
                    {/* Title */}
                    <div className="space-y-3">
                        <div className="inline-block px-3 py-1 bg-navarra-gold/10 border border-navarra-gold/30 rounded-full">
                            <span className="text-navarra-gold text-xs uppercase tracking-widest font-bold">
                                {place.category}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-serif text-white font-bold">
                            {t(place.nameKey)}
                        </h2>
                    </div>

                    {/* Brief Description */}
                    <div className="border-l-4 border-navarra-gold/50 pl-6">
                        <p className="text-gray-300 text-lg leading-relaxed font-light">
                            {t(place.descKey)}
                        </p>
                    </div>

                    {/* Extended Information */}
                    {hasExtendedInfo ? (
                        <div className="space-y-8 pt-6 border-t border-navarra-gold/20">
                            {/* History Section */}
                            {hasHistory && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-navarra-gold/10 rounded-lg">
                                            <svg className="w-6 h-6 text-navarra-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-serif text-navarra-gold font-bold">
                                            {t('placeDetail.history', { defaultValue: 'Historia' })}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-base">
                                        {t(historyKey)}
                                    </p>
                                </div>
                            )}

                            {/* Curiosities Section */}
                            {hasCuriosities && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-navarra-gold/10 rounded-lg">
                                            <svg className="w-6 h-6 text-navarra-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-serif text-navarra-gold font-bold">
                                            {t('placeDetail.curiosities', { defaultValue: 'Curiosidades' })}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-base">
                                        {t(curiositiesKey)}
                                    </p>
                                </div>
                            )}

                            {/* Architecture Section */}
                            {hasArchitecture && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-navarra-gold/10 rounded-lg">
                                            <svg className="w-6 h-6 text-navarra-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-serif text-navarra-gold font-bold">
                                            {t('placeDetail.architecture', { defaultValue: 'Arquitectura' })}
                                        </h3>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed text-base">
                                        {t(architectureKey)}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 border-t border-navarra-gold/20">
                            <p className="text-gray-500 italic">
                                {t('placeDetail.noExtendedInfo', { defaultValue: 'Más información próximamente...' })}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
