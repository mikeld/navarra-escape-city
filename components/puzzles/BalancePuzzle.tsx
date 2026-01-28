
import React, { useState, useEffect } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface BalancePuzzleProps {
    onSolved: (val: string) => void;
    onMistake?: () => void;
}

interface Item {
    id: string;
    labelKey: string;
    weight: number;
}

// Configuración del Juego de la Balanza (Harder Math)
// Target: 165 kg (Soberbia, Avaricia, Envidia, etc. symbolically heavy)
const DEMON_WEIGHT = 165;

// Pool de 12 Virtudes con pesos específicos.
// Solución Única (4 items): Humildad(55) + Caridad(48) + Paciencia(37) + Templanza(25) = 165
const VIRTUES_POOL: Item[] = [
    { id: 'humildad', labelKey: 'humildad', weight: 55 },    // Correct
    { id: 'caridad', labelKey: 'caridad', weight: 48 },      // Correct
    { id: 'paciencia', labelKey: 'paciencia', weight: 37 },  // Correct
    { id: 'templanza', labelKey: 'templanza', weight: 25 },  // Correct
    { id: 'generosidad', labelKey: 'generosidad', weight: 50 }, // Distractor
    { id: 'diligencia', labelKey: 'diligencia', weight: 30 },   // Distractor
    { id: 'castidad', labelKey: 'castidad', weight: 15 },       // Distractor
    { id: 'fe', labelKey: 'fe', weight: 40 },                   // Distractor
    { id: 'esperanza', labelKey: 'esperanza', weight: 10 },     // Distractor
    { id: 'justicia', labelKey: 'justicia', weight: 60 },       // Distractor
    { id: 'fortaleza', labelKey: 'fortaleza', weight: 20 },     // Distractor
    { id: 'obediencia', labelKey: 'obediencia', weight: 5 },    // Distractor
];

// Opciones para la Fase 1
const IDENTITY_OPTIONS = [
    { id: 'CHRIST', key: 'christ' },
    { id: 'MICHAEL', key: 'michael' },
    { id: 'DEMON', key: 'demon' },
    { id: 'ABRAHAM', key: 'abraham' },
    { id: 'PETER', key: 'peter' },
    { id: 'MARY', key: 'mary' },
    { id: 'KING', key: 'king' },
    { id: 'BISHOP', key: 'bishop' },
];

type IdentifyRole = 'JUDGE' | 'WEIGHER' | 'CHEATER';

