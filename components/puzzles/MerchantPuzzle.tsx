
import React, { useState } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface MerchantPuzzleProps {
  onSolved: (val: string) => void;
  onMistake?: () => void;
}

const MerchantPuzzle: React.FC<MerchantPuzzleProps> = ({ onSolved, onMistake }) => {
  const { t } = useTranslation();
  const [combination, setCombination] = useState([0, 0, 0]);
  const [error, setError] = useState(false);

  const updateDigit = (index: number, direction: 'up' | 'down') => {
    const newCombo = [...combination];
    if (direction === 'up') {
      newCombo[index] = newCombo[index] === 9 ? 0 : newCombo[index] + 1;
    } else {
      newCombo[index] = newCombo[index] === 0 ? 9 : newCombo[index] - 1;
    }
    setCombination(newCombo);
    setError(false);
  };

  const handleUnlock = () => {
    const value = combination.join('');
    if (value === '300') {
      onSolved('300');
    } else {
      if (onMistake) onMistake();
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#fcf5e5] text-gray-900 p-6 rounded-sm shadow-xl relative overflow-hidden border-4 border-double border-[#8a7224] transform rotate-1">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper.png')] pointer-events-none"></div>
        
        <div className="font-serif relative z-10">
          <h4 className="text-center font-bold text-xl uppercase tracking-widest border-b-2 border-gray-400 pb-2 mb-4 text-[#8a1c1c]">
            {t('puzzleComponents.merchant.ledger')}
          </h4>
          
          <div className="bg-white/50 p-3 rounded border border-gray-300 mb-4 text-sm">
            <p className="font-bold underline mb-1">{t('puzzleComponents.merchant.table')}</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{t('puzzleComponents.merchant.rule1')}</li>
              <li>{t('puzzleComponents.merchant.rule2')}</li>
            </ul>
          </div>

          <div className="text-center italic font-medium leading-relaxed whitespace-pre-line">
            {t('puzzleComponents.merchant.story')}
          </div>
        </div>
      </div>

      <div className="bg-navarra-dark p-6 rounded-lg border-2 border-navarra-stone shadow-inner">
        <div className="flex justify-center gap-4 mb-6">
          {combination.map((digit, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <button 
                onClick={() => updateDigit(idx, 'up')}
                className="text-navarra-gold/50 hover:text-navarra-gold transition-colors p-2"
              >
                ▲
              </button>
              <div className="w-12 h-16 bg-gradient-to-b from-black via-gray-800 to-black border-x-4 border-navarra-stone rounded flex items-center justify-center text-3xl font-mono text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                {digit}
              </div>
              <button 
                onClick={() => updateDigit(idx, 'down')}
                className="text-navarra-gold/50 hover:text-navarra-gold transition-colors p-2"
              >
                ▼
              </button>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-center text-red-500 font-bold animate-pulse text-sm mb-4">
            {t('puzzleComponents.merchant.error')}
          </p>
        )}

        <Button onClick={handleUnlock} className="w-full" variant="primary">
          {t('puzzleComponents.merchant.unlock')}
        </Button>
      </div>
    </div>
  );
};

export default MerchantPuzzle;
