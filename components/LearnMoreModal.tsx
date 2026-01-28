
import React from 'react';
import { ExtendedInfoData } from '../data/extendedInfo';
import { useTranslation } from 'react-i18next';

interface LearnMoreModalProps {
    data: ExtendedInfoData;
    onClose: () => void;
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ data, onClose }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed inset-0 z-[70] bg-black/90 flex justify-center items-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-[#fcf5e5] w-full max-w-2xl max-h-[90vh] rounded-lg shadow-2xl relative flex flex-col border-[8px] border-double border-[#8a7224] overflow-hidden">

                {/* Header */}
                <div className="bg-[#8a1c1c] text-[#fcf5e5] p-6 text-center border-b-4 border-[#d4af37] shrink-0 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-[#fcf5e5] hover:text-[#d4af37] transition-colors font-bold text-2xl leading-none"
                    >
                        ✕
                    </button>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold uppercase tracking-wide">{data.title}</h2>
                    <p className="text-[#d4af37] text-sm uppercase tracking-[0.2em] font-bold mt-2">{data.subtitle}</p>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar font-serif leading-relaxed text-lg bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]">
                    {data.content}
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#1a1814] text-center shrink-0 border-t border-[#8a7224]">
                    <button
                        onClick={onClose}
                        className="text-[#d4af37] text-xs uppercase tracking-widest font-bold hover:text-white transition-colors"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
