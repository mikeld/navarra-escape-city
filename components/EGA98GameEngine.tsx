import React, { useState, useEffect } from 'react';
import { GameState, GameConfig, Phase, PuzzleData } from '../types';
import { saveState, calculateDistance, logGameEvent } from '../services/gameService';
import { audioManager } from '../services/audioService';
import { Button, GpsToggle } from './UIComponents';
import EmailInbox from './puzzles/EmailInbox';
import OldComputer from './puzzles/OldComputer';
import AccessPuzzle from './puzzles/AccessPuzzle';
import BusSchedulePuzzle from './puzzles/BusSchedulePuzzle';
import StationCountingPuzzle from './puzzles/StationCountingPuzzle';
import RailwayPuzzle from './puzzles/RailwayPuzzle';
import { useTranslation } from 'react-i18next';

interface EGA98GameEngineProps {
    config: GameConfig;
    initialState: GameState;
    onExit: () => void;
    onReset: () => void;
}

type EGA98Stage =
    | 'PROLOGUE'
    | 'EMAIL'
    | 'COMPUTER'
    | 'BUS_SCHEDULE'
    | 'STATION_COUNTING'
    | 'RAILWAY'
    | 'ACT_1_INTRO'
    | 'ACT_1'
    | 'ACT_2'
    | 'ACT_3'
    | 'ACT_4'
    | 'ACT_5'
    | 'ACT_6'
    | 'ACCESS'
    | 'FINALE'
    | 'COMPLETE';

