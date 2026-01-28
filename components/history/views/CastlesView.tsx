
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CASTLES_DATA } from '../../../constants';
import { SafeImage } from '../../UIComponents';
import { fetchResourceConfig, getStorageUrl } from '../../../services/gameService';

interface ViewProps {
    onBack: () => void;
}

export const CastlesView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [castlesHeaderUrl, setCastlesHeaderUrl] = useState<string | undefined>(undefined);
    const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadResources = async () => {
            const config = await fetchResourceConfig();

            // Header Image
            const headerUrl = await getStorageUrl('assets/castles/castillos_header.png');
            if (headerUrl) setCastlesHeaderUrl(headerUrl);

            // Castles Video
            let vidUrl = config['video_castles'];
            if (!vidUrl) {
                vidUrl = await getStorageUrl('assets/resources/castillos.mp4');
            }
            setVideoUrl(vidUrl || '/assets/resources/castillos.mp4');
        };
        loadResources();
    }, []);

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <div className="text-center max-w-3xl mx-auto mb-12">
                <h3 className="text-3xl md:text-5xl font-serif text-white mb-4">{t('historySection.castles.title')}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{t('historySection.castles.description')}</p>
            </div>

            {/* VIDEO PLAYER */}
            <div className="max-w-4xl mx-auto aspect-video bg-black rounded-lg overflow-hidden border border-navarra-gold/30 shadow-2xl relative mb-16 group">
                <p className="absolute top-4 left-4 z-10 text-xs uppercase text-navarra-gold bg-black/80 backdrop-blur px-3 py-1 rounded tracking-widest border border-white/10">
                    {t('historySection.intro.videoCastles')}
                </p>
                <video key={videoUrl} controls className="w-full h-full object-cover">
                    <source src={videoUrl} type="video/mp4" />
                    {t('historySection.intro.videoNotSupported')}
                </video>
            </div>

            {castlesHeaderUrl && (
                <div className="mb-16 rounded-lg overflow-hidden border border-navarra-gold/30 shadow-lg max-w-4xl mx-auto cursor-pointer hover:border-navarra-gold transition-colors relative group" onClick={() => setSelectedImage(castlesHeaderUrl!)}>
                    <SafeImage
                        src={castlesHeaderUrl}
                        alt="Castillos de Navarra"
                        className="w-full h-auto object-contain"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 p-2 text-center text-xs text-navarra-gold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('historySection.castles.clickToEnlarge')}
                    </div>
                </div>
            )}

            {/* LIGHTBOX */}
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-7xl max-h-[90vh]">
                        <button
                            className="absolute -top-12 right-0 text-white hover:text-navarra-gold text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {t('historySection.castles.closeButton')}
                        </button>
                        <SafeImage
                            src={selectedImage}
                            alt={t('historySection.castles.enlargedAlt')}
                            className="max-w-full max-h-[85vh] object-contain rounded border border-navarra-gold/50 shadow-2xl"
                        />
                    </div>
                </div>
            )}

            <div className="relative border-l-4 border-navarra-stone ml-4 md:ml-8 space-y-16 pb-12">
                {CASTLES_DATA.map((period, idx) => (
                    <div key={idx} className="relative pl-8 md:pl-12">
                        {/* Dot */}
                        <div className="absolute -left-[14px] top-0 w-6 h-6 bg-navarra-dark border-4 border-navarra-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>

                        <div className="mb-8">
                            <span className="text-navarra-crimson font-bold uppercase tracking-widest text-sm block mb-1">{t(period.stageKey)}</span>
                            <h4 className="text-3xl font-serif text-white">{t(period.titleKey)}</h4>
                            <p className="text-gray-400 mt-3 max-w-2xl italic border-l-2 border-white/10 pl-4">{t(period.descKey)}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {period.details.map((detail, dIdx) => {
                                const detailName = t(`history.castles.stage${idx + 1}.details.${dIdx}.name`, detail.name);
                                const detailDesc = t(`history.castles.stage${idx + 1}.details.${dIdx}.desc`, detail.description);

                                return (
                                    <div key={dIdx} className="bg-navarra-panel/40 p-5 rounded border-l-2 border-navarra-gold/30 hover:border-navarra-gold hover:bg-navarra-panel/60 transition-colors">
                                        <h5 className="text-navarra-gold font-bold mb-2 font-serif">{detailName}</h5>
                                        <p className="text-sm text-gray-300 leading-relaxed">{detailDesc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
