
import React, { useState, useEffect, useRef } from 'react';
import { GameState, GameConfig, Phase, PuzzleData, Fragment } from '../types';
import { CHARACTERS, FRAGMENTS } from '../constants';
import { useExtendedInfo } from '../data/extendedInfo';
import { saveState, checkAnswer, getStorageUrl, saveGameCompletion, updateGameCompletionPlayer, calculateDistance, logGameEvent } from '../services/gameService';
import { audioManager } from '../services/audioService'; // Import Audio Service
import { Button, Input, Card, DialogueBox, Modal, SafeImage, AudioToggle, GpsToggle } from './UIComponents';
import { Timer } from './Timer';
import CoinPuzzle from './puzzles/CoinPuzzle';
import ConstellationPuzzle from './puzzles/ConstellationPuzzle';
import CryptexPuzzle from './puzzles/CryptexPuzzle';
import StairsPuzzle from './puzzles/StairsPuzzle';
import MerchantPuzzle from './puzzles/MerchantPuzzle';
import SynagoguePuzzle from './puzzles/SynagoguePuzzle';
import SepulchrePuzzle from './puzzles/SepulchrePuzzle';
import BridgePuzzle from './puzzles/BridgePuzzle';
import BalancePuzzle from './puzzles/BalancePuzzle';
import InscriptionPuzzle from './puzzles/InscriptionPuzzle';
import { HistoricalContext } from './HistoricalContext';
import { LearnMoreModal } from './LearnMoreModal';
import { FeedbackModal } from './FeedbackModal';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

type IntroStage = 'MEDIEVAL' | 'ORDOIZ_NEWS' | 'GLITCH' | 'HACKER' | 'MAP' | 'NONE';
type ViewMode = 'TRAVEL' | 'PUZZLE';

interface GameEngineProps {
    config: GameConfig;
    initialState: GameState;
    onExit: () => void;
    onReset: () => void;
}

interface TerminalLine {
    text: string;
    style?: string;
}

