
import React, { useState } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface BridgePuzzleProps {
  onSolved: (val: string) => void;
  onMistake?: () => void;
}

type Stage = 'ASCENT' | 'SUMMIT' | 'DESCENT';

const BridgePuzzle: React.FC<BridgePuzzleProps> = ({ onSolved, onMistake }) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>('ASCENT');
  
  const [stepCount, setStepCount] = useState('');
  const [stepError, setStepError] = useState(false);

  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [jammerSuccess, setJammerSuccess] = useState(false);

  const [finalLetter, setFinalLetter] = useState('');
  const [finalError, setFinalError] = useState(false);

  const handleAscentSubmit = () => {
    if (stepCount === '16') {
      setStepError(false);
      setStage('SUMMIT');
    } else {
      if (onMistake) onMistake();
      setStepError(true);
      setTimeout(() => setStepError(false), 2000);
    }
  };

  const handleJammerSubmit = () => {
    if (rows === 2 && cols === 2) {
      setJammerSuccess(true);
      setTimeout(() => {
        setStage('DESCENT');
      }, 2000);
    } else {
      if (onMistake) onMistake();
    }
  };

  const handleDescentSubmit = () => {
    const clean = finalLetter.trim().toUpperCase();
    if (clean === 'P') {
      onSolved('P');
    } else {
      if (onMistake) onMistake();
      setFinalError(true);
      setTimeout(() => setFinalError(false), 2000);
    }
  };

  if (stage === 'ASCENT') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-2">
          {t('puzzleComponents.bridge.stage1')}
        </h4>
        
        <div className="bg-navarra-panel border-l-4 border-navarra-gold p-4 text-left text-sm text-gray-300 italic mb-6">
          <p className="mt-2 text-white font-bold">{t('puzzleComponents.bridge.instr1')}</p>
        </div>

        <div className="flex justify-center">
            <input 
                type="number" 
                placeholder="#"
                value={stepCount}
                onChange={(e) => setStepCount(e.target.value)}
                className="w-32 bg-black text-center text-4xl text-navarra-gold font-mono p-4 border-2 border-navarra-stone rounded focus:border-navarra-gold focus:outline-none"
            />
        </div>

        {stepError && <p className="text-red-400 text-xs animate-pulse font-bold mt-2">{t('puzzleComponents.common.error')}</p>}

        <Button onClick={handleAscentSubmit} className="w-full mt-4">
            {t('puzzleComponents.bridge.btn1')}
        </Button>
      </div>
    );
  }

  if (stage === 'SUMMIT') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-2">
          {t('puzzleComponents.bridge.stage2')}
        </h4>

        <div className="bg-navarra-panel border-l-4 border-navarra-crimson p-4 text-left text-sm text-gray-300 italic mb-4">
          <p className="mt-2">{t('puzzleComponents.bridge.instr2')}</p>
        </div>

        <div className="relative w-48 h-48 mx-auto bg-black rounded-full border-4 border-gray-600 overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)] group">
            {jammerSuccess && (
                <div className="absolute inset-0 bg-white z-20 animate-pulse flex items-center justify-center">
                    <span className="text-black font-bold text-xs uppercase">{t('puzzleComponents.bridge.btn2done')}</span>
                </div>
            )}
            
            <div className="absolute inset-0 flex flex-col justify-evenly">
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={`r-${i}`} className="w-full h-1 bg-navarra-gold shadow-[0_0_5px_#d4af37]"></div>
                ))}
            </div>
            <div className="absolute inset-0 flex flex-row justify-evenly">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={`c-${i}`} className="h-full w-1 bg-navarra-gold shadow-[0_0_5px_#d4af37]"></div>
                ))}
            </div>
        </div>

        <div className="space-y-4 px-4 bg-navarra-panel p-4 rounded border border-navarra-stone/50">
            <div>
                <label className="text-xs uppercase text-gray-500 font-bold flex justify-between">
                    {t('puzzleComponents.bridge.labelH')} <span>{rows}</span>
                </label>
                <input 
                    type="range" min="0" max="5" value={rows} 
                    onChange={(e) => setRows(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-navarra-gold"
                />
            </div>
            <div>
                <label className="text-xs uppercase text-gray-500 font-bold flex justify-between">
                    {t('puzzleComponents.bridge.labelV')} <span>{cols}</span>
                </label>
                <input 
                    type="range" min="0" max="5" value={cols} 
                    onChange={(e) => setCols(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-navarra-gold"
                />
            </div>
        </div>

        <Button 
            onClick={handleJammerSubmit} 
            disabled={jammerSuccess}
            variant={rows === 2 && cols === 2 ? 'primary' : 'secondary'}
            className="w-full"
        >
            {jammerSuccess ? t('puzzleComponents.bridge.btn2done') : t('puzzleComponents.bridge.btn2')}
        </Button>
      </div>
    );
  }

  if (stage === 'DESCENT') {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-2">
          {t('puzzleComponents.bridge.stage3')}
        </h4>

        <div className="bg-navarra-panel border-l-4 border-navarra-gold p-4 text-left text-sm text-gray-300 italic mb-6">
          <p className="mt-2 text-white font-bold">{t('puzzleComponents.bridge.instr3')}</p>
        </div>

        <div className="bg-black/40 p-8 rounded border border-navarra-stone flex flex-col items-center gap-4">
            <input 
                type="text" 
                maxLength={1}
                placeholder="?"
                value={finalLetter}
                onChange={(e) => setFinalLetter(e.target.value)}
                className="w-24 h-24 bg-navarra-dark text-center text-6xl text-white font-serif uppercase border-2 border-navarra-gold rounded focus:outline-none focus:shadow-[0_0_30px_#d4af37]"
            />
        </div>

        {finalError && (
            <p className="text-red-400 text-xs animate-pulse font-bold bg-red-900/20 p-2 rounded">
                {t('puzzleComponents.common.error')}
            </p>
        )}

        <Button onClick={handleDescentSubmit} className="w-full">
            {t('puzzleComponents.bridge.btn3')}
        </Button>
      </div>
    );
  }

  return null;
};

export default BridgePuzzle;
