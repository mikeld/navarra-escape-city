
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getMemories, Memory } from '../../../services/memoriesService';
import { SafeImage } from '../../UIComponents';

interface MemoriesViewProps {
    onBack: () => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getMemories();
                setMemories(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Helper to get video ID from URL
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="min-h-screen bg-navarra-dark text-navarra-parchment font-sans pb-20 relative bg-[url('/assets/pattern_bg.png')] bg-repeat">
            <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Header */}
                <button onClick={onBack} className="mb-8 text-white/50 hover:text-navarra-gold flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('common.backToHome')}
                </button>

                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Recuerdos de Navarra</h2>
                    <p className="text-navarra-gold max-w-2xl mx-auto leading-relaxed">
                        Un espacio para compartir historias, anécdotas y momentos vividos en nuestra ciudad.
                        Envíanos tu video y forma parte de la memoria viva de Navarra.
                    </p>
                    <a
                        href="mailto:hola@escaperoomestella.com?subject=Envio%20de%20Recuerdo%20-%20Navarra"
                        className="inline-block mt-8 px-8 py-3 bg-navarra-gold text-navarra-dark font-bold uppercase tracking-widest rounded hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                    >
                        Enviar mi recuerdo
                    </a>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navarra-gold mx-auto"></div>
                    </div>
                ) : memories.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 italic">
                        Aún no hay recuerdos compartidos. ¡Sé el primero!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {memories.map((memory) => {
                            const videoId = getYoutubeId(memory.youtubeUrl);
                            return (
                                <div key={memory.id} className="bg-navarra-panel border border-navarra-gold/20 rounded-xl overflow-hidden group hover:border-navarra-gold/50 transition-all hover:-translate-y-1 shadow-2xl">
                                    {/* Video Thumbnail/Embed */}
                                    <div className="aspect-video bg-black relative">
                                        {videoId ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title={memory.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0"
                                            ></iframe>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500">Video no disponible</div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif text-navarra-gold mb-1 font-bold">{memory.title}</h3>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider mb-4 font-bold border-b border-white/5 pb-2">
                                            {memory.protagonist}
                                        </p>
                                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                                            {memory.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
