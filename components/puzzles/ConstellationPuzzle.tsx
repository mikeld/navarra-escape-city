
import React, { useState } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface ConstellationPuzzleProps {
  onSolved: (selection: string[]) => void;
  onMistake?: () => void;
}

const STARS = [
  { id: 'betelgeuse', x: 20, y: 20, label: 'Betelgeuse (San Pedro)' },
  { id: 'rigel', x: 80, y: 80, label: 'Rigel (Ega)' },
  { id: 'bellatrix', x: 80, y: 20, label: 'Bellatrix (Peña)' },
  { id: 'saiph', x: 20, y: 80, label: 'Saiph' },
  { id: 'mintaka', x: 45, y: 50, label: 'Mintaka' },
  { id: 'alnilam', x: 50, y: 45, label: 'Alnilam' },
  { id: 'alnitak', x: 55, y: 40, label: 'Alnitak' },
];

const ConstellationPuzzle: React.FC<ConstellationPuzzleProps> = ({ onSolved, onMistake }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleStar = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      if (selected.length < 3) {
        setSelected([...selected, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm italic text-center text-navarra-parchment/80">
        "{t('puzzleComponents.constellation.instruction')}"
      </p>
      
      <div className="relative w-full aspect-square bg-black border border-navarra-gold/30 rounded-full overflow-hidden shadow-inner shadow-navarra-gold/20">
        {/* Simple SVG representation of Orion */}
        <svg className="w-full h-full absolute inset-0 pointer-events-none z-0 opacity-20">
            <line x1="20%" y1="20%" x2="50%" y2="45%" stroke="white" strokeWidth="1" />
            <line x1="80%" y1="20%" x2="50%" y2="45%" stroke="white" strokeWidth="1" />
            <line x1="45%" y1="50%" x2="50%" y2="45%" stroke="white" strokeWidth="1" />
            <line x1="50%" y1="45%" x2="55%" y2="40%" stroke="white" strokeWidth="1" />
            <line x1="20%" y1="80%" x2="45%" y2="50%" stroke="white" strokeWidth="1" />
            <line x1="80%" y1="80%" x2="55%" y2="40%" stroke="white" strokeWidth="1" />
        </svg>

        {STARS.map(star => (
          <button
            key={star.id}
            onClick={() => toggleStar(star.id)}
            className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full transition-all duration-500 z-10 flex items-center justify-center
              ${selected.includes(star.id) 
                ? 'bg-navarra-gold shadow-[0_0_15px_#d4af37] scale-125' 
                : 'bg-white/30 hover:bg-white/60'}`}
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
          >
            {selected.includes(star.id) && <span className="block w-2 h-2 bg-white rounded-full animate-ping" />}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2 min-h-[2rem]">
        {selected.map(id => {
            const star = STARS.find(s => s.id === id);
            return (
                <span key={id} className="text-xs px-2 py-1 bg-navarra-gold/20 border border-navarra-gold rounded text-navarra-gold">
                    {star?.label}
                </span>
            )
        })}
      </div>

      <Button onClick={() => onSolved(selected)} disabled={selected.length !== 3} className="w-full">
        {t('puzzleComponents.constellation.align')}
      </Button>
    </div>
  );
};

export default ConstellationPuzzle;
