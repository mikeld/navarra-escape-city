import React from 'react';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    const handleGoHome = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Image/GIF */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-50">
                <img
                    src="/404.webp"
                    alt="404 Not Found"
                    className="w-full h-full object-cover md:object-contain"
                />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 text-center space-y-8 max-w-2xl bg-black/60 p-8 rounded-lg backdrop-blur-sm border border-navarra-gold/30">
                <h1 className="text-6xl md:text-8xl font-crimson text-navarra-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                    404
                </h1>

                <p className="text-xl md:text-2xl font-serif text-white/90">
                    {t('common.pageNotFound', 'Página no encontrada')}
                </p>

                <p className="text-white/70 italic">
                    {t('common.pageNotFoundDesc', 'Parece que te has perdido en las sombras de la historia...')}
                </p>

                <button
                    onClick={handleGoHome}
                    className="px-8 py-3 bg-navarra-gold/20 hover:bg-navarra-gold/30 border border-navarra-gold text-navarra-gold 
                             rounded transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]
                             font-serif tracking-wide uppercase"
                >
                    {t('common.backToHome', 'Volver al Inicio')}
                </button>
            </div>
        </div>
    );
};

export default NotFound;
