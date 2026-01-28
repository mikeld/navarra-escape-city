
import React, { useState, useEffect } from 'react';
import { audioManager } from '../services/audioService';
import { useTranslation } from 'react-i18next';

// --- NEW COMPONENT: Audio Toggle ---
export const AudioToggle: React.FC = () => {
  const { t } = useTranslation();
  const [muted, setMuted] = useState(audioManager.getMuteState());

  const handleToggle = () => {
    const newState = audioManager.toggleMute();
    setMuted(newState);
    // Visual feedback sound only when unmuting
    if (!newState) audioManager.playSFX('CLICK');
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative group flex items-center justify-center p-2 rounded-full border transition-all duration-300
        ${muted
          ? 'bg-black/40 border-gray-700 text-gray-500 hover:text-gray-300'
          : 'bg-navarra-gold/10 border-navarra-gold text-navarra-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]'}
      `}
      title={muted ? t('ui.audio.unmute') : t('ui.audio.mute')}
    >
      {muted ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
};

// --- NEW COMPONENT: GPS Bypass Toggle ---
export const GpsToggle: React.FC = () => {
  const { t } = useTranslation();
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('estella_gps_bypass');
    setBypassed(saved === 'true');
  }, []);

  const handleToggle = () => {
    const newState = !bypassed;
    setBypassed(newState);
    localStorage.setItem('estella_gps_bypass', String(newState));
    // Dispatch event to notify GameEngine
    window.dispatchEvent(new Event('gps_bypass_changed'));
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative group flex items-center justify-center p-2 rounded-full border transition-all duration-300 ml-2
        ${bypassed
          ? 'bg-purple-900/50 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
          : 'bg-black/40 border-gray-700 text-gray-500 hover:text-gray-300'}
      `}
      title={bypassed ? t('ui.gps.bypass') : t('ui.gps.required')}
    >
      {bypassed ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }> = ({
  className = '',
  variant = 'primary',
  children,
  onClick,
  ...props
}) => {
  const baseStyle = "px-6 py-3 font-serif font-bold tracking-widest uppercase transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed clip-path-medieval";

  const variants = {
    primary: "bg-navarra-gold text-navarra-dark hover:bg-yellow-500 shadow-[0_0_15px_rgba(212,175,55,0.4)] border-2 border-navarra-gold",
    secondary: "bg-navarra-stone text-navarra-parchment border-2 border-navarra-gold/50 hover:border-navarra-gold hover:bg-navarra-dark",
    ghost: "bg-transparent text-navarra-gold hover:text-white",
    danger: "bg-red-900/80 text-white border-2 border-red-500 hover:bg-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Play Click Sound
    audioManager.playSFX('CLICK');
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-navarra-dark/90 border border-navarra-gold/30 backdrop-blur-sm p-6 rounded-sm shadow-xl ${className}`}>
    {children}
  </div>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    className="w-full bg-black/50 border-b-2 border-navarra-gold/50 text-navarra-parchment text-center text-xl p-4 focus:outline-none focus:border-navarra-gold font-serif placeholder-navarra-stone"
    {...props}
  />
);

export const SafeImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error || !src) {
    // Icono por defecto (Castillo/Lugar) - SVG Vectorial
    let icon = (
      <svg className="w-1/3 h-1/3 text-navarra-gold/20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
      </svg>
    );

    // Si parece ser una persona, mostramos icono de usuario - SVG Vectorial
    const lowerAlt = alt.toLowerCase();
    if (lowerAlt.includes('personaje') || lowerAlt.includes('juda') || lowerAlt.includes('leon') || lowerAlt.includes('nadav') || lowerAlt.includes('miryam') || lowerAlt.includes('protagonista')) {
      icon = (
        <svg className="w-1/3 h-1/3 text-navarra-gold/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    }

    return (
      <div className={`bg-navarra-stone flex items-center justify-center border border-navarra-gold/20 relative overflow-hidden ${className}`}>
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navarra-gold via-transparent to-transparent"></div>
        {icon}
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export const DialogueBox: React.FC<{ speaker: string; text: string; onNext: () => void; image?: string }> = ({ speaker, text, onNext, image }) => {
  const { t } = useTranslation();

  // SPECIAL SYSTEM ERROR STYLE
  if (speaker === 'SYSTEM') {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-8 bg-black/95 border-t-4 border-red-600 animate-slide-up font-mono shadow-[0_-10px_40px_rgba(220,38,38,0.2)]">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-red-500 border-b border-red-900/50 pb-2">
            <span className="animate-pulse">⚠️</span>
            <span className="text-xs font-bold uppercase tracking-widest">
              {t('ui.dialogue.system.offline')}
            </span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">
            {t('ui.dialogue.system.location')}
          </div>
          <p className="text-green-500 text-sm md:text-base leading-relaxed whitespace-pre-line">
            {text}
          </p>
          <div className="text-right pt-2">
            <button onClick={onNext} className="text-gray-500 hover:text-green-400 text-xs uppercase tracking-widest animate-pulse transition-colors">
              {t('ui.dialogue.system.manualCommand')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 pb-8 bg-gradient-to-t from-black via-navarra-dark to-transparent">
      <div className="max-w-2xl mx-auto bg-navarra-stone/95 border border-navarra-gold/40 p-6 rounded-lg shadow-2xl animate-slide-up relative flex gap-4 items-center">
        {image && (
          <div className="w-20 h-20 shrink-0 rounded-full border-2 border-navarra-gold overflow-hidden bg-black">
            <SafeImage src={image} alt={speaker} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-navarra-gold font-serif font-bold text-sm uppercase tracking-wider mb-2">{speaker}</h3>
          <p className="text-navarra-parchment font-sans text-lg leading-relaxed italic">"{text}"</p>
          <div className="mt-2 text-right">
            <button onClick={onNext} className="text-navarra-gold text-sm hover:text-white animate-pulse font-bold uppercase tracking-widest">
              {t('ui.dialogue.continue')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, confirmVariant = "danger" }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-navarra-panel border-2 border-navarra-gold max-w-md w-full p-8 rounded shadow-[0_0_30px_rgba(212,175,55,0.2)] text-center space-y-6">
        <h3 className="text-2xl font-serif text-navarra-gold font-bold">{title}</h3>
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{message}</p>
        <div className="flex gap-4 justify-center pt-4">
          <Button variant="secondary" onClick={onCancel} className="text-sm py-2 px-4">
            {cancelText || t('ui.modal.cancel')}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} className="text-sm py-2 px-4">
            {confirmText || t('ui.modal.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
};