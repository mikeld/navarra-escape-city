
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ViewProps {
    onBack: () => void;
}

export const ChroniclesView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <div className="bg-[#fcf5e5] text-gray-900 p-8 md:p-12 font-serif leading-relaxed shadow-inner max-w-4xl mx-auto rounded-sm border-y-4 border-double border-navarra-gold">
                <div className="mb-16 border-b-2 border-gray-300 pb-12">
                    <h2 className="text-3xl md:text-5xl text-navarra-crimson font-bold text-center mb-4 uppercase tracking-tighter">{t('historySection.chronicles.mainTitle')}</h2>
                    <h3 className="text-center text-gray-600 text-sm uppercase tracking-[0.3em] font-sans font-bold">{t('historySection.chronicles.subtitle')}</h3>

                    <div className="mt-8 space-y-6 text-lg text-justify">
                        <p><span className="text-6xl float-left mr-3 text-navarra-gold font-black leading-[0.8] font-serif">E</span>{t('historySection.chronicles.intro').substring(1)}</p>

                        <h4 className="text-xl font-bold text-navarra-dark mt-8 border-l-4 border-navarra-gold pl-4 uppercase tracking-wide">{t('historySection.chronicles.section1Title')}</h4>
                        <p>{t('historySection.chronicles.section1Text')}</p>

                        <h4 className="text-xl font-bold text-navarra-dark mt-8 border-l-4 border-navarra-gold pl-4 uppercase tracking-wide">{t('historySection.chronicles.section2Title')}</h4>
                        <p>{t('historySection.chronicles.section2Text')}</p>

                        <h4 className="text-xl font-bold text-navarra-dark mt-8 border-l-4 border-navarra-gold pl-4 uppercase tracking-wide">{t('historySection.chronicles.section3Title')}</h4>
                        <p>{t('historySection.chronicles.section3Text')}</p>

                        <h4 className="text-xl font-bold text-navarra-dark mt-8 border-l-4 border-navarra-gold pl-4 uppercase tracking-wide">{t('historySection.chronicles.section4Title')}</h4>
                        <p>{t('historySection.chronicles.section4Text')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
