
import React, { useState, useEffect } from 'react';
import { Button, SafeImage } from '../UIComponents';
import { getStorageUrl } from '../../services/gameService';
import { useTranslation } from 'react-i18next';

interface SepulchrePuzzleProps {
  onSolved: (val: string) => void;
  onMistake?: () => void;
}

type Stage = 'TRAITOR' | 'PROOF' | 'INDIFFERENT' | 'VICTIMS';

const SepulchrePuzzle: React.FC<SepulchrePuzzleProps> = ({ onSolved, onMistake }) => {
  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>('TRAITOR');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      const urls: string[] = [];
      for (let i = 1; i <= 15; i++) {
        const url = await getStorageUrl(`assets/games/sepulcro/${i}.png`);
        if (url) urls.push(url);
        else urls.push('placeholder');
      }
      setImages(urls);
      setLoading(false);
    };
    loadImages();
  }, []);

  const handleImageClick = (index: number) => {
    const imgNumber = index + 1;
    if (feedback?.type === 'success') return;

    setFeedback(null);

    if (stage === 'TRAITOR') {
      if (imgNumber === 8) {
        setFeedback({ msg: t('puzzleComponents.sepulchre.success1'), type: 'success' });
        setTimeout(() => { setStage('PROOF'); setFeedback(null); }, 4000);
      } else {
        if (onMistake) onMistake();
        setFeedback({ msg: t('puzzleComponents.common.error'), type: 'error' });
      }
    } else if (stage === 'INDIFFERENT') {
      if (imgNumber === 7) {
        setFeedback({ msg: t('puzzleComponents.sepulchre.success3'), type: 'success' });
        setTimeout(() => { setStage('VICTIMS'); setFeedback(null); }, 4000);
      } else {
        if (onMistake) onMistake();
        setFeedback({ msg: t('puzzleComponents.common.error'), type: 'error' });
      }
    } else if (stage === 'VICTIMS') {
      if (imgNumber === 1) {
        setFeedback({ msg: t('puzzleComponents.sepulchre.success4'), type: 'success' });
        setTimeout(() => {
            onSolved('COMPLETE');
        }, 4000);
      } else {
        if (onMistake) onMistake();
        setFeedback({ msg: t('puzzleComponents.common.error'), type: 'error' });
      }
    }
  };

  const handleProofOption = (correct: boolean) => {
      if (feedback?.type === 'success') return;

      if (correct) {
          setFeedback({ msg: t('puzzleComponents.sepulchre.success2'), type: 'success' });
          setTimeout(() => { setStage('INDIFFERENT'); setFeedback(null); }, 4000);
      } else {
          if (onMistake) onMistake();
          setFeedback({ msg: t('puzzleComponents.common.error'), type: 'error' });
      }
  };

  if (loading) return <div className="text-center animate-pulse text-navarra-gold">{t('common.loading')}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="bg-navarra-dark border border-navarra-gold/30 p-4 rounded text-center">
        <h4 className="text-navarra-crimson font-bold uppercase tracking-widest text-sm mb-2">
            {stage === 'TRAITOR' && t('puzzleComponents.sepulchre.obj1')}
            {stage === 'PROOF' && t('puzzleComponents.sepulchre.obj2')}
            {stage === 'INDIFFERENT' && t('puzzleComponents.sepulchre.obj3')}
            {stage === 'VICTIMS' && t('puzzleComponents.sepulchre.obj4')}
        </h4>
        <p className="text-gray-300 text-sm italic">
            {stage === 'TRAITOR' && t('puzzleComponents.sepulchre.hint1')}
            {stage === 'PROOF' && t('puzzleComponents.sepulchre.hint2')}
            {stage === 'INDIFFERENT' && t('puzzleComponents.sepulchre.hint3')}
            {stage === 'VICTIMS' && t('puzzleComponents.sepulchre.hint4')}
        </p>
      </div>

      {feedback && (
          <div className={`p-4 text-center text-sm font-bold rounded shadow-lg animate-pulse ${feedback.type === 'success' ? 'bg-green-900 border border-green-500 text-white' : 'bg-red-900/50 text-red-400'}`}>
              {feedback.msg}
          </div>
      )}

      {stage === 'PROOF' ? (
          <div className="grid grid-cols-1 gap-3">
              <Button variant="secondary" onClick={() => handleProofOption(false)}>{t('puzzleComponents.sepulchre.options.a')}</Button>
              <Button variant="secondary" onClick={() => handleProofOption(false)}>{t('puzzleComponents.sepulchre.options.b')}</Button>
              <Button variant="secondary" onClick={() => handleProofOption(true)}>{t('puzzleComponents.sepulchre.options.c')}</Button>
              <Button variant="secondary" onClick={() => handleProofOption(false)}>{t('puzzleComponents.sepulchre.options.d')}</Button>
          </div>
      ) : (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {images.map((url, idx) => (
                <button 
                    key={idx} 
                    onClick={() => handleImageClick(idx)}
                    className="aspect-square bg-black border border-navarra-stone hover:border-navarra-gold hover:scale-105 transition-all rounded overflow-hidden relative group"
                >
                    {url !== 'placeholder' ? (
                        <SafeImage src={url} alt={`Sospechoso ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-700 text-xs">{idx + 1}</span>
                    )}
                    <div className="absolute inset-0 bg-navarra-gold/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
            ))}
          </div>
      )}
    </div>
  );
};

export default SepulchrePuzzle;