const BalancePuzzle: React.FC<BalancePuzzleProps> = ({ onSolved, onMistake }) => {
    const { t } = useTranslation();
    const [stage, setStage] = useState<'INTRO' | 'IDENTIFY' | 'WEIGH'>('INTRO');

    // -- STAGE 1: IDENTIFICATION --
    const [roles, setRoles] = useState<Record<IdentifyRole, string | null>>({
        JUDGE: null,
        WEIGHER: null,
        CHEATER: null
    });
    const [activeSelector, setActiveSelector] = useState<IdentifyRole | null>(null);
    const [identifyFeedback, setIdentifyFeedback] = useState<string | null>(null);

    const handleIdentitySelect = (optionId: string) => {
        if (!activeSelector) return;
        setRoles(prev => ({ ...prev, [activeSelector]: optionId }));
        setActiveSelector(null);
        setIdentifyFeedback(null);
    };

    const checkIdentification = () => {
        // Logic: Left = Christ, Center = Michael, Right = Demon
        if (roles.JUDGE === 'CHRIST' && roles.WEIGHER === 'MICHAEL' && roles.CHEATER === 'DEMON') {
            setIdentifyFeedback('CORRECT');
            setTimeout(() => setStage('WEIGH'), 1500);
        } else {
            if (onMistake) onMistake();
            setIdentifyFeedback('ERROR');
            setTimeout(() => setIdentifyFeedback(null), 2500);
        }
    };

    // -- STAGE 2: WEIGHING GAME --
    const [rightPan, setRightPan] = useState<Item[]>([]);
    const [inventory, setInventory] = useState<Item[]>(VIRTUES_POOL);
    const [tilt, setTilt] = useState(-30); // Starts tilted to demon side
    const [gameFeedback, setGameFeedback] = useState<string | null>(null);

    const angelWeight = rightPan.reduce((acc, a) => acc + a.weight, 0);

    // Calculate Visual Tilt
    useEffect(() => {
        const diff = angelWeight - DEMON_WEIGHT;
        // Scale visual tilt: -45 (Demon heavy) to +45 (Angel heavy). 0 is balanced.
        let newTilt = Math.max(-45, Math.min(45, diff * 0.5));
        if (diff === 0) newTilt = 0;
        setTilt(newTilt);
    }, [angelWeight]);

    const addToPan = (item: Item) => {
        if (rightPan.length >= 4) return; // Limit to 4 slots as per puzzle logic
        setInventory(prev => prev.filter(i => i.id !== item.id));
        setRightPan(prev => [...prev, item]);
        setGameFeedback(null);
    };

    const removeFromPan = (item: Item) => {
        setRightPan(prev => prev.filter(i => i.id !== item.id));
        setInventory(prev => [...prev, item]);
        setGameFeedback(null);
    };

    const handleWeighCheck = () => {
        if (rightPan.length !== 4) {
            setGameFeedback(t('puzzleComponents.balance.feedbackMustChoose4'));
            setTimeout(() => setGameFeedback(null), 3000);
            return;
        }

        if (angelWeight === DEMON_WEIGHT) {
            onSolved('BALANCED');
        } else {
            if (onMistake) onMistake();

            if (angelWeight < DEMON_WEIGHT) {
                setGameFeedback(`${t('puzzleComponents.balance.feedbackLight')} (${angelWeight} kg)`);
            } else {
                setGameFeedback(`${t('puzzleComponents.balance.feedbackHeavy')} (${angelWeight} kg)`);
            }

            setTimeout(() => setGameFeedback(null), 4000);
        }
    };

    // RENDER: INTRO (DETECTION) STAGE
    if (stage === 'INTRO') {
        return (
            <div className="space-y-6 animate-fade-in text-center select-none">
                <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-4">
                    {t('puzzleComponents.balance.introTitle')}
                </h4>

                <div className="bg-navarra-panel border-l-4 border-navarra-gold p-6 text-left shadow-lg">
                    <p className="text-white text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {t('puzzleComponents.balance.introText')}
                    </p>
                </div>

                <div className="py-4">
                    <p className="text-gray-400 text-xs italic">
                        "{t('puzzleComponents.balance.searchHint')}"
                    </p>
                </div>

                <Button onClick={() => setStage('IDENTIFY')} className="w-full">
                    {t('puzzleComponents.balance.btnFound')}
                </Button>
            </div>
        );
    }

    // RENDER: IDENTIFICATION STAGE
    if (stage === 'IDENTIFY') {
        return (
            <div className="space-y-6 animate-fade-in text-center select-none">
                <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-4">
                    {t('puzzleComponents.balance.identifyTitle')}
                </h4>
                <p className="text-sm text-gray-300 italic mb-6">
                    {t('puzzleComponents.balance.identifyDesc')}
                </p>

                {/* Selector Slots */}
                <div className="flex flex-col gap-4">
                    {[
                        { role: 'JUDGE', label: t('puzzleComponents.balance.roleJudge') }, // Izquierda
                        { role: 'WEIGHER', label: t('puzzleComponents.balance.roleWeigher') }, // Centro
                        { role: 'CHEATER', label: t('puzzleComponents.balance.roleCheater') } // Derecha
                    ].map((slot) => {
                        const selectedId = roles[slot.role as IdentifyRole];
                        const selectedOption = IDENTITY_OPTIONS.find(o => o.id === selectedId);

                        return (
                            <button
                                key={slot.role}
                                onClick={() => setActiveSelector(slot.role as IdentifyRole)}
                                className={`p-4 border-2 rounded-lg transition-all flex items-center justify-between group
                                ${activeSelector === slot.role ? 'border-navarra-gold bg-navarra-gold/20' : 'border-navarra-stone bg-black/40 hover:border-navarra-gold/50'}
                            `}
                            >
                                <div className="text-left">
                                    <span className="text-[10px] uppercase font-bold text-gray-500 block mb-1">{slot.label}</span>
                                    <span className={`text-lg font-serif font-bold ${selectedOption ? 'text-white' : 'text-navarra-gold/50'}`}>
                                        {selectedOption ? t(`puzzleComponents.balance.options.${selectedOption.key}`) : '???'}
                                    </span>
                                </div>
                                <span className="text-navarra-gold text-xl group-hover:scale-110 transition-transform">
                                    {selectedOption ? '✓' : '+'}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Options Grid (Modal-like inline) */}
                {activeSelector && (
                    <div className="mt-4 p-4 bg-navarra-panel border border-navarra-gold/30 rounded animate-slide-up">
                        <p className="text-xs text-center text-gray-400 mb-3 uppercase tracking-widest">{t('puzzleComponents.balance.selectFigure')}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {IDENTITY_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => handleIdentitySelect(opt.id)}
                                    className="p-2 bg-black/40 border border-gray-700 rounded text-xs font-bold text-gray-300 hover:bg-navarra-gold/20 hover:border-navarra-gold hover:text-white transition-colors"
                                >
                                    {t(`puzzleComponents.balance.options.${opt.key}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {identifyFeedback === 'ERROR' && <p className="text-red-400 text-xs font-bold animate-pulse mt-4 bg-red-900/20 p-2 rounded">{t('puzzleComponents.common.error')}</p>}
                {identifyFeedback === 'CORRECT' && <p className="text-green-400 text-xs font-bold animate-pulse mt-4">{t('puzzleComponents.common.success')}</p>}

                <Button
                    onClick={checkIdentification}
                    disabled={!roles.JUDGE || !roles.WEIGHER || !roles.CHEATER}
                    className="w-full mt-4"
                >
                    {t('puzzleComponents.common.validate')}
                </Button>
            </div>
        );
    }

    // RENDER: WEIGHING GAME STAGE
    return (
        <div className="space-y-6 animate-fade-in select-none">
            <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm text-center">
                {t('puzzleComponents.balance.gameTitle')}
            </h4>

            <div className="bg-navarra-panel border-l-4 border-navarra-crimson p-3 text-xs text-gray-300 italic mb-2 leading-relaxed">
                {t('puzzleComponents.balance.gameDesc')}
            </div>

            {/* Visual Balance */}
            <div className="relative h-48 w-full flex items-center justify-center mb-8 mt-8">
                {/* Base */}
                <div className="absolute bottom-0 w-4 h-32 bg-gray-700 rounded-t-lg"></div>
                <div className="absolute bottom-0 w-32 h-4 bg-gray-800 rounded-full shadow-lg"></div>

                {/* Arm */}
                <div
                    className="absolute top-16 w-full max-w-[280px] h-2 bg-navarra-gold border border-yellow-900 transition-transform duration-1000 ease-out origin-center flex justify-between items-center z-10"
                    style={{ transform: `rotate(${tilt}deg)` }}
                >
                    {/* Left Pan (Demon) */}
                    <div className="relative flex flex-col items-center">
                        <div className="h-20 w-0.5 bg-navarra-gold/50"></div>
                        <div className="w-20 h-20 rounded-full border-4 border-red-900 bg-black/90 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] relative">
                            <span className="text-3xl filter drop-shadow-lg">👹</span>
                            <span className="text-[10px] font-bold text-red-500 mt-1">{DEMON_WEIGHT}kg</span>
                        </div>
                    </div>

                    {/* Pivot */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-navarra-gold rounded-full border-4 border-black z-20 shadow-md"></div>

                    {/* Right Pan (Player) */}
                    <div className="relative flex flex-col items-center">
                        <div className="h-20 w-0.5 bg-navarra-gold/50"></div>
                        <div className="w-20 h-20 rounded-full border-4 border-navarra-gold bg-black/90 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500">
                            <span className="text-3xl filter drop-shadow-lg">🪽</span>
                            <span className="text-[10px] font-bold text-navarra-gold mt-1">{angelWeight}kg</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Inventory */}
                <div className="bg-black/40 p-3 rounded border border-gray-700 min-h-[180px]">
                    <p className="text-[10px] uppercase text-gray-500 mb-2 font-bold text-center border-b border-gray-700 pb-1">
                        {t('puzzleComponents.balance.inventory')}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center content-start">
                        {inventory.map(item => (
                            <button
                                key={item.id}
                                onClick={() => addToPan(item)}
                                className="bg-navarra-stone text-navarra-parchment text-[10px] font-bold px-2 py-1 rounded border border-gray-600 hover:border-navarra-gold hover:text-white transition-colors"
                            >
                                {t(`puzzleComponents.balance.virtues.${item.labelKey}`)} ({item.weight})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pan */}
                <div className="bg-navarra-gold/5 p-3 rounded border border-navarra-gold/30 min-h-[180px]">
                    <p className="text-[10px] uppercase text-navarra-gold mb-2 font-bold text-center border-b border-navarra-gold/20 pb-1">
                        {t('puzzleComponents.balance.pan')}
                    </p>
                    <div className="flex flex-col gap-1">
                        {rightPan.map(item => (
                            <button
                                key={item.id}
                                onClick={() => removeFromPan(item)}
                                className="flex justify-between items-center bg-navarra-gold/10 text-navarra-gold text-[10px] px-2 py-1 rounded border border-navarra-gold/20 hover:bg-red-900/30 hover:border-red-500 transition-colors"
                            >
                                <span>{t(`puzzleComponents.balance.virtues.${item.labelKey}`)}</span>
                                <span className="font-bold">{item.weight}</span>
                            </button>
                        ))}
                        {rightPan.length === 0 && <p className="text-gray-600 text-[10px] text-center italic mt-4">{t('puzzleComponents.balance.empty')}</p>}
                    </div>
                </div>
            </div>

            {gameFeedback && (
                <div className={`p-3 text-center rounded border animate-pulse text-xs font-bold uppercase tracking-wide
              ${gameFeedback.includes('INSUFICIENTE') ? 'bg-blue-900/40 border-blue-500 text-blue-200' :
                        gameFeedback.includes('DEMASIADO') ? 'bg-orange-900/40 border-orange-500 text-orange-200' :
                            'bg-red-900/40 border-red-500 text-red-200'}
          `}>
                    {gameFeedback}
                </div>
            )}

            <Button
                onClick={handleWeighCheck}
                className="w-full py-4 text-lg shadow-xl"
            >
                {t('puzzleComponents.balance.btn')}
            </Button>
        </div>
    );
};

export default BalancePuzzle;
