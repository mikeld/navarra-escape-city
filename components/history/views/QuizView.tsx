
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAVARRA_QUIZ_QUESTIONS, FLASHCARD_DATA } from '../../../constants';
import { QuizTab } from '../../QuizTab';

interface ViewProps {
    onBack: () => void;
}

export const QuizView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-block mb-3 px-4 py-1 bg-navarra-gold/10 border border-navarra-gold/30 rounded-full text-navarra-gold text-xs uppercase tracking-[0.25em] font-bold">
                    Cuestionario
                </div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">{t('historySection.tabs.quiz')}</h2>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    {NAVARRA_QUIZ_QUESTIONS.length} preguntas sobre la Historia de Navarra — desde la Antigüedad hasta la actualidad
                </p>
                <div className="h-0.5 w-24 bg-navarra-gold mx-auto mt-4" />
            </div>

            <div className="bg-black/20 p-4 md:p-8 rounded-xl border border-white/5">
                <QuizTab mode="QUIZ" questions={NAVARRA_QUIZ_QUESTIONS} flashcards={FLASHCARD_DATA} />
            </div>
        </div>
    );
};
