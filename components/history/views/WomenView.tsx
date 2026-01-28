
import React from 'react';
import { useTranslation } from 'react-i18next';
import { WOMEN_HISTORY } from '../../../constants';

interface ViewProps {
    onBack: () => void;
}

export const WomenView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-block p-3 rounded-full bg-purple-900/30 mb-4 border border-purple-500/30 text-3xl">👑</div>
                <h3 className="text-4xl font-serif text-white mb-4">{t('historySection.women.title')}</h3>
                <p className="text-gray-300 text-lg">{t('historySection.women.description')}</p>
            </div>

            <div className="grid gap-8">
                {WOMEN_HISTORY.map((section, idx) => (
                    <div key={idx} className="bg-navarra-panel/50 p-8 rounded-xl border border-navarra-gold/20 shadow-lg">
                        <h4 className="text-navarra-crimson font-bold uppercase tracking-widest mb-8 border-b border-navarra-gold/10 pb-4 text-center">{t(section.catKey)}</h4>
                        <div className="grid md:grid-cols-2 gap-8">
                            {section.figures.map((woman, wIdx) => (
                                <div key={wIdx} className="flex gap-4 items-start group">
                                    <div className="w-14 h-14 rounded-full bg-navarra-gold/10 border border-navarra-gold/30 flex items-center justify-center text-navarra-gold shrink-0 text-2xl font-serif group-hover:bg-navarra-gold group-hover:text-black transition-colors shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                                        {woman.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h5 className="text-white font-bold font-serif text-xl mb-2 group-hover:text-navarra-gold transition-colors">{woman.name}</h5>
                                        <p className="text-gray-400 text-sm leading-relaxed">{t(woman.bioKey)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
