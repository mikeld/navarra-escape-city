
import React, { useState, useEffect } from 'react';
import { Button, SafeImage } from '../UIComponents';
import { getStorageUrl } from '../../services/gameService';
import { useTranslation } from 'react-i18next';
import { useExtendedInfo } from '../../data/extendedInfo';
import { LearnMoreModal } from '../LearnMoreModal';

interface SynagoguePuzzleProps {
  onSolved: (val: string) => void;
  onMistake?: () => void;
}

type Stage = 'DEBUG' | 'RESTORE' | 'ANALYZE' | 'FINISHED';

const FAKE_IDS = [5, 7, 10, 13];

const SynagoguePuzzle: React.FC<SynagoguePuzzleProps> = ({ onSolved, onMistake }) => {
  const { t } = useTranslation();
  const extendedInfo = useExtendedInfo();
  const [stage, setStage] = useState<Stage>('DEBUG');
  const [images, setImages] = useState<string[]>([]);
  const [sealBg, setSealBg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [debugError, setDebugError] = useState(false);

  const [placedSymbol, setPlacedSymbol] = useState<string | null>(null);
  const [restoreFeedback, setRestoreFeedback] = useState<string | null>(null);

  const [analyzeFeedback, setAnalyzeFeedback] = useState<{ msg: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [showDefect, setShowDefect] = useState(false);

  // State for the Learn More Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    const loadAssets = async () => {
      const imgPromises = [];
      for (let i = 1; i <= 16; i++) {
        imgPromises.push(getStorageUrl(`assets/games/sinagoga/${i}.png`));
      }
      const loadedImages = await Promise.all(imgPromises);
      setImages(loadedImages.map(url => url || 'placeholder'));

      const sealUrl = await getStorageUrl('assets/games/sinagoga/sellovacio.png');
      setSealBg(sealUrl);

      setLoading(false);
    };
    loadAssets();
  }, []);

  const handleImageToggle = (index: number) => {
    const id = index + 1;
    if (selectedImages.includes(id)) {
      setSelectedImages(prev => prev.filter(i => i !== id));
    } else {
      setSelectedImages(prev => [...prev, id]);
    }
    setDebugError(false);
  };

  const handleDebugSubmit = () => {
    const sortedSelected = [...selectedImages].sort();
    const sortedFakes = [...FAKE_IDS].sort();
    const isMatch = JSON.stringify(sortedSelected) === JSON.stringify(sortedFakes);

    if (isMatch) {
      setTimeout(() => setStage('RESTORE'), 500);
    } else {
      if (onMistake) onMistake();
      setDebugError(true);
      setTimeout(() => setDebugError(false), 2500);
    }
  };

  const handleRestoreSelect = (symbol: string) => {
    if (symbol === 'STAR') {
      if (onMistake) onMistake();
      setRestoreFeedback(t('puzzleComponents.synagogue.feedbackStar'));
    } else if (symbol === 'CROSS' || symbol === 'SHELL' || symbol === 'CHAINS' || symbol === 'LION') {
      if (onMistake) onMistake();
      setRestoreFeedback(t('puzzleComponents.synagogue.feedbackWrong'));
    } else if (symbol === 'CHRISMON') {
      setPlacedSymbol('CHRISMON');
      setRestoreFeedback(null);
      setTimeout(() => setStage('ANALYZE'), 1500);
    }
  };

  const handleAnalyzeClick = (part: string) => {
    if (showDefect) return; // Ya resuelto

    if (part === 'BAR') {
      setShowDefect(true);
      setAnalyzeFeedback({
        msg: t('puzzleComponents.synagogue.analyzeBar'),
        type: 'success'
      });
      // Move to FINAL stage instead of auto-solving immediately
      setTimeout(() => setStage('FINISHED'), 2500);
    } else {
      // Feedback pistas sutiles
      const msgs: Record<string, string> = {
        'P': t('puzzleComponents.synagogue.analyzeP'),
        'X': t('puzzleComponents.synagogue.analyzeX'),
        'S': t('puzzleComponents.synagogue.analyzeS'),
        'AO': t('puzzleComponents.synagogue.analyzeAO')
      };
      setAnalyzeFeedback({ msg: msgs[part] || "Esa parte es correcta.", type: 'info' });
      setTimeout(() => setAnalyzeFeedback(null), 2000);
    }
  };

  if (loading) return <div className="text-center animate-pulse text-navarra-gold">{t('common.loading')}</div>;

  if (stage === 'DEBUG') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-2">
          {t('puzzleComponents.synagogue.stage1')}
        </h4>

        <div className="bg-black/60 p-4 border border-navarra-gold/30 rounded text-xs text-left font-mono text-green-400 mb-4">
          <p>{">"} {t('puzzleComponents.synagogue.logScanning')}</p>
          <p>{">"} {t('puzzleComponents.synagogue.logPackets')}</p>
          <p className="text-red-400 animate-pulse">{">"} {t('puzzleComponents.synagogue.logAlert')}</p>
        </div>

        <p className="text-sm text-gray-300 italic mb-4">
          {t('puzzleComponents.synagogue.instr1')}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((url, idx) => {
            const id = idx + 1;
            const isSelected = selectedImages.includes(id);
            return (
              <button
                key={idx}
                onClick={() => handleImageToggle(idx)}
                className={`
                  aspect-square rounded overflow-hidden border-2 relative transition-all duration-300
                  ${isSelected ? 'border-red-500 scale-95 opacity-80' : 'border-navarra-stone hover:border-navarra-gold'}
                `}
              >
                <SafeImage src={url} alt={`Patrón ${id}`} className="w-full h-full object-cover" />
                {isSelected && (
                  <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                    <span className="text-red-200 font-bold text-lg">✕</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {debugError && (
          <p className="text-red-400 text-xs font-bold animate-pulse bg-red-900/20 p-2 rounded">
            {t('puzzleComponents.synagogue.error')}
          </p>
        )}

        <Button onClick={handleDebugSubmit} className="w-full shadow-[0_0_15px_rgba(0,255,0,0.2)]">
          {t('puzzleComponents.synagogue.btn1')}
        </Button>
      </div>
    );
  }

  if (stage === 'RESTORE') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-4">
          {t('puzzleComponents.synagogue.stage2')}
        </h4>

        <div className="bg-navarra-panel border-l-4 border-navarra-gold p-4 text-left text-sm text-gray-300 italic mb-6">
          <p className="mt-2 text-white font-bold">{t('puzzleComponents.synagogue.instr2')}</p>
        </div>

        <div className="relative w-full max-w-xs mx-auto aspect-square rounded-full overflow-hidden border-4 border-navarra-stone shadow-inner bg-black mb-6">
          {sealBg && <img src={sealBg} alt="Hueco Vacío" className="w-full h-full object-cover opacity-60" />}

          {placedSymbol === 'CHRISMON' && (
            <div className="absolute inset-0 flex items-center justify-center animate-fade-in bg-black/40">
              <span className="text-8xl text-navarra-gold filter drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]">☧</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'STAR', icon: '✡', color: 'text-blue-300' },
            { id: 'CROSS', icon: '✝', color: 'text-gray-300' },
            { id: 'SHELL', icon: '🐚', color: 'text-yellow-200' },
            { id: 'CHRISMON', icon: '☧', color: 'text-navarra-gold' },
            { id: 'CHAINS', icon: '⛓️', color: 'text-red-400' },
            { id: 'LION', icon: '🦁', color: 'text-amber-600' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleRestoreSelect(opt.id)}
              className="h-16 bg-navarra-panel border border-navarra-gold/30 rounded flex items-center justify-center hover:bg-navarra-gold/10 hover:border-navarra-gold transition-all hover:scale-105 active:scale-95"
            >
              <span className={`text-3xl ${opt.color}`}>{opt.icon}</span>
            </button>
          ))}
        </div>

        {restoreFeedback && (
          <p className="text-navarra-crimson font-bold text-xs animate-pulse bg-black/40 p-2 rounded border border-navarra-crimson/30">
            {restoreFeedback}
          </p>
        )}
      </div>
    );
  }

  if (stage === 'ANALYZE') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-4">
          {t('puzzleComponents.synagogue.stage3')}
        </h4>

        <p className="text-sm text-gray-400 italic mb-4">
          "{t('puzzleComponents.synagogue.analyzeInstr')}"
        </p>

        <div className="relative w-64 h-64 mx-auto select-none p-4 bg-black/40 rounded-full border border-navarra-gold/20">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <circle cx="50" cy="50" r="48" fill="transparent" stroke="#8a7224" strokeWidth="2" />
            <g onClick={() => handleAnalyzeClick('P')} className="cursor-pointer hover:opacity-80 group">
              <line x1="50" y1="5" x2="50" y2="95" stroke="#d4af37" strokeWidth="4" />
              <path d="M 50 10 Q 75 10 75 25 Q 75 40 50 40" fill="none" stroke="#d4af37" strokeWidth="4" />
            </g>
            <g onClick={() => handleAnalyzeClick('X')} className="cursor-pointer hover:opacity-80 group">
              <line x1="20" y1="20" x2="80" y2="80" stroke="#d4af37" strokeWidth="4" />
              <line x1="80" y1="20" x2="20" y2="80" stroke="#d4af37" strokeWidth="4" />
            </g>
            <g onClick={() => handleAnalyzeClick('S')} className="cursor-pointer hover:opacity-80 group">
              <text x="50" y="85" textAnchor="middle" fill="#d4af37" fontSize="20" fontWeight="bold" fontFamily="serif">S</text>
            </g>
            <g onClick={() => handleAnalyzeClick('AO')} className="cursor-pointer hover:opacity-80 group">
              <text x="15" y="55" textAnchor="middle" fill="#d4af37" fontSize="20" fontWeight="bold" fontFamily="serif">α</text>
              <text x="85" y="55" textAnchor="middle" fill="#d4af37" fontSize="20" fontWeight="bold" fontFamily="serif">ω</text>
            </g>
            <g onClick={() => handleAnalyzeClick('BAR')} className="cursor-pointer group">
              <rect x="10" y="40" width="80" height="20" fill="transparent" />
              {showDefect && (
                <line
                  x1="5" y1="50" x2="95" y2="50"
                  stroke="#ef4444"
                  strokeWidth="4"
                  strokeDasharray="4,2"
                  className="animate-pulse"
                />
              )}
            </g>
          </svg>
        </div>

        <div className="min-h-[4rem] flex items-center justify-center px-4">
          {analyzeFeedback && (
            <div className={`p-3 rounded text-sm font-bold shadow-lg animate-fade-in
                        ${analyzeFeedback.type === 'success' ? 'bg-green-900/90 border border-green-500 text-white' :
                analyzeFeedback.type === 'error' ? 'bg-red-900/80 border border-red-500 text-white' :
                  'bg-blue-900/60 border border-blue-500 text-blue-100'
              }`}>
              {analyzeFeedback.msg}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (stage === 'FINISHED') {
    return (
      <div className="space-y-6 animate-fade-in text-center p-4">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-xl mb-4 animate-pulse">
          {t('puzzleComponents.synagogue.finishedTitle')}
        </h4>

        <div className="bg-navarra-panel/80 p-6 rounded-lg border-2 border-navarra-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <p className="text-white mb-6">
            {t('puzzleComponents.synagogue.finishedDesc')}
          </p>

          <div className="flex flex-col gap-4">
            <Button
              variant="secondary"
              onClick={() => setActiveModal('chrismon')}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-xl">☧</span> {t('puzzleComponents.synagogue.btnChrismon')}
            </Button>

            <Button
              variant="secondary"
              onClick={() => setActiveModal('jus_castillo')}
              className="flex items-center justify-center gap-2"
            >
              <span className="text-xl">⛪</span> {t('puzzleComponents.synagogue.btnHistory')}
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-navarra-gold/20">
          <Button
            onClick={() => onSolved('MISSING_BAR')}
            className="w-full py-4 text-lg shadow-xl animate-pulse-slow"
          >
            {t('puzzleComponents.synagogue.btnContinue')}
          </Button>
        </div>

        {activeModal && extendedInfo[activeModal] && (
          <LearnMoreModal
            data={extendedInfo[activeModal]}
            onClose={() => setActiveModal(null)}
          />
        )}
      </div>
    );
  }

  return null;
};

export default SynagoguePuzzle;
