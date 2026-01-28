
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HistoricalContextProps {
    onClose: () => void;
}

export const HistoricalContext: React.FC<HistoricalContextProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[70] bg-black/95 flex justify-center overflow-y-auto animate-fade-in p-4 md:p-8">
            <div className="max-w-4xl w-full bg-navarra-parchment text-gray-900 rounded shadow-2xl relative my-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-navarra-crimson font-bold text-2xl hover:scale-110 transition-transform"
                >
                    ✕
                </button>

                <div className="p-8 md:p-12 font-serif leading-relaxed space-y-6">
                    <div className="border-b-4 border-double border-navarra-crimson pb-6 mb-6 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-navarra-dark mb-2">{t('history.massacre1328.year')}</h2>
                        <p className="text-navarra-crimson text-xl font-bold uppercase tracking-widest">{t('history.massacre1328.title')}</p>
                    </div>

                    <p className="font-bold italic text-lg text-center bg-navarra-gold/20 p-4 rounded border border-navarra-gold/50">
                        {t('history.massacre1328.introduction')}
                    </p>

                    <h3 className="text-2xl font-bold text-navarra-crimson mt-8 uppercase border-b border-gray-400">{t('history.massacre1328.section1Title')}</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>{t('history.massacre1328.section1Items.item1Title')}</strong> {t('history.massacre1328.section1Items.item1Text')}</li>
                        <li><strong>{t('history.massacre1328.section1Items.item2Title')}</strong> {t('history.massacre1328.section1Items.item2Text')}</li>
                        <li><strong>{t('history.massacre1328.section1Items.item3Title')}</strong> {t('history.massacre1328.section1Items.item3Text')}</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-navarra-crimson mt-8 uppercase border-b border-gray-400">{t('history.massacre1328.section2Title')}</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>{t('history.massacre1328.section2Items.item1Title')}</strong> {t('history.massacre1328.section2Items.item1Text')}</li>
                        <li><strong>{t('history.massacre1328.section2Items.item2Title')}</strong> {t('history.massacre1328.section2Items.item2Text')}</li>
                        <li><strong>{t('history.massacre1328.section2Items.item3Title')}</strong> {t('history.massacre1328.section2Items.item3Text')}</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-navarra-crimson mt-8 uppercase border-b border-gray-400">{t('history.massacre1328.section3Title')}</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>{t('history.massacre1328.section3Items.item1Title')}</strong> {t('history.massacre1328.section3Items.item1Text')}</li>
                        <li><strong>{t('history.massacre1328.section3Items.item2Title')}</strong> {t('history.massacre1328.section3Items.item2Text')}</li>
                        <li><strong>{t('history.massacre1328.section3Items.item3Title')}</strong> {t('history.massacre1328.section3Items.item3Text')}</li>
                    </ul>

                    <h3 className="text-2xl font-bold text-navarra-crimson mt-8 uppercase border-b border-gray-400">{t('history.massacre1328.summaryTitle')}</h3>
                    <p>
                        {t('history.massacre1328.summaryParagraph1')}
                    </p>
                    <p>
                        {t('history.massacre1328.summaryParagraph2')}
                    </p>

                    <div className="pt-8 text-center">
                        <button
                            onClick={onClose}
                            className="bg-navarra-dark text-navarra-gold px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-black transition-colors"
                        >
                            {t('history.massacre1328.closeButton')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
