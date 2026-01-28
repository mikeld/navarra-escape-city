
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TIMELINE_EVENTS } from '../../../constants';

interface ViewProps {
    onBack: () => void;
}

export const TimelineView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <h2 className="text-4xl font-serif text-white mb-8 text-center">{t('historySection.tabs.timeline')}</h2>

            <div className="relative border-l-2 border-navarra-gold/30 ml-4 space-y-12 py-4">
                {TIMELINE_EVENTS.map((event, idx) => (
                    <div key={idx} className="relative pl-8 group">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-navarra-dark border-2 border-navarra-gold rounded-full group-hover:bg-navarra-gold transition-colors shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                        <span className="text-navarra-gold font-bold text-5xl opacity-20 absolute -top-4 left-6 font-serif">{event.year}</span>
                        <div className="relative z-10">
                            <span className="text-navarra-gold font-bold text-xl block mb-1 font-serif">{event.year}</span>
                            <div className="bg-navarra-panel/80 p-6 rounded-lg border border-white/10 hover:border-navarra-gold/50 transition-colors">
                                <h4 className="text-white font-bold text-lg mb-2 font-serif">{t(event.titleKey)}</h4>
                                <p className="text-gray-300 text-base leading-relaxed">{t(event.descKey)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
