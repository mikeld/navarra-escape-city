
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GLOSSARY_TERMS } from '../../../constants';

interface ViewProps {
    onBack: () => void;
}

export const GlossaryView: React.FC<ViewProps> = ({ onBack }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTerms = GLOSSARY_TERMS.filter(term =>
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t(term.defKey).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <button onClick={onBack} className="mb-6 flex items-center gap-2 text-navarra-gold hover:text-white transition-colors uppercase tracking-widest text-xs font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t('common.back')}
            </button>

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <h2 className="text-3xl font-serif text-white">{t('historySection.tabs.glossary')}</h2>
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Buscar término..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-full py-2 px-4 text-white focus:outline-none focus:border-navarra-gold transition-colors text-sm"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {filteredTerms.length > 0 ? (
                    filteredTerms.map((term, idx) => (
                        <div key={idx} className="bg-navarra-panel/60 p-6 border border-navarra-gold/20 rounded-lg hover:border-navarra-gold/50 transition-colors hover:shadow-lg">
                            <h4 className="text-navarra-gold font-bold mb-3 font-serif uppercase tracking-wider text-base border-b border-navarra-gold/10 pb-2">{term.term}</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">{t(term.defKey)}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                        No se encontraron términos.
                    </div>
                )}
            </div>
        </div>
    );
};
