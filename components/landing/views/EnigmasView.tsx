import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ENIGMAS } from '../../../data/enigmas';
import { Enigma } from '../../../types';
import { EnigmaDetailModal } from '../EnigmaDetailModal';

interface EnigmasViewProps {
    onBack: () => void;
}

export const EnigmasView: React.FC<EnigmasViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [selectedEnigma, setSelectedEnigma] = useState<Enigma | null>(null);

    // Check URL for direct enigma access (e.g., /enigmas/1)
    React.useEffect(() => {
        const path = window.location.pathname;
        const match = path.match(/\/enigmas\/(\d+)/);
        if (match) {
            const enigmaNumber = parseInt(match[1]);
            const enigma = ENIGMAS.find(e => e.number === enigmaNumber);
            if (enigma) {
                setSelectedEnigma(enigma);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-navarra-dark text-white">
            {/* Header */}
            <div className="relative bg-gradient-to-b from-black to-navarra-dark border-b border-navarra-gold/30">
                <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                    {/* Back Button */}
                    <button
                        onClick={onBack}
                        className="mb-8 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-bold uppercase tracking-wider text-sm">{t('common.backToHome')}</span>
                    </button>

                    {/* Title Section */}
                    <div className="text-center">
                        <span className="text-navarra-gold/60 text-xs uppercase tracking-[0.3em] font-bold border-b border-navarra-gold/30 pb-1">
                            {t('enigmas.viewTag')}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mt-4 mb-4">
                            {t('enigmas.viewTitle')}
                        </h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-navarra-gold to-transparent mx-auto mb-6"></div>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t('enigmas.viewSubtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Enigmas Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ENIGMAS.map((enigma) => (
                        <div
                            key={enigma.id}
                            className="group relative bg-gradient-to-br from-navarra-panel to-navarra-dark border-2 border-navarra-gold/30 rounded-xl overflow-hidden hover:border-navarra-gold transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] hover:-translate-y-2"
                        >
                            {/* Card Header */}
                            <div className="p-6 border-b border-navarra-gold/20">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="px-3 py-1 bg-navarra-gold/20 rounded-full">
                                        <span className="text-navarra-gold text-xs font-bold uppercase tracking-widest">
                                            Enigma #{enigma.number}
                                        </span>
                                    </div>
                                    {enigma.publishDate && (
                                        <span className="text-gray-500 text-xs">
                                            {new Date(enigma.publishDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-serif font-bold text-white group-hover:text-navarra-gold transition-colors line-clamp-2">
                                    {t(enigma.title)}
                                </h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-6">
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {t(enigma.description)}
                                </p>

                                {/* Solve Button */}
                                <button
                                    onClick={() => {
                                        setSelectedEnigma(enigma);
                                        // Update URL for shareable link
                                        window.history.pushState({}, '', `/enigmas/${enigma.number}`);
                                    }}
                                    className="w-full bg-navarra-gold hover:bg-navarra-gold/80 text-navarra-dark font-bold py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm flex items-center justify-center gap-2 group-hover:scale-105"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t('enigmas.solveButton')}
                                </button>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-full h-full text-navarra-gold" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (if no enigmas) */}
                {ENIGMAS.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🧩</div>
                        <h3 className="text-2xl font-serif text-gray-400 mb-2">
                            No hay enigmas disponibles
                        </h3>
                        <p className="text-gray-500">
                            Pronto habrá nuevos desafíos para resolver
                        </p>
                    </div>
                )}
            </div>

            {/* Enigma Detail Modal */}
            {selectedEnigma && (
                <EnigmaDetailModal
                    enigma={selectedEnigma}
                    isOpen={!!selectedEnigma}
                    onClose={() => {
                        setSelectedEnigma(null);
                        // Reset URL back to enigmas list
                        window.history.pushState({}, '', '/enigmas');
                    }}
                />
            )}
        </div>
    );
};
