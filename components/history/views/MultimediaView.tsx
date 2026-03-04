
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ViewProps {
    onBack: () => void;
}

type Tab = 'audio' | 'video' | 'image' | 'pdf';

const YOUTUBE_ID = 'CckYvYr78yw';

export const MultimediaView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<Tab>('audio');

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: 'audio', label: 'Podcast', icon: '🎧' },
        { id: 'video', label: 'Vídeo', icon: '🎬' },
        { id: 'image', label: 'Infografía', icon: '🗺️' },
        { id: 'pdf', label: 'Presentación', icon: '📄' },
    ];

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            {/* Back */}
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
            <div className="text-center mb-8">
                <div className="inline-block mb-3 px-4 py-1 bg-navarra-gold/10 border border-navarra-gold/30 rounded-full text-navarra-gold text-xs uppercase tracking-[0.25em] font-bold">
                    Historia de Navarra
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Multimedia</h2>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    De neandertales al Reino de Navarra — audio, vídeo, infografía y presentación
                </p>
                <div className="h-0.5 w-24 bg-navarra-gold mx-auto mt-4" />
            </div>

            {/* Tab bar */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${activeTab === tab.id
                                ? 'bg-navarra-gold text-navarra-dark border-navarra-gold shadow-[0_0_16px_rgba(212,163,70,0.4)]'
                                : 'bg-black/30 text-gray-400 border-white/10 hover:border-navarra-gold/40 hover:text-white'
                            }`}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content panel */}
            <div className="bg-navarra-panel/60 border border-navarra-gold/20 rounded-2xl overflow-hidden shadow-2xl">

                {/* ── AUDIO ── */}
                {activeTab === 'audio' && (
                    <div className="p-8 md:p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-navarra-gold/10 border border-navarra-gold/30 flex items-center justify-center text-4xl">
                            🎧
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2">Podcast — Historia de Navarra</h3>
                        <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
                            «De neandertales al Reino de Navarra» — Un recorrido sonoro por los orígenes y la formación del Reyno.
                        </p>
                        <div className="bg-black/60 rounded-xl border border-navarra-gold/20 p-6 max-w-lg mx-auto hover:border-navarra-gold/50 transition-colors">
                            <audio controls className="w-full rounded" style={{ colorScheme: 'dark' }}>
                                <source src="/assets/audio/navarra.m4a" type="audio/mp4" />
                                <source src="/assets/audio/navarra.mp3" type="audio/mpeg" />
                                Tu navegador no soporta el elemento de audio.
                            </audio>
                        </div>
                    </div>
                )}

                {/* ── VIDEO YOUTUBE ── */}
                {activeTab === 'video' && (
                    <div className="p-8">
                        <h3 className="text-2xl font-serif text-white text-center mb-2">Vídeo — Historia de Navarra</h3>
                        <p className="text-gray-400 text-sm text-center mb-6 max-w-lg mx-auto">
                            Vídeo documental sobre la historia del Reyno de Navarra.
                        </p>
                        <div className="aspect-video rounded-xl overflow-hidden border border-navarra-gold/30 shadow-2xl hover:border-navarra-gold transition-colors">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?rel=0&modestbranding=1`}
                                title="Historia de Navarra"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {/* ── IMAGE ── */}
                {activeTab === 'image' && (
                    <div className="p-8">
                        <h3 className="text-2xl font-serif text-white text-center mb-2">Infografía — Historia de Navarra</h3>
                        <p className="text-gray-400 text-sm text-center mb-6 max-w-lg mx-auto">
                            Imagen cronológica con las etapas clave de la historia del reino.
                        </p>
                        <div className="rounded-xl overflow-hidden border border-navarra-gold/30 shadow-2xl hover:border-navarra-gold transition-colors flex items-center justify-center bg-black/40">
                            <img
                                src="/assets/general/historianavarra.png"
                                alt="Infografía Historia de Navarra"
                                className="w-full h-auto max-h-[70vh] object-contain"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <a
                                href="/assets/general/historianavarra.png"
                                download
                                className="inline-flex items-center gap-2 text-navarra-gold hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar imagen
                            </a>
                        </div>
                    </div>
                )}

                {/* ── PDF ── */}
                {activeTab === 'pdf' && (
                    <div className="p-8">
                        <h3 className="text-2xl font-serif text-white text-center mb-2">Presentación — Navarra</h3>
                        <p className="text-gray-400 text-sm text-center mb-6 max-w-lg mx-auto">
                            Presentación sobre la historia y el patrimonio del Reyno de Navarra.
                        </p>
                        <div className="rounded-xl overflow-hidden border border-navarra-gold/30 shadow-2xl hover:border-navarra-gold transition-colors bg-black/40">
                            <iframe
                                src="/assets/general/navarra.pdf#view=FitH"
                                className="w-full rounded-xl"
                                style={{ height: '70vh' }}
                                title="Presentación Navarra"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <a
                                href="/assets/general/navarra.pdf"
                                download
                                className="inline-flex items-center gap-2 text-navarra-gold hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar PDF
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
