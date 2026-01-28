
import React, { useState } from 'react';
import { QuizQuestion, Flashcard } from '../types';
import { useTranslation } from 'react-i18next';

interface QuizTabProps {
    questions: QuizQuestion[];
    flashcards: Flashcard[];
    mode: 'QUIZ' | 'FLASHCARDS';
}

export const QuizTab: React.FC<QuizTabProps> = ({ questions, flashcards, mode }) => {
    const { t } = useTranslation();

    // State for Quiz
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({});
    const [showQuizResult, setShowQuizResult] = useState<Record<number, boolean>>({});

    // State for Flashcards
    const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

    // Quiz Handlers
    const handleQuizAnswer = (qId: number, optIdx: number) => {
        setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
        setShowQuizResult(prev => ({ ...prev, [qId]: true }));
    };

    // Flashcard Handlers
    const toggleFlip = (id: number) => {
        setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (mode === 'QUIZ') {
        return (
            <div className="space-y-8 max-w-2xl mx-auto animate-slide-up">
                <p className="text-center text-gray-400 italic mb-6">{t('quiz.ui.quizDescription')}</p>
                {questions.map(q => {
                    const isAnswered = showQuizResult[q.id];
                    const selected = quizAnswers[q.id];
                    const isCorrect = selected === q.correctAnswer;

                    // Translations with fallback to data
                    const translatedQuestion = t(`quiz.questions.${q.id}.question`, q.question) as string;
                    const translatedExplanation = t(`quiz.questions.${q.id}.explanation`, q.explanation) as string;
                    const translatedOptions = t(`quiz.questions.${q.id}.options`, { returnObjects: true, defaultValue: q.options }) as string[];

                    return (
                        <div key={q.id} className="bg-navarra-panel p-6 border border-navarra-gold/30 rounded-lg shadow-lg">
                            <h4 className="text-white font-bold text-lg mb-4">{translatedQuestion}</h4>
                            <div className="space-y-2">
                                {translatedOptions.map((opt, idx) => {
                                    let btnClass = "w-full text-left p-3 rounded border transition-all text-sm font-sans ";
                                    if (isAnswered) {
                                        if (idx === q.correctAnswer) btnClass += "bg-green-900/50 border-green-500 text-green-200";
                                        else if (idx === selected) btnClass += "bg-red-900/50 border-red-500 text-red-200";
                                        else btnClass += "bg-black/20 border-gray-700 text-gray-500 opacity-50";
                                    } else {
                                        btnClass += "bg-black/40 border-gray-600 text-gray-300 hover:bg-navarra-gold/10 hover:border-navarra-gold";
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => !isAnswered && handleQuizAnswer(q.id, idx)}
                                            disabled={isAnswered}
                                            className={btnClass}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            {isAnswered && (
                                <div className={`mt-4 p-3 rounded text-sm ${isCorrect ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                    <p className="font-bold mb-1">{isCorrect ? t('quiz.ui.correct') : t('quiz.ui.incorrect')}</p>
                                    <p className="text-gray-300">{translatedExplanation}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (mode === 'FLASHCARDS') {
        return (
            <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
                <p className="text-center text-gray-400 italic mb-6">{t('quiz.ui.flashcardsDescription')}</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {flashcards.map(card => {
                        const isFlipped = flippedCards[card.id];
                        // Translations with fallback to data
                        const translatedQ = t(`quiz.flashcards.${card.id}.q`, card.question) as string;
                        const translatedA = t(`quiz.flashcards.${card.id}.a`, card.answer) as string;

                        return (
                            <div
                                key={card.id}
                                onClick={() => toggleFlip(card.id)}
                                className="relative h-64 cursor-pointer perspective-1000 group"
                            >
                                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden bg-navarra-panel border-2 border-navarra-gold/40 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-xl hover:border-navarra-gold">
                                        <span className="text-navarra-crimson text-xs font-bold uppercase tracking-widest mb-2">{t('quiz.ui.question')} {card.id}</span>
                                        <p className="text-white font-serif font-bold text-lg leading-relaxed">{translatedQ}</p>
                                        <span className="text-xs text-navarra-gold mt-4 animate-pulse">{t('quiz.ui.clickToReveal')}</span>
                                    </div>
                                    {/* Back */}
                                    <div className="absolute inset-0 backface-hidden bg-navarra-stone border-2 border-navarra-gold rounded-lg p-6 flex flex-col items-center justify-center text-center rotate-y-180 shadow-inner">
                                        <span className="text-navarra-gold text-xs font-bold uppercase tracking-widest mb-2">{t('quiz.ui.answer')}</span>
                                        <p className="text-white font-sans text-base leading-relaxed">{translatedA}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return null;
};
