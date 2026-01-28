
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlaceWithKeys } from '../../data/places';
import { TIMELINE_EVENTS, GLOSSARY_TERMS, QUIZ_QUESTIONS, FLASHCARD_DATA, WOMEN_HISTORY, CASTLES_DATA } from '../../constants';
// Views
import { ChroniclesView } from './views/ChroniclesView';
import { TimelineView } from './views/TimelineView';
import { MonumentsView } from './views/MonumentsView';
import { CastlesView } from './views/CastlesView';
import { WomenView } from './views/WomenView';
import { GlossaryView } from './views/GlossaryView';
import { QuizView } from './views/QuizView';
import { MultimediaView } from './views/MultimediaView';
import { CharactersView } from '../landing/views/CharactersView';
import { PlacesView } from '../landing/views/PlacesView';
import { SantiagoView } from './views/SantiagoView';

// Types
import { Character } from '../../types';

type HistoryView = 'HUB' | 'MULTIMEDIA' | 'CHRONICLES' | 'TIMELINE' | 'MONUMENTS' | 'CASTLES' | 'WOMEN' | 'GLOSSARY' | 'QUIZ' | 'SANTIAGO' | 'CHARACTERS' | 'PLACES';

interface HistoryHubProps {
    onBack: () => void;
    places: PlaceWithKeys[];
    characters: Character[];
    initialView?: 'CHARACTERS' | 'PLACES';
}

export const HistoryHub: React.FC<HistoryHubProps> = ({ onBack, places, characters, initialView }) => {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState<HistoryView>(initialView || 'HUB');

    // Dynamic data for characters (fetching logic might need to be moved here or passed via props if not using context)
    // For now assuming these are available via props or global context if needed. 
    // Actually HistorySection gets 'places' but not 'characters'. We need to fix this in LandingPage/HistorySection too if CharactersView depends on it.
    // LandingPage passes dynamicCharacters to CharactersView. 
    // We should probably pass 'dynamicCharacters' to HistorySection -> HistoryHub as well.
    // I will check HistorySection props momentarily.


    const menuItems = [
        { id: 'CHARACTERS', label: 'Protagonistas', image: '/assets/historia/protagonistas.png', desc: t('menu.characters') },
        { id: 'PLACES', label: 'Rincones', image: '/assets/historia/rincones.png', desc: t('menu.places') },
        { id: 'MULTIMEDIA', label: 'Multimedia', image: '/assets/historia/multimedia.png', desc: t('historySection.intro.title') },
        { id: 'CHRONICLES', label: 'Crónicas', image: '/assets/historia/cronicas.png', desc: t('historySection.chronicles.subtitle') },
        { id: 'GLOSSARY', label: 'Glosario', image: '/assets/historia/glosario.png', desc: t('historySection.tabs.glossary') },
        { id: 'QUIZ', label: 'Desafío', image: '/assets/historia/desafio.png', desc: t('historySection.tabs.quiz') },
    ];

    const renderHub = () => (
        <div className="animate-fade-in">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-4">{t('menu.history')}</h2>
                <p className="text-navarra-gold uppercase tracking-[0.2em] text-sm md:text-base max-w-2xl mx-auto">{t('historySection.intro.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id as HistoryView)}
                        className="group relative h-64 w-full rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-navarra-gold/20 hover:border-navarra-gold"
                    >
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${item.image})` }}
                        />

                        {/* Overlay Gradient - Darker at bottom for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10">
                            <h3 className="text-2xl font-serif font-bold text-white mb-2 group-hover:text-navarra-gold transition-colors filter drop-shadow-lg">
                                {item.label}
                            </h3>
                            <div className="h-0.5 w-12 bg-navarra-gold mb-3 group-hover:w-full transition-all duration-500 ease-out" />
                            <p className="text-gray-300 text-sm opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 line-clamp-2">
                                {item.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderView = () => {
        switch (currentView) {
            case 'CHARACTERS': return <CharactersView onBack={() => setCurrentView('HUB')} characters={characters} />;
            case 'PLACES': return <PlacesView onBack={() => setCurrentView('HUB')} places={places} />;
            case 'MULTIMEDIA': return <MultimediaView onBack={() => setCurrentView('HUB')} />;
            case 'CHRONICLES': return <ChroniclesView onBack={() => setCurrentView('HUB')} />;
            case 'TIMELINE': return <TimelineView onBack={() => setCurrentView('HUB')} />;
            case 'MONUMENTS': return <MonumentsView onBack={() => setCurrentView('HUB')} places={places} />;
            case 'CASTLES': return <CastlesView onBack={() => setCurrentView('HUB')} />;
            case 'SANTIAGO': return <SantiagoView onBack={() => setCurrentView('HUB')} />;
            case 'WOMEN': return <WomenView onBack={() => setCurrentView('HUB')} />;
            case 'GLOSSARY': return <GlossaryView onBack={() => setCurrentView('HUB')} />;
            case 'QUIZ': return <QuizView onBack={() => setCurrentView('HUB')} />;
            default: return renderHub();
        }
    };

    return (
        <div className="min-h-screen bg-navarra-dark text-navarra-parchment font-sans pb-20 relative bg-[url('/assets/pattern_bg.png')] bg-repeat">
            <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>

            <div className={`max-w-7xl mx-auto px-6 py-8 relative z-10 ${currentView !== 'HUB' ? 'pt-4' : 'pt-12'}`}>
                {currentView === 'HUB' && (
                    <button onClick={onBack} className="mb-8 text-white/50 hover:text-navarra-gold flex items-center gap-2 uppercase tracking-widest text-xs font-bold transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('common.backToHome')}
                    </button>
                )}

                {renderView()}
            </div>
        </div>
    );
};
