
import React, { useState } from 'react';
import { Button } from '../UIComponents';
import { CryptexRoller } from '../../types';
import { useTranslation } from 'react-i18next';

interface CryptexPuzzleProps {
  config: CryptexRoller[];
  onSolved: (selection: string[]) => void;
  onMistake?: () => void;
}

const CryptexPuzzle: React.FC<CryptexPuzzleProps> = ({ config, onSolved, onMistake }) => {
  const { t } = useTranslation();
  const [selections, setSelections] = useState<string[]>(config.map(r => r.options[0].id));

  const handleSelect = (rollerIndex: number, direction: 'up' | 'down') => {
    const newSelections = [...selections];
    const roller = config[rollerIndex];
    const currentIndex = roller.options.findIndex(opt => opt.id === selections[rollerIndex]);
    
    let nextIndex;
    if (direction === 'up') {
        nextIndex = currentIndex === 0 ? roller.options.length - 1 : currentIndex - 1;
    } else {
        nextIndex = currentIndex === roller.options.length - 1 ? 0 : currentIndex + 1;
    }
    
    newSelections[rollerIndex] = roller.options[nextIndex].id;
    setSelections(newSelections);
  };

  const currentOptions = selections.map((id, idx) => 
    config[idx].options.find(opt => opt.id === id)
  );

  const correctAnswers = ['maza', 'ombligo', 'cabeza'];

  const handleUnlock = () => {
    const currentAnswer = selections;
    const isCorrect = JSON.stringify(currentAnswer) === JSON.stringify(correctAnswers);

    if (isCorrect) {
      onSolved(selections);
    } else {
      if (onMistake) onMistake();
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        {config.map((roller, idx) => (
            <div key={roller.id} className="flex flex-col bg-navarra-panel/80 border border-navarra-stone rounded overflow-hidden shadow-lg">
                 
                 {/* Header / Label */}
                 <div className="bg-black/60 p-2 min-h-[3rem] flex items-center justify-center border-b border-navarra-stone/50">
                     <h4 className="text-[9px] text-navarra-gold uppercase tracking-wider font-bold text-center leading-tight">
                        {roller.label}
                     </h4>
                 </div>

                 {/* Roller Mechanism */}
                 <div className="flex flex-col bg-navarra-dark">
                    <button 
                        onClick={() => handleSelect(idx, 'up')}
                        className="py-2 text-navarra-gold/50 hover:text-navarra-gold hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                        <span className="text-[10px] transform scale-x-150">▲</span>
                    </button>
                    
                    {/* Selected Item Display */}
                    <div className="h-16 px-1 bg-gradient-to-b from-black via-navarra-stone to-black border-y-2 border-navarra-gold flex items-center justify-center relative shadow-inner">
                        {/* Highlights for metallic effect */}
                        <div className="absolute top-0 inset-x-0 h-[1px] bg-white/20"></div>
                        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-white/20"></div>
                        
                        <span className="text-[10px] font-serif font-bold text-white text-center leading-3 whitespace-normal">
                             {currentOptions[idx]?.label}
                        </span>
                    </div>

                    <button 
                        onClick={() => handleSelect(idx, 'down')}
                        className="py-2 text-navarra-gold/50 hover:text-navarra-gold hover:bg-white/5 transition-colors flex items-center justify-center"
                    >
                        <span className="text-[10px] transform scale-x-150">▼</span>
                    </button>
                 </div>
            </div>
        ))}
      </div>

      <div className="text-center py-2 px-4 bg-black/20 rounded border border-navarra-gold/10">
         <p className="text-navarra-parchment/70 text-xs italic font-serif">
            {t('puzzleComponents.cryptex.instruction')}
         </p>
      </div>

      <Button onClick={handleUnlock} className="w-full py-3 text-sm uppercase tracking-widest shadow-lg animate-pulse-slow">
        {t('puzzleComponents.cryptex.unlock')}
      </Button>
    </div>
  );
};

export default CryptexPuzzle;
