
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ViewProps {
    onBack: () => void;
}

const SectionCard: React.FC<{ title: string; text: string; icon?: string }> = ({ title, text, icon }) => (
    <div className="bg-navarra-panel/60 border border-navarra-gold/20 rounded-xl p-6 hover:border-navarra-gold/50 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(212,163,70,0.1)]">
        <div className="flex items-start gap-3 mb-3">
            {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
            <h3 className="text-navarra-gold font-serif font-bold text-lg leading-tight">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
    </div>
);

export const HistorySummaryView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();

    const sections = [
        { key: 's1', icon: '🏛️' },
        { key: 's2', icon: '⚔️' },
        { key: 's3', icon: '🏰' },
        { key: 's4', icon: '⚡' },
        { key: 's5', icon: '📜' },
        { key: 's6', icon: '🌟' },
    ];

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Back button */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-block mb-4 px-4 py-1 bg-navarra-gold/10 border border-navarra-gold/30 rounded-full text-navarra-gold text-xs uppercase tracking-[0.25em] font-bold">
                    Historia de Navarra
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
                    {t('historySummary.title')}
                </h2>
                <div className="h-0.5 w-24 bg-navarra-gold mx-auto" />
            </div>

            {/* Sections grid */}
            <div className="grid md:grid-cols-2 gap-5">
                {sections.map(({ key, icon }) => (
                    <SectionCard
                        key={key}
                        icon={icon}
                        title={t(`historySummary.${key}Title`)}
                        text={t(`historySummary.${key}Text`)}
                    />
                ))}
            </div>

            {/* Footer note */}
            <div className="mt-8 text-center">
                <p className="text-gray-500 text-xs italic">
                    Navarra — Del Reyno Medieval a la Comunidad Foral
                </p>
            </div>
        </div>
    );
};
