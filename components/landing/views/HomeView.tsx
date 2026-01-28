
import React from 'react';
import { Button, SafeImage } from '../../UIComponents';
import { NewsletterSignup } from '../NewsletterSignup';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../LanguageSwitcher';
import UserMenu from '../UserMenu';
import { Header } from '../Header';

interface HomeViewProps {
  onNavigate: (view: 'HISTORY' | 'CHARACTERS' | 'PLACES' | 'ABOUT' | 'ENIGMAS' | 'MEMORIES') => void;
  onStartGame: () => void;
  onResumeGame: () => void;
  hasSavedGame: boolean;
  gameImageUrl: string | null;
  onToggleMusic: () => void;
  musicPlaying: boolean;
  onViewStats: (gameId: string) => void;
  hasMemories: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onStartGame,
  onResumeGame,
  hasSavedGame,
  gameImageUrl,
  onToggleMusic,
  musicPlaying,
  onViewStats,
  hasMemories
}) => {
  const { t } = useTranslation();

  const scrollToGames = () => {
    document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header
        onNavigateToLogin={() => {
          window.history.pushState({}, '', '/login');
          window.location.reload();
        }}
        onNavigateToProfile={() => {
          window.history.pushState({}, '', '/profile');
          window.location.reload();
        }}
      />

      <section className="relative min-h-screen flex flex-col justify-start items-center text-center px-6 pt-32 md:pt-40 pb-48 bg-navarra-hero bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-navarra-dark z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0 pointer-events-none mix-blend-overlay"></div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-fade-in flex flex-col items-center">
          <div className="mt-2 mb-4 md:mt-4 md:mb-6">
            <img
              src="/logo.png"
              alt="Navarra Escape City Logo"
              className="w-80 h-80 md:w-[28rem] md:h-[28rem] lg:w-[32rem] lg:h-[32rem] object-contain mx-auto drop-shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:drop-shadow-[0_0_90px_rgba(212,175,55,0.7)] transition-all duration-500 hover:scale-105"
            />
          </div>

          <div className="mb-6">
            <p className="text-navarra-gold text-sm md:text-base lg:text-lg uppercase tracking-[0.3em] font-semibold">
              {t('app.heroText')}
            </p>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-navarra-gold to-transparent mb-8"></div>

          <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-gray-100 font-serif font-light leading-relaxed italic px-6">
            "{t('app.heroTagline')}"
          </p>

          <div className="pt-8">
            <button
              onClick={scrollToGames}
              className="group relative px-10 py-5 bg-transparent overflow-hidden rounded-sm transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-navarra-gold/10 group-hover:bg-navarra-gold/20 transition-all duration-300 border border-navarra-gold/50 group-hover:border-navarra-gold"></div>
              <span className="relative text-navarra-gold group-hover:text-white font-serif font-bold tracking-[0.2em] uppercase text-lg flex items-center gap-3">
                {t('app.playNow')}
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="relative z-20 px-4 -mt-32 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <button
            onClick={() => onNavigate('HISTORY')}
            className="group relative bg-gradient-to-br from-navarra-dark/98 to-navarra-panel/95 backdrop-blur-md border-2 border-navarra-gold/40 p-6 md:p-8 rounded-2xl text-left shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] hover:-translate-y-3 transition-all duration-500 hover:border-navarra-gold overflow-hidden active:scale-95"
          >
            <div className="relative z-10">
              <div className="mb-5 md:mb-6">
                <div className="inline-flex p-3 md:p-4 bg-navarra-gold/10 rounded-xl group-hover:bg-navarra-gold/20 transition-colors duration-300 group-hover:scale-110 transform">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-navarra-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 group-hover:text-navarra-gold transition-colors duration-300">
                {t('menu.history')}
              </h3>
              <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-4">
                {t('menu.historyDesc')}
              </p>
              <div className="flex items-center gap-2 text-navarra-gold text-xs md:text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                <span>{t('homeView.explore')}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('ENIGMAS')}
            className="group relative bg-gradient-to-br from-navarra-dark/98 to-navarra-panel/95 backdrop-blur-md border-2 border-navarra-gold/40 p-6 md:p-8 rounded-2xl text-left shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(212,175,55,0.3)] hover:-translate-y-3 transition-all duration-500 hover:border-navarra-gold overflow-hidden active:scale-95"
          >
            <div className="relative z-10">
              <div className="mb-5 md:mb-6">
                <div className="inline-flex p-3 md:p-4 bg-navarra-gold/10 rounded-xl group-hover:bg-navarra-gold/20 transition-colors duration-300 group-hover:scale-110 transform">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-navarra-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 group-hover:text-navarra-gold transition-colors duration-300">
                {t('menu.enigmas')}
              </h3>
              <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-4">
                {t('menu.enigmasDesc')}
              </p>
              <div className="flex items-center gap-2 text-navarra-gold text-xs md:text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all duration-300">
                <span>{t('enigmas.solveButton')}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </button>

          {/* New Section: What is Escape City? */}
          <div className="bg-navarra-crimson/90 border-2 border-navarra-gold/50 p-6 md:p-8 rounded-2xl text-left shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-navarra-gold/10 rounded-full -mr-16 -mt-16 transition-transform duration-1000 group-hover:scale-150"></div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-white mb-3">¿Qué es Escape City?</h3>
            <p className="text-sm text-navarra-parchment/90 font-light leading-relaxed mb-4 relative z-10">
              Una experiencia híbrida que convierte las calles de Navarra en un tablero de juego real. Combina historia, acertijos en tu móvil y observación directa del entorno. Sin prisas, a tu ritmo, y totalmente al aire libre.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-black/30 rounded text-[10px] font-bold uppercase tracking-tighter">🗺️ Híbrido</span>
              <span className="px-2 py-1 bg-black/30 rounded text-[10px] font-bold uppercase tracking-tighter">🏰 Historia</span>
              <span className="px-2 py-1 bg-black/30 rounded text-[10px] font-bold uppercase tracking-tighter">📱 App web</span>
            </div>
          </div>
        </div>
      </section>

      <section id="games" className="pt-12 pb-24 px-6 bg-black flex flex-col items-center border-t border-navarra-stone/50">
        <div className="text-center mb-12 space-y-4">
          <span className="text-navarra-gold/60 text-xs uppercase tracking-[0.3em] font-bold border-b border-navarra-gold/30 pb-1">{t('games.select')}</span>
          <h2 className="text-4xl md:text-6xl font-serif text-white">{t('games.title')}</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl w-full">
          {/* Estella-Lizarra */}
          <div className="group relative bg-navarra-panel rounded-lg overflow-hidden border border-navarra-gold/30 hover:border-navarra-gold transition-all duration-500 shadow-2xl">
            <div className="h-64 overflow-hidden relative">
              <img src="/assets/destinos/estella.jpg" alt="Estella" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif text-white font-bold mb-2">{t('games.estella.title')}</h3>
              <p className="text-gray-400 text-sm mb-6">{t('games.estella.desc')}</p>
              <a href={t('games.estella.url')} className="inline-block w-full py-4 bg-navarra-crimson text-white text-center rounded font-bold uppercase tracking-widest hover:bg-navarra-crimson/80 transition-colors">
                {t('games.estella.start')}
              </a>
            </div>
          </div>

          {/* Olite */}
          <div className="group relative bg-navarra-panel rounded-lg overflow-hidden border border-navarra-gold/30 hover:border-navarra-gold transition-all duration-500 shadow-2xl">
            <div className="h-64 overflow-hidden relative">
              <img src="/assets/destinos/olite.jpg" alt="Olite" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif text-white font-bold mb-2">{t('games.olite.title')}</h3>
              <p className="text-gray-400 text-sm mb-6">{t('games.olite.desc')}</p>
              <a href={t('games.olite.url')} className="inline-block w-full py-4 bg-navarra-gold text-black text-center rounded font-bold uppercase tracking-widest hover:bg-navarra-gold/80 transition-colors">
                {t('games.olite.start')}
              </a>
            </div>
          </div>

          {/* Tafalla (Próximamente) */}
          <div className="group relative bg-navarra-panel/50 rounded-lg overflow-hidden border border-navarra-gold/10 grayscale opacity-60">
            <div className="h-64 flex items-center justify-center bg-black/40">
              <span className="text-navarra-gold/30 font-serif text-4xl transform -rotate-12">PRÓXIMAMENTE</span>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif text-navarra-gold/40 font-bold mb-2">{t('games.tafalla.title')}</h3>
              <p className="text-gray-600 text-sm mb-6">{t('games.tafalla.desc')}</p>
              <button disabled className="w-full py-4 bg-white/5 text-gray-700 rounded font-bold uppercase tracking-widest cursor-not-allowed">
                {t('games.tafalla.start')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />

      <button
        onClick={onToggleMusic}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-navarra-gold/90 hover:bg-navarra-gold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300 flex items-center justify-center group hover:scale-110 active:scale-95"
      >
        {musicPlaying ? (
          <svg className="w-8 h-8 text-navarra-dark" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-navarra-dark" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
};
