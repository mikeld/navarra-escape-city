
import React, { useState, useEffect } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface CoinPuzzleProps {
  onSolved: (val: number) => void;
  onMistake?: () => void;
}

const CoinPuzzle: React.FC<CoinPuzzleProps> = ({ onSolved, onMistake }) => {
  const { t } = useTranslation();
  const [libras, setLibras] = useState(0);
  const [sueldos, setSueldos] = useState(0);
  const [dineros, setDineros] = useState(0);
  const [totalSueldos, setTotalSueldos] = useState(0);

  useEffect(() => {
    // 1 Libra = 20 Sueldos
    // 1 Sueldo = 12 Dineros (so 12 dineros = 1 sueldo)
    const calculated = (libras * 20) + sueldos + Math.floor(dineros / 12);
    setTotalSueldos(calculated);
  }, [libras, sueldos, dineros]);

  const handleCheck = () => {
    onSolved(totalSueldos);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 font-serif text-center">
        <div className="p-4 border border-navarra-gold/30 bg-black/40 rounded">
          <h4 className="text-navarra-gold text-sm uppercase mb-2">{t('puzzleComponents.coin.pounds')}</h4>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setLibras(Math.max(0, libras - 1))} className="text-2xl text-navarra-crimson">-</button>
            <span className="text-3xl font-bold text-white w-12">{libras}</span>
            <button onClick={() => setLibras(libras + 1)} className="text-2xl text-navarra-gold">+</button>
          </div>
          <p className="text-xs text-gray-400 mt-2">{t('puzzleComponents.coin.rule1')}</p>
        </div>

        <div className="p-4 border border-navarra-gold/30 bg-black/40 rounded">
          <h4 className="text-navarra-gold text-sm uppercase mb-2">{t('puzzleComponents.coin.shillings')}</h4>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setSueldos(Math.max(0, sueldos - 1))} className="text-2xl text-navarra-crimson">-</button>
            <span className="text-3xl font-bold text-white w-12">{sueldos}</span>
            <button onClick={() => setSueldos(sueldos + 1)} className="text-2xl text-navarra-gold">+</button>
          </div>
        </div>

        <div className="p-4 border border-navarra-gold/30 bg-black/40 rounded">
          <h4 className="text-navarra-gold text-sm uppercase mb-2">{t('puzzleComponents.coin.pennies')}</h4>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setDineros(Math.max(0, dineros - 1))} className="text-2xl text-navarra-crimson">-</button>
            <span className="text-3xl font-bold text-white w-12">{dineros}</span>
            <button onClick={() => setDineros(dineros + 1)} className="text-2xl text-navarra-gold">+</button>
          </div>
          <p className="text-xs text-gray-400 mt-2">{t('puzzleComponents.coin.rule2')}</p>
        </div>
      </div>

      <div className="text-center py-2">
        <p className="text-sm uppercase tracking-widest text-navarra-parchment/60">
            {t('puzzleComponents.coin.total')}: <span className="text-navarra-gold font-bold text-xl">{totalSueldos}</span>
        </p>
      </div>

      <Button onClick={handleCheck} className="w-full">
        {t('puzzleComponents.coin.weigh')}
      </Button>
    </div>
  );
};

export default CoinPuzzle;
