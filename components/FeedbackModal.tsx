
import React, { useState, useEffect } from 'react';
import { Button } from './UIComponents';
import { saveGameFeedback } from '../services/gameService';

interface FeedbackModalProps {
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [likedMost, setLikedMost] = useState('');
  const [likedLeast, setLikedLeast] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [listeningField, setListeningField] = useState<'most' | 'least' | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const handleVoiceInput = (field: 'most' | 'least') => {
    if (!speechSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListeningField(field);
    recognition.onend = () => setListeningField(null);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (field === 'most') {
        setLikedMost(prev => (prev ? prev + ' ' + transcript : transcript));
      } else {
        setLikedLeast(prev => (prev ? prev + ' ' + transcript : transcript));
      }
    };

    recognition.start();
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    setIsSubmitting(true);
    
    await saveGameFeedback({
      rating,
      userName: name.trim() || 'Viajero Anónimo',
      likedMost,
      likedLeast,
      date: new Date().toISOString(),
      platform: navigator.userAgent
    });

    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(onClose, 3000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-navarra-panel border-2 border-navarra-gold p-8 rounded-lg text-center max-w-sm w-full">
          <div className="text-6xl mb-4 animate-bounce">💖</div>
          <h3 className="text-2xl font-serif text-navarra-gold font-bold mb-2">¡Gracias, {name || 'Viajero'}!</h3>
          <p className="text-gray-300">Tu opinión nos ayuda a mejorar esta aventura histórica.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4 animate-fade-in backdrop-blur-md">
      <div className="bg-navarra-dark w-full max-w-lg rounded-lg border border-navarra-gold shadow-[0_0_50px_rgba(212,175,55,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-navarra-gold/10 p-6 border-b border-navarra-gold/30 text-center relative shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
          <span className="text-xs uppercase tracking-[0.3em] text-navarra-gold font-bold">Fase Beta</span>
          <h3 className="text-2xl font-serif text-white mt-1">Tu Opinión es Oro</h3>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* Name Input */}
          <div>
            <label className="text-xs font-bold text-navarra-gold uppercase tracking-wider block mb-2">
                ¿Cómo te llamas? <span className="text-gray-500 font-normal lowercase">(Opcional)</span>
            </label>
            <input 
                type="text" 
                placeholder="Nombre o Apodo" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border-b-2 border-navarra-gold/50 text-white p-3 focus:outline-none focus:border-navarra-gold font-serif text-lg placeholder-gray-600"
            />
          </div>

          {/* Stars */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">¿Cuánto te ha gustado la experiencia?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-all hover:scale-110 ${rating >= star ? 'text-navarra-gold drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]' : 'text-gray-700'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-navarra-gold uppercase tracking-wider flex justify-between items-center">
                ¿Qué es lo que más te ha gustado?
                {speechSupported && (
                  <button 
                    onClick={() => handleVoiceInput('most')}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${listeningField === 'most' ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                  >
                    {listeningField === 'most' ? 'Escuchando...' : '🎤 Dictar'}
                  </button>
                )}
              </label>
              <textarea
                className="w-full bg-black/40 border border-navarra-stone rounded p-3 text-white text-sm focus:border-navarra-gold focus:outline-none resize-none"
                rows={2}
                placeholder="Ej: Los puzzles, la historia..."
                value={likedMost}
                onChange={(e) => setLikedMost(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-navarra-crimson uppercase tracking-wider flex justify-between items-center">
                ¿Qué mejorarías?
                {speechSupported && (
                  <button 
                    onClick={() => handleVoiceInput('least')}
                    className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${listeningField === 'least' ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                  >
                    {listeningField === 'least' ? 'Escuchando...' : '🎤 Dictar'}
                  </button>
                )}
              </label>
              <textarea
                className="w-full bg-black/40 border border-navarra-stone rounded p-3 text-white text-sm focus:border-navarra-gold focus:outline-none resize-none"
                rows={2}
                placeholder="Ej: Dificultad, textos largos..."
                value={likedLeast}
                onChange={(e) => setLikedLeast(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting} 
            className="w-full"
          >
            {isSubmitting ? 'Guardando...' : 'Enviar Reseña'}
          </Button>
        </div>
      </div>
    </div>
  );
};