export const EGA98GameEngine: React.FC<EGA98GameEngineProps> = ({
    config,
    initialState,
    onExit,
    onReset
}) => {
    const { t, i18n } = useTranslation();
    const [gameState, setGameState] = useState<GameState>(initialState);
    const [currentStage, setCurrentStage] = useState<EGA98Stage>(() => {
        // Initialize from saved state if available
        if (initialState && initialState.stage && initialState.stage !== 'PROLOGUE') {
            return initialState.stage as EGA98Stage;
        }
        return 'PROLOGUE';
    });

    // Progress saving: Track watched videos
    const [watchedVideos, setWatchedVideos] = useState<Set<string>>(() => {
        const saved = localStorage.getItem('ega98_watched_videos');
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });

    // Travel/Location State
    const [viewMode, setViewMode] = useState<'TRAVEL' | 'VIDEO'>('TRAVEL');
    const [userDistance, setUserDistance] = useState<number | null>(null);
    const [gpsBypass, setGpsBypass] = useState(false);
    const [gpsError, setGpsError] = useState<string | null>(null);

    // Computer Modal State (accessible from any stage)
    const [showComputerModal, setShowComputerModal] = useState(false);

    // Destino solved state (for ACT_1_INTRO)
    const [destinoSolved, setDestinoSolved] = useState(() => {
        return localStorage.getItem('ega98_destino_solved') === 'true';
    });

    // Video IDs for each stage (placeholders - will be replaced with real IDs)
    const VIDEO_IDS: Record<string, Record<string, string>> = {
        PROLOGUE: { es: 'PLACEHOLDER_PROLOGUE_ES', en: 'PLACEHOLDER_PROLOGUE_EN', eu: 'PLACEHOLDER_PROLOGUE_EU' },
        ACT_1: { es: 'PLACEHOLDER_ACT1_ES', en: 'PLACEHOLDER_ACT1_EN', eu: 'PLACEHOLDER_ACT1_EU' },
        ACT_2: { es: 'PLACEHOLDER_ACT2_ES', en: 'PLACEHOLDER_ACT2_EN', eu: 'PLACEHOLDER_ACT2_EU' },
        ACT_3: { es: 'PLACEHOLDER_ACT3_ES', en: 'PLACEHOLDER_ACT3_EN', eu: 'PLACEHOLDER_ACT3_EU' },
        ACT_4: { es: 'PLACEHOLDER_ACT4_ES', en: 'PLACEHOLDER_ACT4_EN', eu: 'PLACEHOLDER_ACT4_EU' },
        ACT_5: { es: 'PLACEHOLDER_ACT5_ES', en: 'PLACEHOLDER_ACT5_EN', eu: 'PLACEHOLDER_ACT5_EU' },
        FINALE: { es: 'PLACEHOLDER_FINALE_ES', en: 'PLACEHOLDER_FINALE_EN', eu: 'PLACEHOLDER_FINALE_EU' },
    };

    // Location configs for each act
    const LOCATION_CONFIGS: Record<string, { name: string; instruction: string; coords: { lat: number; lng: number }; googleMapsUrl?: string }> = {
        ACT_1: {
            name: t('ega98.locations.act1.name', 'Plaza de la Coronación'),
            instruction: t('ega98.locations.act1.instruction', 'Dirígete a la Plaza de la Coronación, junto a la Estación de Autobuses.'),
            coords: { lat: 42.6715, lng: -2.0290 },
            googleMapsUrl: 'https://maps.app.goo.gl/coronacion'
        },
        ACT_2: {
            name: t('ega98.locations.act2.name', 'Ayuntamiento'),
            instruction: t('ega98.locations.act2.instruction', 'Dirígete al Ayuntamiento de Navarra.'),
            coords: { lat: 42.6705, lng: -2.0310 },
            googleMapsUrl: 'https://maps.app.goo.gl/ayuntamiento'
        },
        ACT_3: {
            name: t('ega98.locations.act3.name', 'Plaza de San Juan'),
            instruction: t('ega98.locations.act3.instruction', 'Busca la Plaza de San Juan, donde estaban los Recreativos Cosmos.'),
            coords: { lat: 42.6698, lng: -2.0275 },
            googleMapsUrl: 'https://maps.app.goo.gl/sanjuan'
        },
        ACT_4: {
            name: t('ega98.locations.act4.name', 'Plaza de Santiago'),
            instruction: t('ega98.locations.act4.instruction', 'Camina hacia la Plaza de Santiago, siguiendo el camino del encierro.'),
            coords: { lat: 42.6688, lng: -2.0255 },
            googleMapsUrl: 'https://maps.app.goo.gl/santiago'
        },
        ACT_5: {
            name: t('ega98.locations.act5.name', 'Plaza de Toros'),
            instruction: t('ega98.locations.act5.instruction', 'Dirígete a la Plaza de Toros de Navarra.'),
            coords: { lat: 42.6725, lng: -2.0320 },
            googleMapsUrl: 'https://maps.app.goo.gl/toros'
        },
    };

    // Load GPS bypass setting
    useEffect(() => {
        const bypass = localStorage.getItem('estella_gps_bypass') === 'true';
        setGpsBypass(bypass);

        const handleBypassChange = () => {
            const newVal = localStorage.getItem('estella_gps_bypass') === 'true';
            setGpsBypass(newVal);
        };
        window.addEventListener('gps_bypass_changed', handleBypassChange);
        return () => window.removeEventListener('gps_bypass_changed', handleBypassChange);
    }, []);

    // Geolocation tracking for location-based stages
    useEffect(() => {
        let watchId: number;
        const locationConfig = LOCATION_CONFIGS[currentStage];

        if (viewMode === 'TRAVEL' && locationConfig && !gpsBypass) {
            if ("geolocation" in navigator) {
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const dist = calculateDistance(
                            position.coords.latitude,
                            position.coords.longitude,
                            locationConfig.coords.lat,
                            locationConfig.coords.lng
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
    }, [viewMode, currentStage, gpsBypass]);

    // Auto-save state
    useEffect(() => {
        saveState(gameState);
    }, [gameState]);

    // Audio management
    useEffect(() => {
        audioManager.playBGM('MENU'); // TODO: Add EGA98-specific music
    }, [currentStage]);

    // Save watched videos to localStorage
    useEffect(() => {
        localStorage.setItem('ega98_watched_videos', JSON.stringify(Array.from(watchedVideos)));
    }, [watchedVideos]);

    // Auto-advance PROLOGUE if already watched
    useEffect(() => {
        if (currentStage === 'PROLOGUE' && watchedVideos.has('PROLOGUE')) {
            advanceToNextStage();
        }
    }, [currentStage, watchedVideos]);

    // Auto-skip EMAIL if already completed
    useEffect(() => {
        if (currentStage === 'EMAIL') {
            const emailCompleted = localStorage.getItem('ega98_email_completed') === 'true';
            if (emailCompleted) {
                advanceToNextStage();
            }
        }
    }, [currentStage]);

    // Auto-skip COMPUTER stage if destino already solved (returning players)
    useEffect(() => {
        if (currentStage === 'COMPUTER' && destinoSolved) {
            advanceToNextStage();
        }
    }, [currentStage, destinoSolved]);

    // Listen for destino solved event
    useEffect(() => {
        const checkDestino = () => {
            const solved = localStorage.getItem('ega98_destino_solved') === 'true';
            setDestinoSolved(solved);
        };
        window.addEventListener('destino_solved', checkDestino);
        return () => window.removeEventListener('destino_solved', checkDestino);
    }, []);

    // Mark video as watched
    const markVideoAsWatched = (stageKey: string) => {
        setWatchedVideos(prev => new Set([...prev, stageKey]));
    };

    // Get video URL for current language
    const getVideoUrl = (stageKey: string) => {
        const lang = i18n.language.substring(0, 2);
        const videoId = VIDEO_IDS[stageKey]?.[lang] || VIDEO_IDS[stageKey]?.es;
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    };

    // Stage navigation
    const advanceToNextStage = () => {
        const stageOrder: EGA98Stage[] = [
            'PROLOGUE', 'EMAIL', 'COMPUTER', 'ACT_1_INTRO',
            'BUS_SCHEDULE', 'STATION_COUNTING', 'RAILWAY',
            'ACT_1', 'ACT_2', 'ACT_3', 'ACT_4', 'ACT_5',
            'ACT_6', 'ACCESS', 'FINALE', 'COMPLETE'
        ];
        const currentIndex = stageOrder.indexOf(currentStage);
        if (currentIndex < stageOrder.length - 1) {
            const nextStage = stageOrder[currentIndex + 1];
            setCurrentStage(nextStage);
            setViewMode('TRAVEL');
            logGameEvent('ega98_stage_complete', { stage: currentStage });
        }
    };

    const handleArrivedAtLocation = () => {
        setViewMode('VIDEO');
    };

    // Computer Modal Overlay
    const ComputerModal = () => {
        if (currentStage === 'COMPUTER') {
            return (
                <div className="fixed inset-0 z-50">
                    <div className="absolute top-0 left-0 right-0 bg-black/80 p-4 flex items-center justify-between z-10">
                        <button onClick={onExit} className="text-gray-400 hover:text-white">
                            ← {t('common.backToHome')}
                        </button>
                    </div>
                    <div className="pt-14">
                        <OldComputer
                            onSolved={advanceToNextStage}
                            onClose={() => { }} // Cannot close main stage
                        />
                    </div>
                </div>
            );
        }
        if (!showComputerModal) return null;

        return (
            <div
                className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={() => setShowComputerModal(false)}
            >
                <div onClick={(e) => e.stopPropagation()} className="h-full">
                    <OldComputer
                        isModal={true}
                        onClose={() => setShowComputerModal(false)}
                    />
                </div>
            </div>
        );
    };

    // ========================================
    // RENDER: PROLOGUE
    // ========================================
    if (currentStage === 'PROLOGUE') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
                {/* Header */}
                <div className="bg-black/80 p-4 flex items-center justify-between border-b border-gray-800">
                    <button onClick={onExit} className="text-gray-400 hover:text-white">
                        ← {t('common.backToHome')}
                    </button>
                    <GpsToggle />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-auto">
                    <h1 className="text-3xl md:text-5xl font-serif text-red-600 mb-3 animate-pulse">
                        CASO EGA-98
                    </h1>
                    <h2 className="text-xl md:text-2xl text-gray-300 mb-2 font-mono tracking-wider">
                        PRÓLOGO
                    </h2>
                    <h3 className="text-base md:text-lg text-gray-500 mb-8 font-mono italic">
                        EL DINERO QUE NO DEBÍA EXISTIR
                    </h3>

                    {/* Video Container */}
                    <div className="max-w-4xl w-full aspect-video bg-gray-900 border-2 border-red-900/50 rounded-lg overflow-hidden mb-8 shadow-2xl shadow-red-900/30">
                        <iframe
                            width="100%"
                            height="100%"
                            src={getVideoUrl('PROLOGUE')}
                            title="Prólogo - El Dinero que no Debía Existir"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>

                    {/* Narration Text */}
                    <div className="max-w-3xl text-left bg-black/40 border border-gray-800 rounded-lg p-6 md:p-8 mb-8">
                        <p className="text-red-400 font-bold text-lg md:text-xl mb-4 text-center">
                            Navarra, 1998.
                        </p>
                        <div className="text-gray-300 text-sm md:text-base leading-relaxed space-y-4 font-sans">
                            <p>
                                A finales de los años 90, el Ayuntamiento de Navarra gestiona en silencio un fondo extraordinario procedente de Europa,
                                destinado a proyectos del año 2000. Digitalización, modernización, infraestructuras futuras.
                            </p>
                            <p className="text-gray-400 italic">
                                No es dinero para gastar.<br />
                                No es dinero para mover.<br />
                                Es dinero para esperar.
                            </p>
                            <p>
                                La cifra nunca se publica oficialmente, pero en los pasillos se habla de <span className="text-yellow-400 font-bold">unos 40 millones de pesetas</span>.
                            </p>
                            <p>
                                Ese dinero permanece guardado, fragmentado administrativamente, protegido por procedimientos pensados para un mundo analógico…
                            </p>
                            <p className="text-red-300 font-bold text-center pt-2">
                                y por una certeza peligrosa:
                            </p>
                            <p className="text-white text-center text-lg md:text-xl font-bold">
                                nadie cree que pueda desaparecer.
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => { markVideoAsWatched('PROLOGUE'); advanceToNextStage(); }} className="text-lg px-8 py-4">
                        Continuar ►
                    </Button>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: EMAIL INBOX
    // ========================================
    if (currentStage === 'EMAIL') {
        return (
            <>
                <div className="fixed inset-0 z-50 bg-[#1a1a2e]">
                    <EmailInbox onSolved={advanceToNextStage} onExit={onExit} />
                </div>
                <ComputerModal />
            </>
        );
    }

    // ========================================
    // RENDER: BUS SCHEDULE PUZZLE
    // ========================================
    if (currentStage === 'BUS_SCHEDULE') {
        return (
            <>
                <BusSchedulePuzzle
                    onSolved={advanceToNextStage}
                    onExit={onExit}
                    onOpenComputer={() => setShowComputerModal(true)}
                />
                <ComputerModal />
            </>
        );
    }

    // ========================================
    // RENDER: STATION COUNTING PUZZLE
    // ========================================
    if (currentStage === 'STATION_COUNTING') {
        return (
            <>
                <StationCountingPuzzle
                    onSolved={advanceToNextStage}
                    onExit={onExit}
                    onOpenComputer={() => setShowComputerModal(true)}
                />
                <ComputerModal />
            </>
        );
    }

    // ========================================
    // RENDER: RAILWAY PUZZLE (VÍA VERDE)
    // ========================================
    if (currentStage === 'RAILWAY') {
        return (
            <>
                <RailwayPuzzle
                    onSolved={advanceToNextStage}
                    onExit={onExit}
                    onOpenComputer={() => setShowComputerModal(true)}
                />
                <ComputerModal />
            </>
        );
    }

    // ========================================
    // RENDER: ACT 1 INTRO PANEL
    // ========================================
    if (currentStage === 'ACT_1_INTRO') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
                {/* Header with computer button */}
                <div className="bg-black/80 p-4 flex items-center justify-between border-b border-gray-800">
                    <button onClick={onExit} className="text-gray-400 hover:text-white text-sm">
                        ← {t('common.backToHome')}
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowComputerModal(true)}
                            className="w-8 h-8 bg-[#008080] hover:bg-[#009090] border border-[#00b0b0] rounded flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                            title={t('ega98.computer.openComputer', 'Ordenador')}
                        >
                            <span className="text-base">💻</span>
                        </button>
                        <GpsToggle />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="max-w-lg text-center">
                        <h2 className="text-3xl font-serif text-red-500 mb-4">
                            {t('ega98.acts.act1.introTitle', 'ACTO 1')}
                        </h2>
                        <h3 className="text-2xl text-white mb-6">
                            {t('ega98.acts.act1.introSubtitle', 'La Distracción')}
                        </h3>

                        <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6 mb-4">
                            <p className="text-gray-300 font-bold mb-2">
                                📍 Plaza de la Coronación
                            </p>
                            <p className="text-gray-400">
                                {t('ega98.acts.act1.introReady', 'Ahora debes resolver los enigmas de la zona para descubrir qué pasó aquí en 1998.')}
                            </p>
                        </div>

                        {!destinoSolved && (
                            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4 mb-8 animate-pulse">
                                <p className="text-yellow-300 text-sm">
                                    💻 {t('ega98.acts.act1.computerHint', 'Abre el ordenador del Capi para encontrar pistas sobre el destino.')}
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={advanceToNextStage}
                            disabled={!destinoSolved}
                            className={!destinoSolved ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            {t('ega98.acts.continue', 'Continuar ►')}
                        </Button>
                    </div>
                </div>

                <ComputerModal />
            </div>
        );
    }

    // ========================================
    // RENDER: LOCATION-BASED ACTS (ACT_1 to ACT_5)
    // ========================================
    if (['ACT_1', 'ACT_2', 'ACT_3', 'ACT_4', 'ACT_5'].includes(currentStage)) {
        const locationConfig = LOCATION_CONFIGS[currentStage];
        const actNumber = parseInt(currentStage.split('_')[1]);
        const actTitles: Record<string, string> = {
            ACT_1: t('ega98.acts.act1.title', 'La Distracción'),
            ACT_2: t('ega98.acts.act2.title', 'El Robo'),
            ACT_3: t('ega98.acts.act3.title', 'El Cosmos'),
            ACT_4: t('ega98.acts.act4.title', 'La Huida'),
            ACT_5: t('ega98.acts.act5.title', 'La Coartada'),
        };


        // Travel View
        if (viewMode === 'TRAVEL') {
            return (
                <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 flex flex-col">
                    {/* Header */}
                    <div className="bg-black/80 p-4 flex items-center justify-between border-b border-gray-800">
                        <button onClick={onExit} className="text-gray-400 hover:text-white text-sm">
                            ← {t('common.backToHome')}
                        </button>
                        <span className="text-gray-500 text-sm font-mono">
                            {t('ega98.acts.actLabel', 'ACTO')} {actNumber}
                        </span>
                        <div className="flex items-center gap-2">
                            {/* Computer Access Button */}
                            <button
                                onClick={() => setShowComputerModal(true)}
                                className="w-8 h-8 bg-[#008080] hover:bg-[#009090] border border-[#00b0b0] rounded flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                title={t('ega98.computer.openComputer', 'Ordenador')}
                            >
                                <span className="text-base">💻</span>
                            </button>
                            <GpsToggle />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="max-w-md w-full bg-black/50 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-2xl font-serif text-red-500 mb-2">
                                {t('ega98.acts.actLabel', 'ACTO')} {actNumber}
                            </h2>
                            <h3 className="text-xl text-white mb-6">
                                {actTitles[currentStage]}
                            </h3>

                            <div className="bg-gray-900/50 rounded p-4 mb-6">
                                <p className="text-gray-300 font-bold mb-2">📍 {locationConfig.name}</p>
                                <p className="text-gray-400 text-sm">{locationConfig.instruction}</p>
                            </div>

                            {/* GPS Status */}
                            {!gpsBypass && (
                                <div className="mb-6">
                                    {gpsError ? (
                                        <p className="text-red-400 text-sm">{gpsError}</p>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-gray-500 text-xs mb-1">
                                                {t('gameEngine.gps.distanceLabel')}
                                            </p>
                                            <p className="text-2xl font-mono text-white">
                                                {userDistance !== null ? `${userDistance}m` : t('gameEngine.gps.calculating')}
                                            </p>
                                            {userDistance !== null && userDistance > 200 && (
                                                <p className="text-yellow-500 text-xs mt-1">
                                                    {t('gameEngine.gps.approach')}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {(gpsBypass || (userDistance !== null && userDistance <= 200)) && (
                                    <Button onClick={handleArrivedAtLocation} className="w-full">
                                        {gpsBypass ? t('gameEngine.gps.imHereGod') : t('gameEngine.map.imHere')}
                                    </Button>
                                )}

                                {locationConfig.googleMapsUrl && (
                                    <a
                                        href={locationConfig.googleMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 py-3 px-4 rounded text-center transition-colors"
                                    >
                                        {t('gameEngine.gps.openMaps')}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <ComputerModal />
                </div>
            );
        }

        // Video View
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
                <h2 className="text-xl md:text-2xl font-serif text-red-500 mb-2">
                    {t('ega98.acts.actLabel', 'ACTO')} {actNumber}: {actTitles[currentStage]}
                </h2>
                <p className="text-gray-400 mb-6">📍 {locationConfig.name}</p>

                <div className="max-w-3xl w-full aspect-video bg-gray-900 border border-red-900/30 rounded-lg overflow-hidden mb-8">
                    <iframe
                        width="100%"
                        height="100%"
                        src={getVideoUrl(currentStage)}
                        title={actTitles[currentStage]}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>

                <Button onClick={advanceToNextStage}>
                    {t('ega98.acts.continue', 'Continuar ►')}
                </Button>
            </div>
        );
    }

    // ========================================
    // RENDER: ACT 6 - THE RUPTURE (Text only)
    // ========================================
    if (currentStage === 'ACT_6') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-lg text-center">
                    <h2 className="text-xl text-red-500 font-serif mb-8">
                        {t('ega98.acts.actLabel', 'ACTO')} VI: {t('ega98.acts.act6.title', 'La Ruptura')}
                    </h2>

                    <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-8 mb-8 text-left font-mono">
                        <p className="text-gray-500 text-sm mb-6">{t('ega98.acts.act6.subtitle', 'DESPUÉS')}</p>

                        <ul className="text-gray-400 space-y-2 mb-8">
                            <li>• {t('ega98.acts.act6.event1', 'Accidente de moto')}</li>
                            <li>• {t('ega98.acts.act6.event2', 'Investigación')}</li>
                            <li>• {t('ega98.acts.act6.event3', 'Miedo')}</li>
                            <li>• {t('ega98.acts.act6.event4', 'Silencio')}</li>
                        </ul>

                        <div className="border-t border-gray-700 pt-6">
                            <p className="text-gray-300 italic">
                                "{t('ega98.acts.act6.quote', 'No recordar nada fue mi mejor coartada.')}"
                            </p>
                            <p className="text-gray-500 text-sm mt-2">- El Capi</p>
                        </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
                        {t('ega98.acts.act6.realization', 'El dinero queda dormido. Intocable. Creciendo sin que nadie lo toque.')}
                    </p>

                    <Button onClick={advanceToNextStage}>
                        {t('ega98.acts.act6.continue', 'El Acceso ►')}
                    </Button>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER: ACCESS PUZZLE
    // ========================================
    if (currentStage === 'ACCESS') {
        return (
            <div className="fixed inset-0 z-50">
                <AccessPuzzle onSolved={advanceToNextStage} />
            </div>
        );
    }

    // ========================================
    // RENDER: FINALE VIDEO
    // ========================================
    if (currentStage === 'FINALE') {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6">
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">
                    {t('ega98.finale.title', 'La Verdad')}
                </h2>
                <p className="text-gray-400 mb-8">
                    {t('ega98.finale.subtitle', 'El testimonio final de El Capi')}
                </p>

                <div className="max-w-3xl w-full aspect-video bg-gray-900 border border-gray-700 rounded-lg overflow-hidden mb-8">
                    <iframe
                        width="100%"
                        height="100%"
                        src={getVideoUrl('FINALE')}
                        title="Final"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>

                <Button onClick={advanceToNextStage}>
                    {t('ega98.finale.continue', 'Ver Epílogo ►')}
                </Button>
            </div>
        );
    }

    // ========================================
    // RENDER: COMPLETE / EPILOGUE
    // ========================================
    if (currentStage === 'COMPLETE') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black z-50 flex flex-col items-center justify-center p-6 overflow-auto">
                <div className="max-w-lg text-center py-12">
                    <div className="text-6xl mb-6">🏁</div>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                        {t('ega98.epilogue.title', 'EPÍLOGO')}
                    </h1>

                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 mb-8 text-left">
                        <p className="text-gray-400 mb-6">
                            {t('ega98.epilogue.intro', 'El jugador no se lleva millones.')}
                        </p>
                        <p className="text-gray-300 mb-4">
                            {t('ega98.epilogue.takeaway', 'Se lleva:')}
                        </p>
                        <ul className="text-white space-y-2 mb-6">
                            <li>• {t('ega98.epilogue.item1', 'La historia completa')}</li>
                            <li>• {t('ega98.epilogue.item2', 'El crimen perfecto')}</li>
                            <li>• {t('ega98.epilogue.item3', 'La ciudad como sistema')}</li>
                            <li>• {t('ega98.epilogue.item4', 'El derecho a contarlo')}</li>
                        </ul>

                        <div className="border-t border-gray-700 pt-6">
                            <p className="text-red-400 font-serif text-lg italic">
                                "{t('ega98.epilogue.finalQuote', 'Navarra deja de ser escenario. Navarra era la clave.')}"
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button onClick={onReset} variant="secondary" className="w-full">
                            {t('ega98.epilogue.playAgain', 'Jugar de Nuevo')}
                        </Button>
                        <button
                            onClick={onExit}
                            className="w-full text-gray-400 hover:text-white py-2 transition-colors"
                        >
                            {t('ega98.epilogue.backToMenu', 'Volver al Menú')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback or Initial Computer stage
    if (currentStage === 'COMPUTER') {
        return <ComputerModal />;
    }

    // Fallback
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <p>Stage not implemented: {currentStage}</p>
        </div>
    );
};

export default EGA98GameEngine;
