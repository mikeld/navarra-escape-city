import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Enigma } from '../../types';
import { EnigmaTable } from './EnigmaTable';
import { FindDifferencesGame } from './FindDifferencesGame';
import { useAuth } from '../../contexts/AuthContext';
import { markEnigmaCompleted } from '../../services/userService';

interface EnigmaDetailModalProps {
    enigma: Enigma;
    isOpen: boolean;
    onClose: () => void;
}

export const EnigmaDetailModal: React.FC<EnigmaDetailModalProps> = ({ enigma, isOpen, onClose }) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isSolved, setIsSolved] = useState(false);
    const [userValue, setUserValue] = useState('');
    const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

    if (!isOpen) return null;

    const handleValidate = async (isCorrect: boolean) => {
        if (isCorrect) {
            setIsSolved(true);
            setFeedback('success');
            if (user) {
                try {
                    await markEnigmaCompleted(user.uid, enigma.id);
                } catch (error) {
                    console.error('Error saving enigma progress:', error);
                }
            }
        } else {
            setFeedback('error');
        }
    };

    const handleInputCheck = () => {
        const isCorrect = userValue.trim().toLowerCase() === (enigma.correctAnswer as string).toLowerCase();
        handleValidate(isCorrect);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-navarra-dark to-navarra-panel border-2 border-navarra-gold/40 rounded-xl shadow-2xl overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-navarra-dark/80 hover:bg-red-900/80 text-white rounded-full border border-navarra-gold/30 hover:border-red-500 transition-all duration-300"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh] p-6 md:p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block px-4 py-1 bg-navarra-gold/20 border border-navarra-gold/40 rounded-full mb-4">
                            <span className="text-navarra-gold text-xs uppercase tracking-widest font-bold">
                                {t('enigmas.viewTag')} #{enigma.number}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                            {t(enigma.title)}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-navarra-gold to-transparent mx-auto"></div>
                    </div>

                    {/* Mission Description */}
                    <div className="bg-navarra-panel/50 border-l-4 border-navarra-gold p-6 rounded-lg mb-8">
                        <h3 className="text-navarra-gold font-bold text-lg mb-3 flex items-center gap-2">
                            {t('enigmas.missionTitle')}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                            {t(enigma.description)}
                        </p>
                    </div>

                    {/* Clues Section (Hidden for DIFFERENCES type) */}
                    {enigma.type !== 'DIFFERENCES' && (
                        <div className="mb-8">
                            <h3 className="text-navarra-gold font-bold text-xl mb-4 flex items-center gap-2">
                                {t('enigmas.cluesTitle')}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {enigma.clues.map((clue, index) => (
                                    <div
                                        key={index}
                                        className="bg-navarra-dark/50 border border-navarra-gold/20 p-4 rounded-lg hover:border-navarra-gold/40 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-8 h-8 bg-navarra-gold/20 text-navarra-gold rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            <p className="text-gray-300 text-sm leading-relaxed pt-1">
                                                {t(clue)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Interactive Content */}
                    <div className="bg-navarra-panel/30 border-2 border-navarra-gold/30 p-6 rounded-xl">
                        <h3 className="text-navarra-gold font-bold text-xl mb-6 text-center">
                            📋 {t('enigmas.missionTitle')}
                        </h3>

                        {enigma.type === 'DIFFERENCES' ? (
                            <FindDifferencesGame
                                gameImage={enigma.image || ''}
                                solutionImage={enigma.solutionImage || enigma.image || ''}
                                differences={enigma.differences || []}
                                onComplete={() => handleValidate(true)}
                            />
                        ) : enigma.table ? (
                            <EnigmaTable
                                tableConfig={enigma.table}
                                onValidate={handleValidate}
                            />
                        ) : enigma.type === 'INPUT' ? (
                            <div className="max-w-md mx-auto">
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        value={userValue}
                                        onChange={(e) => {
                                            setUserValue(e.target.value);
                                            setFeedback(null);
                                        }}
                                        disabled={isSolved}
                                        placeholder={t('enigmas.tablePlaceholder')}
                                        className={`w-full bg-navarra-dark/50 text-white px-4 py-3 rounded-lg border-2 ${feedback === 'success'
                                            ? 'border-green-500'
                                            : feedback === 'error'
                                                ? 'border-red-500'
                                                : 'border-navarra-gold/30'
                                            } focus:outline-none focus:border-navarra-gold transition-all text-center text-lg`}
                                    />
                                </div>

                                {feedback && (
                                    <div className={`mb-6 p-4 rounded-lg text-center font-bold animate-fade-in ${feedback === 'success'
                                        ? 'bg-green-900/30 border border-green-500 text-green-400'
                                        : 'bg-red-900/30 border border-red-500 text-red-400'
                                        }`}>
                                        {feedback === 'success' ? t('enigmas.successTitle') : t('enigmas.errorTitle')}
                                        <p className="text-sm font-normal mt-1">
                                            {feedback === 'success' ? t('enigmas.successMessage') : t('enigmas.errorMessage')}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleInputCheck}
                                    disabled={isSolved || !userValue.trim()}
                                    className={`w-full py-3 px-6 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 ${isSolved
                                        ? 'bg-green-600 text-white opacity-50 cursor-not-allowed'
                                        : 'bg-navarra-gold hover:bg-navarra-gold/80 text-navarra-dark'
                                        }`}
                                >
                                    {isSolved ? '✓ ' + t('enigmas.successTitle') : t('enigmas.checkSolution')}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center text-red-400">Error: Configuration missing</div>
                        )}
                    </div>

                    {/* Solution Text (shown after solving) */}
                    {isSolved && enigma.solutionText && (
                        <div className="mt-8 bg-green-900/20 border-2 border-green-500/50 p-6 rounded-lg animate-fade-in">
                            <h3 className="text-green-400 font-bold text-xl mb-3">
                                🎉 ¡Enigma Resuelto!
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {t(enigma.solutionText)}
                            </p>
                        </div>
                    )}

                    {/* Solution Video Button */}
                    {enigma.youtubeVideoId && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => window.open(`https://www.youtube.com/watch?v=${enigma.youtubeVideoId}`, '_blank')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors shadow-lg hover:shadow-red-900/50"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                                {t('enigmas.viewSolutionVideo')}
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
