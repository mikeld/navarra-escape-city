
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QUIZ_QUESTIONS, FLASHCARD_DATA } from '../../../constants';
import { QuizTab } from '../../QuizTab';

interface ViewProps {
    onBack: () => void;
}

export const QuizView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<'QUIZ' | 'FLASHCARDS'>('QUIZ');

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <div className="text-center mb-8">
                <div className="inline-flex bg-black/40 p-1 rounded-lg border border-white/10">
                    <button
                        onClick={() => setMode('QUIZ')}
                        className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all ${mode === 'QUIZ' ? 'bg-navarra-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t('historySection.tabs.quiz')}
                    </button>
                    <button
                        onClick={() => setMode('FLASHCARDS')}
                        className={`px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all ${mode === 'FLASHCARDS' ? 'bg-navarra-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        {t('historySection.tabs.challenge')}
                    </button>
                </div>
            </div>

            <div className="bg-black/20 p-4 md:p-8 rounded-xl border border-white/5 min-h-[400px]">
                <QuizTab mode={mode} questions={QUIZ_QUESTIONS} flashcards={FLASHCARD_DATA} />
            </div>
        </div>
    );
};
