
import React, { useState, useEffect } from 'react';
import { GameState, GameConfig } from './types';
import { GAME_MELODIA } from './data/games/melodia';
import { getSavedState, resetGame, getStorageUrl, getLocalState, logGameEvent } from './services/gameService';
import { audioManager } from './services/audioService'; // Import Audio Service
import { Modal } from './components/UIComponents';
import LandingPage from './components/LandingPage';
import { GameEngine } from './components/GameEngine';
import NotFound from './components/NotFound';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/profile/ProfilePage';
import { useTranslation } from 'react-i18next';
import { ProtectedAdminRoute } from './components/admin/ProtectedAdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/pages/AdminDashboard';

import { auth } from './firebaseConfig';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [is404, setIs404] = useState(false);

  // State for Confirmation Modal (Reset)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ isOpen: false, title: '', message: '', action: () => { } });

  // Load basic state on mount
  useEffect(() => {
    // Check for 404 (paths that are not root or valid landing routes)
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const validPaths = ['/', '/enigmas', '/historia', '/personajes', '/lugares', '/acerca', '/bibliografia', '/login', '/profile', '/admin'];
    const isEnigmaDetailPath = /^\/enigmas\/\d+$/.test(path); // Allow /enigmas/1, /enigmas/2, etc.
    const isAdminPath = path.startsWith('/admin'); // Allow /admin and /admin/*

    if (!validPaths.includes(path) && !isEnigmaDetailPath && !isAdminPath) {
      setIs404(true);
      setLoading(false); // Stop loading to show 404 immediately
      return;
    }

    const load = async () => {
      try {
        // Ensure user is signed in (Anonymously or existing session)
        await new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
              try {
                console.log("No user session, signing in anonymously...");
                await signInAnonymously(auth);
              } catch (e) {
                console.error("Anonymous auth failed", e);
              }
            } else {
              console.log("User session active:", user.uid);
            }
            unsubscribe();
            resolve();
          });
        });

        const state = await getSavedState();
        setGameState(state);
      } catch (e) {
        console.error("Failed to load state", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // CHECK AUTH PAGES FIRST (before is404)
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  /* Login, Profile and Admin routes temporarily hidden
  if (path === '/login') {
    return (
      <LoginPage
        onBack={() => window.history.back()}
        onLoginSuccess={() => {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }}
      />
    );
  }

  if (path === '/profile') {
    return (
      <ProfilePage
        onBack={() => {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }}
        onNavigateToGame={(gameId) => {
          window.history.pushState({}, '', '/');
          window.location.reload();
        }}
        onNavigateToEnigma={(enigmaId) => {
          window.history.pushState({}, '', `/enigmas/${enigmaId}`);
          window.location.reload();
        }}
      />
    );
  }

  if (path.startsWith('/admin')) {
    return (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    );
  }
  */

  if (is404) {
    return <NotFound />;
  }

  if (loading || !gameState) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-navarra-gold">
        <div className="w-12 h-12 border-4 border-navarra-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-serif tracking-widest uppercase animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  // HANDLER: Start New Game (Reset) - Melodia
  const startNewGameLogic = async () => {
    // Unlock Audio Context
    audioManager.playBGM('MENU');

    const freshState = await resetGame();
    setGameState({ ...freshState, isGameStarted: true, showDialogue: true, startTime: Date.now() });
    setActiveGameId('melodia');
    setModalConfig({ ...modalConfig, isOpen: false });
    logGameEvent('game_start', { level_name: 'melodia' });
  };

  // HANDLER: Click "New Game" in Landing
  const handleStartGame = () => {
    if (gameState.currentStageIndex > 0) {
      setModalConfig({
        isOpen: true,
        title: t('modals.newGame.title'),
        message: t('modals.newGame.message'),
        action: startNewGameLogic
      });
    } else {
      startNewGameLogic();
    }
  };

  // HANDLER: Click "Resume" in Landing
  const handleResumeGame = () => {
    // Unlock Audio Context
    audioManager.playBGM('MENU');

    setGameState({ ...gameState, isGameStarted: true });
    setActiveGameId('melodia');
  };

  // HANDLER: Exit Game (Back to Menu)
  const handleExitGame = () => {
    setActiveGameId(null);
    // Recargar estado desde localStorage para asegurar que el progreso se refleja en el menú inmediatamente
    const freshState = getLocalState();
    setGameState({ ...freshState, isGameStarted: false });
    audioManager.playBGM('MENU');
  };

  // HANDLER: Reset from within Game
  const handleResetGame = () => {
    setModalConfig({
      isOpen: true,
      title: t('modals.resetGame.title'),
      message: t('modals.resetGame.message'),
      action: startNewGameLogic
    });
  };

  // RENDER: Melodia Game
  if (activeGameId === 'melodia' && gameState.isGameStarted) {
    return (
      <>
        <GameEngine
          config={GAME_MELODIA}
          initialState={gameState}
          onExit={handleExitGame}
          onReset={handleResetGame}
        />
        <Modal
          isOpen={modalConfig.isOpen}
          title={modalConfig.title}
          message={modalConfig.message}
          onConfirm={modalConfig.action}
          onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
          confirmText={t('modals.actions.confirmReset')}
        />
      </>
    );
  }

  // RENDER: Landing Page (Menu) - WRAPPED WITH AUTH PROVIDER
  return (
    <>
      <LandingPage
        onStartGame={handleStartGame}
        onResumeGame={handleResumeGame}
        hasSavedGame={gameState.currentStageIndex > 0}
      />
      <Modal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.action}
        onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
        confirmText={t('modals.actions.confirmReset')}
      />
    </>
  );
};

export default App;

