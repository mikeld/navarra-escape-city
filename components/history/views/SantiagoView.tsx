
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeImage } from '../../UIComponents';

interface ViewProps {
    onBack: () => void;
}

type SantiagoTab = 'INTRO' | 'LANDMARKS' | 'LEGENDS';

export const SantiagoView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<SantiagoTab>('INTRO');

    return (
        <div className="animate-fade-in max-w-5xl mx-auto pb-12">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <div className="text-center mb-10">
                <div className="text-6xl mb-4 text-navarra-gold drop-shadow-glow animate-pulse-slow">⭐</div>
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-2">{t('historySection.santiago.title', 'El Camino de Santiago')}</h2>
                <p className="text-navarra-gold uppercase tracking-[0.2em] text-sm font-bold">{t('historySection.santiago.subtitle', 'Ruta de las Estrellas')}</p>
            </div>

            <div className="space-y-8">
                {/* Introduction */}
                <div className="bg-black/30 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
                    <p className="text-xl text-navarra-parchment leading-relaxed text-center font-light">
                        {t('historySection.santiago.introText')}
                    </p>
                </div>

                {/* Points Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Point 1 */}
                    <div className="bg-navarra-panel/80 p-6 rounded-xl border border-navarra-gold/30 hover:border-navarra-gold transition-colors group">
                        <h3 className="text-2xl font-serif text-navarra-gold mb-4 group-hover:text-white transition-colors">
                            {t('historySection.santiago.points.point1.title', '1. Fundación estratégica')}
                        </h3>
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                            {t('historySection.santiago.points.point1.content')}
                        </p>
                        <ul className="space-y-3">
                            {(t('historySection.santiago.points.point1.subpoints', { returnObjects: true }) as Array<{ label: string, text: string }>).map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                    <span className="text-navarra-gold font-bold shrink-0">•</span>
                                    <span className="text-gray-400"><strong className="text-white">{point.label}:</strong> {point.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Point 2 */}
                    <div className="bg-navarra-panel/80 p-6 rounded-xl border border-navarra-gold/30 hover:border-navarra-gold transition-colors group">
                        <h3 className="text-2xl font-serif text-navarra-gold mb-4 group-hover:text-white transition-colors">
                            {t('historySection.santiago.points.point2.title', '2. La Ciudad-Camino')}
                        </h3>
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                            {t('historySection.santiago.points.point2.content')}
                        </p>
                        <ul className="space-y-3">
                            {(t('historySection.santiago.points.point2.subpoints', { returnObjects: true }) as Array<{ label: string, text: string }>).map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                    <span className="text-navarra-gold font-bold shrink-0">•</span>
                                    <span className="text-gray-400"><strong className="text-white">{point.label}:</strong> {point.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Point 3 */}
                    <div className="bg-navarra-panel/80 p-6 rounded-xl border border-navarra-gold/30 hover:border-navarra-gold transition-colors group">
                        <h3 className="text-2xl font-serif text-navarra-gold mb-4 group-hover:text-white transition-colors">
                            {t('historySection.santiago.points.point3.title', '3. Capital del Románico')}
                        </h3>
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                            {t('historySection.santiago.points.point3.content')}
                        </p>
                        <ul className="space-y-3">
                            {(t('historySection.santiago.points.point3.subpoints', { returnObjects: true }) as Array<{ label: string, text: string }>).map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                    <span className="text-navarra-gold font-bold shrink-0">•</span>
                                    <span className="text-gray-400"><strong className="text-white">{point.label}:</strong> {point.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Point 4 */}
                    <div className="bg-navarra-panel/80 p-6 rounded-xl border border-navarra-gold/30 hover:border-navarra-gold transition-colors group">
                        <h3 className="text-2xl font-serif text-navarra-gold mb-4 group-hover:text-white transition-colors">
                            {t('historySection.santiago.points.point4.title', '4. Leyendas')}
                        </h3>
                        <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                            {t('historySection.santiago.points.point4.content')}
                        </p>
                        <ul className="space-y-3">
                            {(t('historySection.santiago.points.point4.subpoints', { returnObjects: true }) as Array<{ label: string, text: string }>).map((point, idx) => (
                                <li key={idx} className="flex gap-3 text-sm">
                                    <span className="text-navarra-gold font-bold shrink-0">•</span>
                                    <span className="text-gray-400"><strong className="text-white">{point.label}:</strong> {point.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Closing */}
                <div className="mt-8 p-6 bg-gradient-to-r from-navarra-gold/20 to-transparent border-l-4 border-navarra-gold rounded-r-lg">
                    <p className="text-lg text-white font-serif italic">
                        "{t('historySection.santiago.closing')}"
                    </p>
                </div>
            </div>
        </div>
    );
};
