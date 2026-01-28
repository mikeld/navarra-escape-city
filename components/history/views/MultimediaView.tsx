
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchResourceConfig, getStorageUrl } from '../../../services/gameService';

interface ViewProps {
    onBack: () => void;
}

export const MultimediaView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [resourceUrls, setResourceUrls] = useState<{ video?: string; video2?: string; audio?: string }>({});

    useEffect(() => {
        const loadResources = async () => {
            const config = await fetchResourceConfig();

            let video2Url = config['video_secondary'];
            if (!video2Url) {
                video2Url = await getStorageUrl('assets/resources/video2.mp4');
            }

            setResourceUrls({
                video: config['video_main'] || '/assets/recursos/video.mp4',
                video2: video2Url || '/assets/resources/video2.mp4',
                audio: config['audio_summary'] || '/assets/recursos/resumen.m4a',
            });
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

            <div className="bg-navarra-dark/50 border border-navarra-gold/20 p-8 rounded-2xl text-center shadow-2xl backdrop-blur-sm">
                <h3 className="text-3xl font-serif text-navarra-gold mb-4">{t('historySection.intro.title')}</h3>
                <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto mb-10 text-lg">
                    {t('historySection.intro.description')}
                </p>

                {/* AUDIO PLAYER */}
                <div className="bg-black/60 p-6 rounded-xl border border-navarra-stone max-w-md mx-auto mb-12 relative group hover:border-navarra-gold/50 transition-colors shadow-lg">
                    <p className="text-xs uppercase text-navarra-gold mb-3 tracking-widest flex items-center justify-center gap-2 font-bold">
                        <span className="text-xl">🎧</span> {t('historySection.intro.audioLabel')}
                        {resourceUrls.audio && resourceUrls.audio.startsWith('http') && <span className="bg-green-500/20 text-green-400 text-[9px] px-2 py-0.5 rounded border border-green-500/30">ONLINE</span>}
                    </p>
                    <audio key={resourceUrls.audio} controls className="w-full h-10 rounded contrast-125">
                        <source src={resourceUrls.audio} type="audio/mp4" />
                        <source src={resourceUrls.audio?.replace('.m4a', '.mp3')} type="audio/mpeg" />
                        {t('historySection.intro.audioNotSupported')}
                    </audio>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* VIDEO PLAYER 1 */}
                    <div className="aspect-video bg-black rounded-lg overflow-hidden border border-navarra-gold/30 shadow-2xl relative group hover:border-navarra-gold hover:shadow-navarra-gold/20 transition-all">
                        <video key={resourceUrls.video} controls className="w-full h-full object-cover" poster="/assets/places/estella_panoramica.png">
                            <source src={resourceUrls.video} type="video/mp4" />
                            {t('historySection.intro.videoNotSupported')}
                        </video>
                    </div>

                    {/* VIDEO PLAYER 2 */}
                    <div className="aspect-video bg-black rounded-lg overflow-hidden border border-navarra-gold/30 shadow-2xl relative group hover:border-navarra-gold hover:shadow-navarra-gold/20 transition-all">
                        <p className="absolute top-3 left-3 z-10 text-xs uppercase text-navarra-gold bg-black/70 backdrop-blur px-3 py-1 rounded tracking-widest border border-white/10">
                            {t('historySection.intro.videoPart2')}
                        </p>
                        <video key={resourceUrls.video2} controls className="w-full h-full object-cover">
                            <source src={resourceUrls.video2} type="video/mp4" />
                            {t('historySection.intro.videoNotSupported')}
                        </video>
                    </div>
                </div>
            </div>
        </div>
    );
};