export const GameEngine: React.FC<GameEngineProps> = ({ config, initialState, onExit, onReset }) => {
    const { t, i18n } = useTranslation();
    const extendedInfo = useExtendedInfo();
    const [gameState, setGameState] = useState<GameState>(initialState);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState('');
    const [multiSelect, setMultiSelect] = useState<string[]>([]);

    // Intro State
    const [introStage, setIntroStage] = useState<IntroStage>(
        initialState.currentStageIndex === 0 && config.introSequence ? 'MEDIEVAL' : 'NONE'
    );
    const [mapUrl, setMapUrl] = useState<string | null>(null);
    const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);

    // In-Game View State
    const [viewMode, setViewMode] = useState<ViewMode>('PUZZLE');
    const [showTravelVideo, setShowTravelVideo] = useState(true);

    // Geo Location State
    const [userDistance, setUserDistance] = useState<number | null>(null);
    const [gpsBypass, setGpsBypass] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);

    // Assets State
    const [currentPuzzleImage, setCurrentPuzzleImage] = useState<string | null>(null);
    const [currentSpeakerImage, setCurrentSpeakerImage] = useState<string | null>(null);

    // Phase Videos
    const [showPhase1OutroVideo, setShowPhase1OutroVideo] = useState(false);
    const [showPhase2OutroVideo, setShowPhase2OutroVideo] = useState(false);

    // Finale
    const [showFinaleVideo, setShowFinaleVideo] = useState(false);
    const [finaleVideoUrl, setFinaleVideoUrl] = useState<string | null>(null);

    // Results
    const [playerName, setPlayerName] = useState('');
    const [showCertificate, setShowCertificate] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [finalScore, setFinalScore] = useState(0);
    const [finalTime, setFinalTime] = useState(0);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const certificateRef = useRef<HTMLDivElement>(null);

    // Modals
    const [rewardData, setRewardData] = useState<{ title: string, message: string } | null>(null);
    const [showLearnMore, setShowLearnMore] = useState(false);
    const [showHintModal, setShowHintModal] = useState(false);
    const [isHintRevealed, setIsHintRevealed] = useState(false);

    // Saving State
    const [isSaving, setIsSaving] = useState(false);
    const [completionDocId, setCompletionDocId] = useState<string | null>(null);

    // Codex System
    const [readingFragment, setReadingFragment] = useState<Fragment | null>(null);

    // Haptics Helper
    const vibrate = (pattern: number | number[]) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    };

    // Load initial settings
    useEffect(() => {
        const bypass = localStorage.getItem('estella_gps_bypass') === 'true';
        setGpsBypass(bypass);

        // Listen for changes from UIComponents
        const handleBypassChange = () => {
            const newVal = localStorage.getItem('estella_gps_bypass') === 'true';
            setGpsBypass(newVal);
        };
        window.addEventListener('gps_bypass_changed', handleBypassChange);
        return () => window.removeEventListener('gps_bypass_changed', handleBypassChange);
    }, []);

    // Geolocation Tracker
    useEffect(() => {
        let watchId: number;

        const currentPuzzle = config.puzzles[gameState.currentStageIndex];
        const targetCoords = currentPuzzle?.travelConfig?.coordinates;

        if (viewMode === 'TRAVEL' && targetCoords && !gpsBypass) {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const dist = calculateDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            targetCoords.lat,
                            targetCoords.lng
                        );
                        setUserDistance(Math.floor(dist));
                        setGpsError(null);
                    },
                    (error) => {
                        console.error("GPS Error", error);
                        setGpsError(t('gameEngine.gps.errorAccess'));
                    },
                    { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                );
            } else {
                setGpsError(t('gameEngine.gps.errorSupport'));
            }
        } else {
            setUserDistance(null);
        }

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [viewMode, gameState.currentStageIndex, gpsBypass]);

    // Persist State (Auto-save)
    useEffect(() => {
        setIsSaving(true);
        saveState(gameState, config.id).then(() => {
            setTimeout(() => setIsSaving(false), 800);
        });
    }, [gameState, config.id]);

    // AUDIO MANAGEMENT
    useEffect(() => {
        // Handle BGM Switching based on Phase or State
        if (gameState.isGameFinished) {
            audioManager.playBGM('FINAL');
            return;
        }

        if (introStage !== 'NONE') {
            audioManager.playBGM('MENU');
            return;
        }

        const currentPuzzle = config.puzzles[gameState.currentStageIndex];
        if (currentPuzzle) {
            switch (currentPuzzle.phase) {
                case Phase.FORTRESS:
                    audioManager.playBGM('FORTRESS');
                    break;
                case Phase.WATER:
                    audioManager.playBGM('WATER');
                    break;
                case Phase.KNOWLEDGE:
                    audioManager.playBGM('KNOWLEDGE');
                    break;
            }
        }
    }, [gameState.currentStageIndex, introStage, gameState.isGameFinished]);

    // Handle Exit Audio
    useEffect(() => {
        return () => {
            // When unmounting GameEngine (back to menu), usually you'd want menu music.
            // App.tsx or LandingPage might handle this, but let's ensure we stop 'game' music.
            audioManager.playBGM('MENU');
        }
    }, []);

    // Load Game Assets
    useEffect(() => {
        const loadAssets = async () => {
            if (config.mapImage) {
                const url = await getStorageUrl(config.mapImage);
                setMapUrl(url);
            }
            if (config.outroVideo) {
                const videoUrl = await getStorageUrl(config.outroVideo);
                setFinaleVideoUrl(videoUrl);
            }
        };
        loadAssets();
    }, [config]);

    // Terminal Sequence Effect
    useEffect(() => {
        if (introStage === 'GLITCH') {
            const lines: { text: string; delay: number; style?: string }[] = [
                { text: t('gameEngine.intro.detecting'), delay: 500 },
                { text: t('gameEngine.intro.intercepting'), delay: 1500 },
                { text: "> ...", delay: 2500 },
                { text: t('gameEngine.intro.connection'), delay: 3500, style: "text-green-400 font-bold border-b-2 border-green-500 inline-block mb-2 mt-2" },
                { text: t('gameEngine.intro.sender'), delay: 4500, style: "text-navarra-gold font-bold text-xl" },
                { text: t('gameEngine.intro.downloading'), delay: 6000 }
            ];

            setTerminalLines([]);
            const timeouts: ReturnType<typeof setTimeout>[] = [];

            lines.forEach((item) => {
                const t = setTimeout(() => {
                    setTerminalLines(prev => [...prev, { text: item.text, style: item.style }]);
                    audioManager.playSFX('CLICK'); // Typing sound effect
                }, item.delay);
                timeouts.push(t);
            });

            // Transition to HACKER
            const finalT = setTimeout(() => {
                setIntroStage('HACKER');
                audioManager.playSFX('REVEAL');
            }, 7500);
            timeouts.push(finalT);

            return () => timeouts.forEach(clearTimeout);
        }
    }, [introStage]);

    const currentPuzzle: PuzzleData = config.puzzles[gameState.currentStageIndex];

    // Resolve Puzzle Assets
    useEffect(() => {
        const resolveAssets = async () => {
            if (!currentPuzzle) return;

            // Puzzle Image
            if (currentPuzzle.storageImage) {
                const url = await getStorageUrl(currentPuzzle.storageImage);
                setCurrentPuzzleImage(url || currentPuzzle.image || null);
            } else {
                setCurrentPuzzleImage(currentPuzzle.image || null);
            }

            // Speaker Image
            if (currentPuzzle.speaker) {
                const speakerNameFirstWord = currentPuzzle.speaker.split(' ')[0];
                const charEntry = Object.values(CHARACTERS).find(c => c.name.includes(speakerNameFirstWord));
                if (charEntry) {
                    if (charEntry.storageUrl) {
                        const url = await getStorageUrl(charEntry.storageUrl);
                        setCurrentSpeakerImage(url || charEntry.image);
                    } else {
                        setCurrentSpeakerImage(charEntry.image);
                    }
                } else {
                    setCurrentSpeakerImage(null);
                }
            }
        };
        resolveAssets();
    }, [currentPuzzle]);

    // Handle Travel Logic
    useEffect(() => {
        if (!gameState.isGameFinished) {
            setIsHintRevealed(false);
            if (currentPuzzle?.travelConfig) {
                setViewMode('TRAVEL');
                setShowTravelVideo(!!currentPuzzle.travelConfig.videoUrl);
            } else {
                setViewMode('PUZZLE');
            }
        }
    }, [gameState.currentStageIndex]);

    // Calculate Stats on Finish
    useEffect(() => {
        if (gameState.isGameFinished) {
            setShowFinaleVideo(false);
            const endTime = Date.now();
            const startTime = gameState.startTime || (endTime - 3600000);
            const minutes = Math.max(1, Math.floor((endTime - startTime) / 1000 / 60));

            let score = 10000 - (minutes * 50) - (gameState.hintsUsed * 500) - ((gameState.mistakesMade || 0) * 100);
            if (score < 0) score = 0;

            setFinalTime(minutes);
            setFinalScore(score);
            audioManager.playSFX('SUCCESS');

            // Auto-save completion as Anonymous initially
            const autoSaveCompletion = async () => {
                if (!completionDocId) {
                    const docId = await saveGameCompletion(
                        "Anónimo",
                        minutes,
                        score,
                        gameState.hintsUsed,
                        gameState.mistakesMade || 0,
                        'elgacena'
                    );
                    if (docId) setCompletionDocId(docId);
                }
            };
            autoSaveCompletion();
        }
    }, [gameState.isGameFinished]);

    const handleMistake = () => {
        vibrate([50, 100, 50]); // Error haptic pattern
        audioManager.playSFX('ERROR');
        setGameState(prev => ({ ...prev, mistakesMade: (prev.mistakesMade || 0) + 1 }));
    };

    const handleHintClick = () => setShowHintModal(true);

    const confirmHintReveal = () => {
        if (!isHintRevealed) {
            vibrate(50);
            audioManager.playSFX('REVEAL');
            setIsHintRevealed(true);
            setGameState(prev => ({ ...prev, hintsUsed: (prev.hintsUsed || 0) + 1 }));
            logGameEvent('hint_used', { puzzle_id: currentPuzzle?.id });
        }
    };

    // Handle Fragment Click (Codex)
    const handleFragmentClick = (frag: Fragment) => {
        vibrate(20); // Short tick
        audioManager.playSFX('CLICK');
        setReadingFragment(frag);
    };

    // --- TRANSLATION HELPERS ---
    const getTranslatedPuzzle = () => {
        if (!currentPuzzle) return currentPuzzle;
        return {
            ...currentPuzzle,
            title: t(`puzzles.${currentPuzzle.id}.title`, currentPuzzle.title),
            description: t(`puzzles.${currentPuzzle.id}.description`, currentPuzzle.description),
            audioTranscript: t(`puzzles.${currentPuzzle.id}.audioTranscript`, currentPuzzle.audioTranscript),
            clue: t(`puzzles.${currentPuzzle.id}.clue`, currentPuzzle.clue),
            hint: t(`puzzles.${currentPuzzle.id}.hint`, currentPuzzle.hint),
            successMessage: t(`puzzles.${currentPuzzle.id}.successMessage`, currentPuzzle.successMessage),
            nextLocationHint: t(`puzzles.${currentPuzzle.id}.nextLocationHint`, currentPuzzle.nextLocationHint),
            cryptexConfig: currentPuzzle.cryptexConfig?.map((c, i) => ({
                ...c,
                label: t(`puzzles.${currentPuzzle.id}.cryptex.l${i + 1}`, c.label),
                question: t(`puzzles.${currentPuzzle.id}.cryptex.q${i + 1}`, c.question),
                options: c.options?.map((o, j) => ({
                    ...o,
                    label: t(`puzzles.${currentPuzzle.id}.cryptex.o${i + 1}_${j + 1}`, o.label)
                }))
            })),
            travelConfig: currentPuzzle.travelConfig ? {
                ...currentPuzzle.travelConfig,
                locationName: t(`puzzles.${currentPuzzle.id}.travel.locationName`, currentPuzzle.travelConfig.locationName),
                instructionText: t(`puzzles.${currentPuzzle.id}.travel.instructionText`, currentPuzzle.travelConfig.instructionText)
            } : undefined
        };
    };

    const translatedPuzzle = getTranslatedPuzzle();

    const handlePuzzleSubmit = (overrideValue?: any) => {
        if (translatedPuzzle.type === 'FINAL_REVEAL') {
            vibrate([100, 50, 100, 50, 200]);
            audioManager.playSFX('SUCCESS');
            completeStage();
            return;
        }

        const valueToCheck = overrideValue !== undefined ? overrideValue : inputValue;

        if (checkAnswer(translatedPuzzle, valueToCheck)) {
            vibrate([200, 100, 200]); // Success pattern
            audioManager.playSFX('SUCCESS');
            logGameEvent('puzzle_solved', { puzzle_id: translatedPuzzle.id, score: finalScore });

            // SPECIAL VIDEOS
            if (translatedPuzzle.id === 'p3') { setShowPhase1OutroVideo(true); return; }
            if (translatedPuzzle.id === 'p6') { setShowPhase2OutroVideo(true); return; }

            setRewardData({
                title: t('gameEngine.rewards.phaseComp'),
                message: translatedPuzzle.successMessage
            });
        } else {
            handleMistake();
            setFeedback(t('gameEngine.feedback.wrong'));
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const completeStage = () => {
        const newInventory = [...gameState.inventory];
        if (translatedPuzzle.fragmentId && !newInventory.includes(translatedPuzzle.fragmentId)) {
            newInventory.push(translatedPuzzle.fragmentId);
        }

        const nextIndex = gameState.currentStageIndex + 1;
        const isFinished = nextIndex >= config.puzzles.length;

        setGameState({
            ...gameState,
            currentStageIndex: isFinished ? gameState.currentStageIndex : nextIndex,
            isGameFinished: isFinished,
            inventory: newInventory,
            showDialogue: true
        });

        setRewardData(null);
        setInputValue('');
        setMultiSelect([]);
        setFeedback('');
    };

    // --- RENDER HELPERS ---

    const renderPuzzleInput = () => {
        switch (translatedPuzzle.type) {
            case 'FINAL_REVEAL': return <div className="text-center space-y-4"><p className="text-navarra-parchment italic opacity-80 mb-4">La historia está a punto de revelarse...</p><Button onClick={() => handlePuzzleSubmit()} className="w-full animate-pulse-slow">Abrir el Manuscrito</Button></div>;
            case 'CRYPTEX': return <CryptexPuzzle config={translatedPuzzle.cryptexConfig || []} onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'STAIRS_LOCK': return <StairsPuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'MERCHANT_LOCK': return <MerchantPuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'SYNAGOGUE_PUZZLE': return <SynagoguePuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'SEPULCHRE_PUZZLE': return <SepulchrePuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'BRIDGE_PUZZLE': return <BridgePuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'BALANCE_PUZZLE': return <BalancePuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'INSCRIPTION_PUZZLE': return <InscriptionPuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'INPUT_NUMBER':
            case 'INPUT_TEXT': return <div className="space-y-4"><Input type={translatedPuzzle.type === 'INPUT_NUMBER' ? 'number' : 'text'} placeholder="Escribe tu respuesta..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} /><Button onClick={() => handlePuzzleSubmit()} className="w-full">Validar Respuesta</Button></div>;
            case 'COIN_BALANCE': return <CoinPuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'CONSTELLATION': return <ConstellationPuzzle onSolved={handlePuzzleSubmit} onMistake={handleMistake} />;
            case 'SELECT_MULTI':
                const options = ['leon', 'angel', 'serpiente', 'vid', 'estrella', 'cruz'];
                const toggleOption = (opt: string) => { setMultiSelect(prev => prev.includes(opt) ? prev.filter(p => p !== opt) : [...prev, opt]); };
                return <div className="space-y-4"><div className="grid grid-cols-2 gap-3">{options.map(opt => (<button key={opt} onClick={() => toggleOption(opt)} className={`p-4 border font-serif uppercase text-sm transition-all duration-300 rounded-sm ${multiSelect.includes(opt) ? 'bg-navarra-gold text-black border-navarra-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'bg-black/40 text-navarra-parchment border-navarra-stone hover:border-navarra-gold/50'}`}>{opt}</button>))}</div><Button onClick={() => handlePuzzleSubmit(multiSelect)} className="w-full mt-4">Confirmar Selección</Button></div>;
            default: return null;
        }
    };

    const getPhaseIcon = (phase: Phase) => {
        switch (phase) {
            case Phase.FORTRESS: return '🏰';
            case Phase.WATER: return '🌊';
            case Phase.KNOWLEDGE: return '👁️';
        }
    }

    // Function to generate image and handle download or share
    const handleCertificateAction = async (action: 'download' | 'share') => {
        if (!certificateRef.current) return;
        setIsGeneratingImage(true);
        audioManager.playSFX('CLICK');
        try {
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for render
            const canvas = await html2canvas(certificateRef.current, { useCORS: true, scale: 2, backgroundColor: null });

            if (action === 'download') {
                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = `Diploma_Navarra_${playerName.replace(/\s+/g, '_')}.png`;
                link.click();
                logGameEvent('certificate_download', { player_name: playerName });
            } else if (action === 'share') {
                canvas.toBlob(async (blob) => {
                    if (blob && navigator.share) {
                        const file = new File([blob], `Diploma_Navarra.png`, { type: 'image/png' });
                        try {
                            await navigator.share({
                                title: t('gameEngine.certificate.shareTitle'),
                                text: t('gameEngine.certificate.shareText', { score: finalScore }),
                                files: [file]
                            });
                        } catch (err) {
                            console.error("Error sharing:", err);
                        }
                    } else {
                        alert(t('gameEngine.certificate.deviceError'));
                        // Fallback to download
                        const image = canvas.toDataURL("image/png");
                        const link = document.createElement("a");
                        link.href = image;
                        link.download = `Diploma_Navarra_${playerName.replace(/\s+/g, '_')}.png`;
                        link.click();
                    }
                }, 'image/png');
            }

        } catch (err) { console.error(err); alert(t('gameEngine.certificate.generateError')); }
        finally { setIsGeneratingImage(false); }
    }

    const handleGenerateCertificate = async () => {
        if (!playerName.trim()) { alert(t('gameEngine.certificate.nameRequired')); return; }
        audioManager.playSFX('SUCCESS');

        if (completionDocId) {
            await updateGameCompletionPlayer(completionDocId, playerName);
        } else {
            // Fallback if auto-save failed
            const docId = await saveGameCompletion(playerName, finalTime, finalScore, gameState.hintsUsed, gameState.mistakesMade);
            if (docId) setCompletionDocId(docId);
        }

        setShowCertificate(true);
        logGameEvent('certificate_force_generate', { player_name: playerName });
    }

    // --- VIDEO LOCALIZATION ---
    const VIDEO_IDS = {
        INTRO_MEDIEVAL: { es: 'BqX085xEO8w', eu: 'qyjzVfkftkQ', en: 'tGiG5MKD_ck' },
        ORDOIZ_NEWS: { es: '4jkKjN3jx88', eu: 'pg9WwHkxC9s', en: 'ie1yNVA72z4' },
        HACKER: { es: 'PtyTezgVadk', eu: 'yoM1gXS31Fs', en: '9pPD1C_CB00' },
        PHASE_1_OUTRO: { es: 'COuGyY-CT5Y', eu: 'xFP_dmUpVEk', en: 'Nqmspb13Sus' },
        PHASE_2_OUTRO: { es: 'IUKiaKRebz8', eu: 'EgZb0_Wzejk', en: 'eb1QIudIM3Q' },
    };

    const getVideoSrc = (videoKey: keyof typeof VIDEO_IDS) => {
        const lang = i18n.language.substring(0, 2); // 'es', 'en', 'eu'
        const ids = VIDEO_IDS[videoKey];
        // Default to 'es' if language not found
        const videoId = (ids as any)[lang] || ids.es;

        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&playsinline=1&rel=0`;
    };

    // --- INTRO SEQUENCE RENDER ---
    if (introStage === 'MEDIEVAL') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                <h2 className="text-2xl md:text-4xl font-serif text-navarra-crimson mb-6 animate-pulse">{t('gameEngine.intro.locationText')}</h2>
                <div className="max-w-3xl w-full aspect-video bg-gray-900 border-2 border-navarra-gold/30 rounded-lg overflow-hidden relative shadow-[0_0_50px_rgba(212,175,55,0.2)] mb-8">
                    <iframe width="100%" height="100%" src={getVideoSrc('INTRO_MEDIEVAL')} title="Intro" style={{ border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
                <Button onClick={() => setIntroStage('ORDOIZ_NEWS')} variant="secondary">{t('gameEngine.intro.continue')}</Button>
            </div>
        );
    }
    if (introStage === 'ORDOIZ_NEWS') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                <h2 className="text-xl md:text-3xl font-serif text-white mb-6">{t('gameEngine.intro.newsTitle')}</h2>
                <div className="max-w-3xl w-full aspect-video bg-gray-900 border-2 border-white/20 rounded-lg overflow-hidden relative shadow-[0_0_50px_rgba(255,255,255,0.1)] mb-8">
                    <iframe width="100%" height="100%" src={getVideoSrc('ORDOIZ_NEWS')} title="Noticias" style={{ border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
                <Button onClick={() => setIntroStage('GLITCH')} variant="secondary">{t('gameEngine.intro.skip')}</Button>
            </div>
        );
    }
    if (introStage === 'GLITCH') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-start justify-center p-8 md:p-20 font-mono relative overflow-hidden">
                {/* Visual Effects */}
                <div className="crt-scanline absolute inset-0 z-20 opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,30,0,0.2)_0%,_rgba(0,0,0,1)_90%)] z-10 pointer-events-none"></div>

                <div className="relative z-30 w-full max-w-4xl space-y-4">
                    {terminalLines.map((line, idx) => (
                        <div key={idx} className="animate-fade-in">
                            <p className={`text-lg md:text-2xl tracking-wider shadow-black drop-shadow-md ${line.style || 'text-green-600'}`}>
                                {line.text}
                            </p>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <span className="text-green-500 text-xl">{'>'}</span>
                        <span className="inline-block w-3 h-6 bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                    </div>
                </div>
            </div>
        );
    }
    if (introStage === 'HACKER') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                <h2 className="text-xl md:text-3xl font-mono text-green-500 mb-6 animate-pulse">{t('gameEngine.intro.messageIncoming')}</h2>
                <div className="max-w-3xl w-full aspect-video bg-gray-900 border-2 border-green-900 rounded-lg overflow-hidden relative shadow-[0_0_20px_rgba(0,255,0,0.2)] mb-8">
                    <iframe width="100%" height="100%" src={getVideoSrc('HACKER')} title="Mensaje" style={{ border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                </div>
                <Button onClick={() => setIntroStage('NONE')} variant="primary" className="bg-green-900/50 border-green-500 text-green-100">{t('gameEngine.intro.continue')}</Button>
            </div>
        );
    }
    if (introStage === 'MAP') {
        return (
            <div className="fixed inset-0 bg-navarra-dark z-50 flex flex-col animate-fade-in overflow-hidden">
                <div className="absolute inset-0 z-0">{mapUrl && <img src={mapUrl} className="w-full h-full object-cover sepia contrast-125 opacity-60" alt="Map" />}<div className="absolute inset-0 bg-black/60"></div></div>
                <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto p-6 justify-center text-center">
                    <div className="bg-black/80 border border-navarra-gold/50 p-6 rounded-lg backdrop-blur-md shadow-2xl">
                        <h3 className="text-navarra-gold uppercase tracking-widest font-bold mb-4">{t('gameEngine.map.objective')}</h3>
                        <p className="text-white text-lg font-serif leading-relaxed">{t('gameEngine.map.instruction')}</p>
                        <Button onClick={() => setIntroStage('NONE')} className="mt-6 w-full">{t('gameEngine.map.imHere')}</Button>
                    </div>
                </div>
            </div>
        );
    }

    // --- FINALE RENDER ---
    if (gameState.isGameFinished) {
        if (showFinaleVideo) {
            return (
                <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
                    <div className="w-full h-full relative">
                        <video className="w-full h-full object-cover" autoPlay playsInline onEnded={() => setShowFinaleVideo(false)} controls={false}>
                            <source src={finaleVideoUrl || ""} type="video/mp4" />
                        </video>
                        <button onClick={() => setShowFinaleVideo(false)} className="absolute bottom-10 right-6 bg-black/50 text-white border px-4 py-2 rounded">{t('gameEngine.certificate.close')}</button>
                    </div>
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-navarra-dark text-navarra-parchment relative overflow-hidden flex flex-col items-center justify-center p-6">
                <div className="bg-black/60 backdrop-blur-md border-2 border-navarra-gold p-8 rounded-lg max-w-md w-full shadow-2xl text-center space-y-6">
                    <h1 className="text-4xl font-serif text-white font-bold">{t('gameEngine.finale.title')}</h1>
                    <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6">
                        <div className="col-span-2"><p className="text-xs uppercase text-gray-400">{t('gameEngine.finale.score')}</p><p className="text-navarra-gold text-5xl font-serif">{finalScore}</p></div>
                        <div><p className="text-xs uppercase text-gray-400">{t('gameEngine.finale.time')}</p><p className="text-white font-bold text-xl">{finalTime} min</p></div>
                        <div><p className="text-xs uppercase text-gray-400">{t('gameEngine.finale.clues')}</p><p className="text-white font-bold text-xl">{gameState.hintsUsed}</p></div>
                        <div className="col-span-2 md:col-span-1"><p className="text-xs uppercase text-gray-400">{t('gameEngine.finale.mistakes')}</p><p className="text-white font-bold text-xl">{gameState.mistakesMade}</p></div>
                    </div>

                    {!showCertificate ? (
                        <div className="space-y-4">
                            <div className="bg-navarra-panel/50 p-4 rounded border border-navarra-gold/20">
                                <input
                                    type="text"
                                    placeholder={t('gameEngine.finale.placeholderName')}
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full bg-black/50 border-b-2 border-navarra-gold text-white p-3 text-center focus:outline-none mb-3 font-serif"
                                />
                                <Button onClick={handleGenerateCertificate} className="w-full text-sm py-3">
                                    {t('gameEngine.finale.genCert')}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Button onClick={() => setShowCertificate(true)} variant="primary" className="w-full shadow-lg">
                                {t('gameEngine.finale.viewCert')}
                            </Button>
                        </div>
                    )}

                    {/* RESTORED CONTEXT BUTTONS */}
                    <div className="space-y-3 pt-4 border-t border-white/10 w-full">
                        <Button
                            onClick={() => setShowFeedbackModal(true)}
                            variant="secondary"
                            className="w-full flex items-center justify-center gap-2 text-sm !bg-black !border-navarra-gold !text-navarra-gold hover:!bg-navarra-gold hover:!text-black transition-colors"
                        >
                            <span>⭐</span> <span className="font-bold">{t('gameEngine.finale.feedbackBtn')}</span>
                        </Button>
                        <Button onClick={() => setShowFinaleVideo(true)} variant="secondary" className="w-full flex items-center justify-center gap-2 text-sm">
                            <span>🎬</span> {t('gameEngine.finale.video')}
                        </Button>
                        <Button onClick={() => setShowHistoryModal(true)} variant="secondary" className="w-full flex items-center justify-center gap-2 text-sm bg-navarra-crimson/20 border-navarra-crimson/50 text-navarra-crimson hover:bg-navarra-crimson hover:text-white">
                            <span>📜</span> {t('gameEngine.finale.history')}
                        </Button>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <Button onClick={onReset} variant="danger" className="text-xs">{t('gameEngine.finale.reset')}</Button>
                        <button onClick={onExit} className="text-gray-400 underline text-sm">{t('gameEngine.finale.menu')}</button>
                    </div>
                </div>

                {/* FEEDBACK MODAL */}
                {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}

                {/* CERTIFICATE MODAL */}
                {showCertificate && (
                    <div className="fixed inset-0 z-[100] bg-black/90 overflow-y-auto p-4 flex items-center justify-center">
                        <div ref={certificateRef} className="bg-[#fcf5e5] text-black w-full max-w-3xl relative p-12 border-8 border-double border-[#8a7224] text-center font-serif shadow-2xl bg-[url('/paper-texture.png')] bg-cover">
                            {/* Inner Border */}
                            <div className="absolute inset-4 border-2 border-[#8a7224] pointer-events-none"></div>

                            {/* Decorative corners */}
                            <div className="absolute top-6 left-6 w-24 h-24 border-t-4 border-l-4 border-[#8a1c1c] opacity-60"></div>
                            <div className="absolute top-6 right-6 w-24 h-24 border-t-4 border-r-4 border-[#8a1c1c] opacity-60"></div>
                            <div className="absolute bottom-6 left-6 w-24 h-24 border-b-4 border-l-4 border-[#8a1c1c] opacity-60"></div>
                            <div className="absolute bottom-6 right-6 w-24 h-24 border-b-4 border-r-4 border-[#8a1c1c] opacity-60"></div>

                            {/* Header / Logo */}
                            <div className="mb-6 flex justify-center">
                                <img src="/logo.png" alt="Navarra Escape City" className="h-24 object-contain drop-shadow-sm opacity-90" />
                            </div>

                            <h2 className="text-5xl md:text-6xl font-bold uppercase text-[#8a1c1c] mb-2 tracking-tighter" style={{ fontFamily: 'Cinzel, serif' }}>{t('gameEngine.certificate.title')}</h2>
                            <div className="w-32 h-1 bg-[#8a7224] mx-auto mb-4"></div>

                            <p className="text-xl italic mb-8 text-gray-700 font-medium">{t('gameEngine.certificate.certifiedBy')}</p>

                            <div className="mb-10 relative">
                                <h3 className="text-4xl md:text-5xl font-bold font-serif text-[#1a1814] border-b-2 border-black/30 pb-4 px-12 inline-block italic">
                                    {playerName}
                                </h3>
                            </div>

                            <p className="text-xl leading-relaxed mb-10 text-gray-800 max-w-2xl mx-auto">
                                {t('gameEngine.certificate.completedText')} <br />
                                <span className="font-bold text-[#8a7224] text-3xl block mt-2" style={{ fontFamily: 'Cinzel, serif' }}>"{config.title}"</span>
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto border-t border-b border-[#8a7224]/30 py-6 mb-8 bg-[#8a7224]/5 rounded-lg">
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a1c1c] font-bold mb-1">{t('gameEngine.certificate.finalScore')}</p>
                                    <p className="text-3xl font-bold text-[#1a1814]">{finalScore}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a1c1c] font-bold mb-1">{t('gameEngine.certificate.totalTime')}</p>
                                    <p className="text-3xl font-bold text-[#1a1814]">{finalTime}'</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a1c1c] font-bold mb-1">{t('gameEngine.certificate.hintsUsed')}</p>
                                    <p className="text-3xl font-bold text-[#1a1814]">{gameState.hintsUsed}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a1c1c] font-bold mb-1">{t('gameEngine.certificate.errors')}</p>
                                    <p className="text-3xl font-bold text-[#1a1814]">{gameState.mistakesMade}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center text-sm uppercase tracking-widest text-gray-600 font-bold px-12 mt-8">
                                <div>{new Date().toLocaleDateString()} &bull; Navarra</div>
                                <div className="mt-2 md:mt-0 text-[#8a1c1c]">estellaescapecity.com</div>
                            </div>

                            {/* Ignored in canvas */}
                            <div className="mt-12 flex flex-wrap justify-center gap-4" data-html2canvas-ignore>
                                <Button onClick={() => handleCertificateAction('share')} disabled={isGeneratingImage} className="shadow-xl bg-[#25D366] border-[#25D366] text-white hover:bg-[#128C7E] min-w-[160px]">
                                    {isGeneratingImage ? t('gameEngine.certificate.generating') : (
                                        <span className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" /></svg>
                                            {t('gameEngine.certificate.share')}
                                        </span>
                                    )}
                                </Button>
                                <Button onClick={() => handleCertificateAction('download')} disabled={isGeneratingImage} variant="secondary" className="shadow-md text-xs min-w-[160px]">
                                    <span className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" /><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" /></svg>
                                        {t('gameEngine.certificate.download')}
                                    </span>
                                </Button>
                                <button onClick={() => setShowCertificate(false)} className="text-black/60 hover:text-[#8a1c1c] w-full mt-4 text-xs uppercase tracking-widest transition-colors">{t('gameEngine.certificate.close')}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* HISTORICAL CONTEXT MODAL RENDERED HERE FOR COMPLETION SCREEN */}
                {showHistoryModal && <HistoricalContext onClose={() => setShowHistoryModal(false)} />}
            </div>
        );
    }

    // --- INTERSTITIAL VIDEOS ---
    if (showPhase1OutroVideo) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-xl md:text-3xl font-serif text-navarra-gold mb-6 animate-pulse">{t('gameEngine.rewards.phaseEnd1')}</h2>
                <div className="max-w-3xl w-full aspect-video bg-gray-900 border-2 border-navarra-gold rounded-lg overflow-hidden mb-8">
                    <iframe
                        width="100%"
                        height="100%"
                        src={getVideoSrc('PHASE_1_OUTRO')}
                        title="Fin Fase 1"
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <Button onClick={() => { setShowPhase1OutroVideo(false); setRewardData({ title: t('gameEngine.rewards.phaseComp'), message: t('puzzles.p3.successMessage') }); }}>{t('gameEngine.intro.continue')}</Button>
            </div>
        );
    }
    if (showPhase2OutroVideo) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-xl md:text-3xl font-serif text-navarra-gold mb-6 animate-pulse">{t('gameEngine.rewards.phaseEnd2')}</h2>
                <div className="max-w-3xl w-full aspect-video bg-gray-900 border-2 border-navarra-gold rounded-lg overflow-hidden mb-8">
                    <iframe
                        width="100%"
                        height="100%"
                        src={getVideoSrc('PHASE_2_OUTRO')}
                        title="Fin Fase 2"
                        style={{ border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <Button onClick={() => { setShowPhase2OutroVideo(false); setRewardData({ title: t('gameEngine.rewards.phaseComp'), message: t('puzzles.p6.successMessage') }); }}>{t('gameEngine.intro.continue')}</Button>
            </div>
        );
    }

    // --- TRAVEL VIEW ---
    if (viewMode === 'TRAVEL' && translatedPuzzle.travelConfig) {
        // Geofencing Check
        const canContinue = gpsBypass || (userDistance !== null && userDistance < 200);

        if (showTravelVideo && translatedPuzzle.travelConfig.videoUrl) {
            return (
                <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 text-center">
                    <div className="max-w-3xl w-full aspect-video bg-gray-900 border-2 border-navarra-gold rounded relative mb-8">
                        <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
                            <source src={translatedPuzzle.travelConfig.videoUrl} type="video/mp4" />
                        </video>
                    </div>
                    <Button onClick={() => setShowTravelVideo(false)} variant="secondary">{t('gameEngine.intro.skip')}</Button>
                </div>
            );
        }
        return (
            <div className="fixed inset-0 bg-navarra-dark z-50 flex flex-col animate-fade-in overflow-hidden">
                {/* NEW: Top Right Controls for Travel View */}
                <div className="absolute top-4 right-4 z-50 flex gap-2 bg-black/40 p-1 rounded-full border border-navarra-gold/20 backdrop-blur-sm">
                    <AudioToggle />
                    <GpsToggle />
                </div>

                <div className="absolute inset-0 z-0"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Navarra_-_San_Pedro_de_la_R%C3%ADa_06.jpg" className="w-full h-full object-cover opacity-40 blur-sm" alt="Travel" /><div className="absolute inset-0 bg-black/60"></div></div>
                <div className="relative z-10 flex flex-col h-full w-full max-w-md mx-auto p-6 justify-center">
                    <div className="bg-black/80 border border-navarra-gold/50 p-6 rounded-lg backdrop-blur-md shadow-2xl">
                        <h3 className="text-navarra-gold uppercase tracking-widest font-bold mb-2 border-b border-navarra-gold/30 pb-2">{t('gameEngine.gps.nextDest')}</h3>
                        <p className="text-white text-lg font-serif leading-relaxed text-center">{translatedPuzzle.travelConfig.instructionText}</p>
                    </div>

                    <div className="mt-10 flex flex-col gap-6 items-center">
                        {gpsError ? (
                            <div className="bg-red-900/50 p-4 rounded border border-red-500 text-center w-full">
                                <p className="text-red-200 text-sm">{gpsError}</p>
                            </div>
                        ) : !canContinue ? (
                            <div className="bg-black/60 p-4 rounded border border-navarra-stone text-center animate-pulse w-full">
                                <p className="text-navarra-gold uppercase tracking-widest text-xs mb-1">{t('gameEngine.gps.distanceLabel')}</p>
                                <p className="text-3xl font-bold text-white">{userDistance !== null ? `${userDistance} m` : t('gameEngine.gps.calculating')}</p>
                                <p className="text-gray-400 text-xs mt-2">{t('gameEngine.gps.approach')}</p>
                            </div>
                        ) : null}

                        <Button
                            onClick={() => setViewMode('PUZZLE')}
                            disabled={!canContinue}
                            className={`w-full py-4 text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] ${canContinue ? 'animate-pulse-slow' : 'opacity-50 grayscale cursor-not-allowed'}`}
                        >
                            {gpsBypass ? t('gameEngine.gps.imHereGod') : t('gameEngine.map.imHere')}
                        </Button>

                        {translatedPuzzle.travelConfig.googleMapsUrl && (
                            <a
                                href={translatedPuzzle.travelConfig.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-bold text-navarra-gold/80 hover:text-white border-b border-dashed border-navarra-gold/50 hover:border-white pb-1 transition-all"
                            >
                                {t('gameEngine.gps.openMaps')}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const progress = Math.round((gameState.currentStageIndex / config.puzzles.length) * 100);

    return (
        <div className="min-h-screen bg-navarra-dark text-navarra-parchment pb-24">
            <header className="fixed top-0 w-full bg-navarra-dark/95 border-b border-navarra-gold/30 z-40 px-4 py-3 flex justify-between items-center backdrop-blur shadow-lg">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="text-navarra-gold hover:text-white">❮</button>
                    <div className="w-8 h-8 rounded-full bg-navarra-gold flex items-center justify-center text-navarra-dark text-xs font-bold shadow-lg">{gameState.currentStageIndex + 1}</div>
                    <div className="hidden md:flex gap-4 ml-4 bg-black/40 px-3 py-1 rounded-full border border-navarra-gold/10">
                        {[Phase.FORTRESS, Phase.WATER, Phase.KNOWLEDGE].map(p => (
                            <span key={p} className={`text-xl transition-all ${translatedPuzzle.phase === p ? 'opacity-100 scale-125' : 'opacity-30 grayscale'}`}>{getPhaseIcon(p)}</span>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    {/* NEW: Controls in Main Header */}
                    <div className="flex gap-2 mr-2">
                        <AudioToggle />
                        <GpsToggle />
                    </div>

                    <div className={`hidden md:flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-opacity duration-500 ${isSaving ? 'opacity-100 text-navarra-gold' : 'opacity-0'}`}>
                        <span>💾</span> {t('gameEngine.header.saving')}
                    </div>
                    <Timer startTime={gameState.startTime} />
                    {translatedPuzzle.hint && <button onClick={handleHintClick} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${isHintRevealed ? 'bg-amber-900/30 text-amber-200' : 'bg-navarra-gold/10 text-navarra-gold'}`}>💡 {isHintRevealed ? t('gameEngine.header.hint') : t('gameEngine.header.help')}</button>}
                </div>
            </header>
            <div className="fixed top-[57px] w-full h-1 bg-gray-900 z-40"><div className="h-full bg-navarra-gold transition-all duration-700" style={{ width: `${progress}%` }}></div></div>

            <main className="pt-24 px-4 max-w-2xl mx-auto space-y-8 animate-fade-in">
                {currentPuzzleImage && (
                    <div className="rounded-lg overflow-hidden shadow-2xl border border-navarra-gold/20 relative aspect-video">
                        <SafeImage src={currentPuzzleImage} alt={translatedPuzzle.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navarra-dark/80 to-transparent"></div>
                    </div>
                )}
                <Card className="border-t-4 border-t-navarra-gold">
                    <div className="flex items-center gap-2 mb-3 text-navarra-gold uppercase text-xs tracking-[0.2em] font-bold">
                        <span className="w-2 h-2 bg-navarra-crimson rounded-full animate-pulse"></span>
                        {translatedPuzzle.location}
                    </div>
                    <p className="text-lg md:text-xl text-navarra-parchment leading-relaxed font-light font-serif">{translatedPuzzle.description}</p>
                </Card>
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-black/60 to-transparent p-6 border-l-4 border-navarra-gold rounded-r-lg backdrop-blur-sm">
                        <p className="font-serif text-xl md:text-2xl italic text-navarra-gold leading-relaxed">"{translatedPuzzle.clue}"</p>
                    </div>
                    {feedback && <div className="p-4 bg-navarra-gold text-navarra-dark font-bold text-center animate-pulse rounded">{feedback}</div>}
                    <div className="bg-navarra-panel/50 p-6 rounded-lg border border-navarra-stone">{renderPuzzleInput()}</div>
                </div>

                {/* INVENTARIO COMPLETO (INTERACTIVO) */}
                <div className="mt-12 pt-8 border-t border-navarra-gold/20">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4 text-center">{t('gameEngine.fragments.label')}</h3>
                    <div className="flex justify-center gap-3 flex-wrap">
                        {FRAGMENTS.map((frag) => {
                            const isCollected = gameState.inventory.includes(frag.id);
                            return (
                                <button
                                    key={frag.id}
                                    onClick={() => isCollected && handleFragmentClick(frag)}
                                    disabled={!isCollected}
                                    className={`w-12 h-16 flex items-center justify-center font-bold text-xl rounded shadow-lg border transition-all duration-300
                                    ${isCollected
                                            ? 'bg-[#fcf5e5] text-navarra-dark border-navarra-gold scale-100 hover:scale-110 hover:shadow-navarra-gold/30 cursor-pointer'
                                            : 'bg-black/30 text-gray-700 border-gray-800 scale-95 cursor-not-allowed'}`}
                                >
                                    {isCollected ? '📜' : <span className="text-xs opacity-20">{frag.id}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* CODEX READER MODAL */}
            {readingFragment && (
                <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm" onClick={() => setReadingFragment(null)}>
                    <div
                        className="bg-[#fcf5e5] w-full max-w-md relative p-8 border-[8px] border-double border-[#8a7224] shadow-[0_0_50px_rgba(212,175,55,0.3)] animate-float bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] text-black font-serif leading-relaxed"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setReadingFragment(null)} className="absolute top-2 right-2 text-[#8a1c1c] text-xl font-bold hover:scale-110 transition-transform">✕</button>

                        <div className="text-center mb-6 border-b-2 border-[#8a7224]/30 pb-4">
                            <span className="text-[#8a1c1c] text-xs uppercase tracking-widest font-bold block mb-1">{t('gameEngine.fragments.title', { id: readingFragment.id })}</span>
                            <h3 className="text-2xl font-bold text-[#1a1814]">{readingFragment.title}</h3>
                        </div>

                        <div className="text-lg italic text-gray-800 mb-6 relative">
                            <span className="absolute -top-4 -left-2 text-6xl text-[#8a7224]/20 font-black">“</span>
                            {readingFragment.content}
                            <span className="absolute -bottom-4 right-0 text-6xl text-[#8a7224]/20 font-black">”</span>
                        </div>

                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">— {readingFragment.author}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* REWARD MODAL */}
            {rewardData && (
                <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6 animate-fade-in backdrop-blur-md">
                    <Card className="max-w-md w-full border-2 border-navarra-gold text-center">
                        <div className="mb-6"><h2 className="text-3xl text-navarra-gold font-serif font-bold uppercase tracking-widest">{rewardData.title}</h2></div>
                        {/* SCROLLABLE MESSAGE CONTAINER */}
                        <div className="bg-black/40 p-4 rounded border border-navarra-gold/30 mb-8 max-h-[50vh] overflow-y-auto custom-scrollbar">
                            <p className="text-white text-lg font-serif italic leading-relaxed whitespace-pre-line">{rewardData.message}</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {translatedPuzzle.learnMoreId && <Button onClick={() => setShowLearnMore(true)} variant="secondary" className="w-full text-sm py-3">{t('gameEngine.hints.moreInfo')}</Button>}
                            <Button onClick={() => { setRewardData(null); completeStage(); }} className="w-full py-4 text-lg">
                                {gameState.currentStageIndex >= config.puzzles.length - 1 ? t('gameEngine.rewards.missionComp') : t('gameEngine.rewards.continue')}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {showLearnMore && translatedPuzzle.learnMoreId && extendedInfo[translatedPuzzle.learnMoreId] && <LearnMoreModal data={extendedInfo[translatedPuzzle.learnMoreId]} onClose={() => setShowLearnMore(false)} />}

            {showHistoryModal && <HistoricalContext onClose={() => setShowHistoryModal(false)} />}

            <Modal
                isOpen={showHintModal}
                title={isHintRevealed ? t('gameEngine.hints.modalTitleReveal') : t('gameEngine.hints.modalTitleAsk')}
                message={isHintRevealed ? (translatedPuzzle.hint || t('gameEngine.hints.noHints')) : t('gameEngine.hints.warning')}
                onConfirm={() => {
                    if (!isHintRevealed) {
                        confirmHintReveal();
                    } else {
                        setShowHintModal(false);
                    }
                }}
                onCancel={() => setShowHintModal(false)}
                confirmText={isHintRevealed ? t('gameEngine.hints.understand') : t('gameEngine.hints.reveal')}
                cancelText={isHintRevealed ? t('gameEngine.certificate.close') : t('ui.modal.cancel')}
                confirmVariant={isHintRevealed ? "primary" : "danger"}
            />

            {gameState.showDialogue && <DialogueBox speaker={translatedPuzzle.speaker || "Narrador"} text={translatedPuzzle.audioTranscript || ""} onNext={() => setGameState(prev => ({ ...prev, showDialogue: false }))} image={currentSpeakerImage || undefined} />}
        </div>
    );
};
