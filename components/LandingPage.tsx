
import React, { useState, useEffect, useCallback } from 'react';
import { fetchDynamicContent, getStorageUrl } from '../services/gameService';
import { checkHasMemories } from '../services/memoriesService';
import { audioManager } from '../services/audioService';
import { HistorySection } from './HistorySection';
import { Character, Place } from '../types';
import { PlaceWithKeys } from '../data/places';

// New Modular Views
import { HomeView } from './landing/views/HomeView';
import { CharactersView } from './landing/views/CharactersView';
import { PlacesView } from './landing/views/PlacesView';
import { StatisticsView } from './landing/views/statistics/StatisticsView';
import { AboutView } from './landing/views/AboutView';
import { BibliographyView } from './landing/views/BibliographyView';
import { EnigmasView } from './landing/views/EnigmasView';
import { MemoriesView } from './landing/views/MemoriesView';
import { Footer } from './landing/Footer';

interface LandingPageProps {
  onStartGame: () => void;
  onResumeGame: () => void;
  hasSavedGame: boolean;
}

type ViewState = 'HOME' | 'HISTORY' | 'CHARACTERS' | 'PLACES' | 'ABOUT' | 'BIBLIOGRAPHY' | 'STATS' | 'ENIGMAS' | 'MEMORIES';

// Map URL paths to ViewState
const pathToView: Record<string, ViewState> = {
  '/': 'HOME',
  '/enigmas': 'ENIGMAS',
  '/historia': 'HISTORY',
  '/personajes': 'CHARACTERS',
  '/lugares': 'PLACES',
  '/recuerdos': 'MEMORIES',
  '/acerca': 'ABOUT',
  '/bibliografia': 'BIBLIOGRAPHY'
};

const viewToPath: Record<ViewState, string> = {
  'HOME': '/',
  'ENIGMAS': '/enigmas',
  'HISTORY': '/historia',
  'CHARACTERS': '/personajes',
  'PLACES': '/lugares',
  'MEMORIES': '/recuerdos',
  'ABOUT': '/acerca',
  'BIBLIOGRAPHY': '/bibliografia',
  'STATS': '/' // Stats doesn't have its own route, stays as modal
};

const LandingPage: React.FC<LandingPageProps> = ({
  onStartGame,
  onResumeGame,
  hasSavedGame
}) => {
  // Detect initial view from URL
  const getInitialView = (): ViewState => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    // Check for enigma detail URLs like /enigmas/1, /enigmas/2
    if (/^\/enigmas\/\d+$/.test(path)) {
      return 'ENIGMAS';
    }
    return pathToView[path] || 'HOME';
  };

  const [currentView, setCurrentView] = useState<ViewState>(getInitialView());
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicAudio, setMusicAudio] = useState<HTMLAudioElement | null>(null);
  const [statsGameId, setStatsGameId] = useState<string>('melodia');

  // Datos dinámicos
  const [dynamicCharacters, setDynamicCharacters] = useState<Character[]>([]);
  const [dynamicPlaces, setDynamicPlaces] = useState<PlaceWithKeys[]>([]);
  const [gameImageUrl, setGameImageUrl] = useState<string | null>(null);
  const [hasMemories, setHasMemories] = useState(false);

  const loadContent = useCallback(async () => {
    const { characters, places } = await fetchDynamicContent();
    setDynamicCharacters(characters);
    setDynamicPlaces(places);

    // Cargar imagen del juego
    const url = await getStorageUrl('assets/games/melodia/titulo.png');
    if (url) setGameImageUrl(url);

    // Check memories
    const memoriesExist = await checkHasMemories();
    setHasMemories(memoriesExist);
  }, []);

  useEffect(() => {
    loadContent();

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      const newView = pathToView[path] || 'HOME';
      setCurrentView(newView);
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup: detener música cuando se desmonta el componente
    return () => {
      if (musicAudio) {
        musicAudio.pause();
        musicAudio.src = '';
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, [loadContent, musicAudio]);

  const handlePlayMusic = () => {
    if (!audioManager.getMuteState() && !musicPlaying) {
      const audio = new Audio('/musicaInicio.mp3');
      audio.volume = 0.5;
      audio.loop = true;
      audio.play().catch(e => {
        console.log('Error playing music:', e);
      });
      setMusicAudio(audio);
      setMusicPlaying(true);
    }
  };

  const handleStopMusic = () => {
    if (musicAudio && musicPlaying) {
      musicAudio.pause();
      musicAudio.src = '';
      setMusicAudio(null);
      setMusicPlaying(false);
    }
  };

  const handleToggleMusic = () => {
    if (musicPlaying) {
      handleStopMusic();
    } else {
      handlePlayMusic();
    }
  };

  // Helper to navigate and update URL
  const navigateToView = (view: ViewState) => {
    setCurrentView(view);
    const path = viewToPath[view];
    if (path && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  // --- VIEW RENDERERS ---

  const renderView = () => {
    switch (currentView) {
      case 'HISTORY':
        return <HistorySection onBack={() => navigateToView('HOME')} places={dynamicPlaces} characters={dynamicCharacters} />;

      case 'CHARACTERS':
        return <HistorySection onBack={() => navigateToView('HOME')} places={dynamicPlaces} characters={dynamicCharacters} initialView="CHARACTERS" />;

      case 'PLACES':
        return <HistorySection onBack={() => navigateToView('HOME')} places={dynamicPlaces} characters={dynamicCharacters} initialView="PLACES" />;

      case 'MEMORIES':
        return <MemoriesView onBack={() => navigateToView('HOME')} />;

      case 'ABOUT':
        return <AboutView onBack={() => navigateToView('HOME')} />;

      case 'BIBLIOGRAPHY':
        return <BibliographyView onBack={() => navigateToView('HOME')} />;

      case 'STATS':
        return <StatisticsView onBack={() => navigateToView('HOME')} gameId={statsGameId} />;

      case 'ENIGMAS':
        return <EnigmasView onBack={() => navigateToView('HOME')} />;

      case 'HOME':
      default:
        return (
          <div className="min-h-screen bg-navarra-dark text-navarra-parchment overflow-x-hidden font-sans relative">
            <HomeView
              onNavigate={navigateToView}
              onStartGame={onStartGame}
              onResumeGame={onResumeGame}
              hasSavedGame={hasSavedGame}
              gameImageUrl={gameImageUrl}
              onToggleMusic={handleToggleMusic}
              musicPlaying={musicPlaying}
              onViewStats={(gameId) => {
                setStatsGameId(gameId);
                navigateToView('STATS');
              }}
              hasMemories={hasMemories}
            />
            <Footer
              onNavigateAbout={() => navigateToView('ABOUT')}
              onNavigateBibliography={() => navigateToView('BIBLIOGRAPHY')}
              onNavigateMemories={() => navigateToView('MEMORIES')}
              onDataUpdated={loadContent}
              hasMemories={hasMemories}
            />
          </div>
        );
    }
  };

  return renderView();
};

export default LandingPage;
