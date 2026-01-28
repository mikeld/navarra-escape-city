
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface StairsPuzzleProps {
    onSolved: (val: string) => void;
    onMistake?: () => void;
}

type Stage = 'COUNTING' | 'PIANO' | 'BESTIARY';

const NOTES = [
    { id: 'C', label: 'DO', freq: 261.63, index: 1 },
    { id: 'D', label: 'RE', freq: 293.66, index: 2 },
    { id: 'E', label: 'MI', freq: 329.63, index: 3 },
    { id: 'F', label: 'FA', freq: 349.23, index: 4 },
    { id: 'G', label: 'SOL', freq: 392.00, index: 5 },
    { id: 'A', label: 'LA', freq: 440.00, index: 6 },
    { id: 'B', label: 'SI', freq: 493.88, index: 7 }
];

const TARGET_SEQUENCE = [
    'A', 'A', 'A', 'A', 'A', 'A',
    'G', 'G', 'G', 'G', 'G',
    'B'
];

interface Beast {
    id: string;
    label: string;
    icon: string;
}

const BEAST_DATA: Omit<Beast, 'label'>[] = [
    { id: 'HARPY', icon: '🦅👩' },
    { id: 'CENTAUR', icon: '🏹🐎' },
    { id: 'LION', icon: '🦁' },
    { id: 'SIREN', icon: '🧜‍♀️' },
    { id: 'DRAGON', icon: '🐉' },
    { id: 'EAGLE', icon: '🦅' },
    { id: 'GRIFFIN', icon: '🦁🦅' },
    { id: 'BASILISK', icon: '🐍' },
    { id: 'PELICAN', icon: '🐦' },
    { id: 'UNICORN', icon: '🦄' },
    { id: 'HYDRA', icon: '🐍🐍' },
    { id: 'BEAR', icon: '🐻' },
];

const RIDDLES = [
    { id: 0, title: 'EL CAZADOR', desc: 'Su torso es humano y tensa el arco, pero sus cascos golpean la roca.', correct: 'CENTAUR' },
    { id: 1, title: 'LA TENTACIÓN', desc: 'Sujeta sus dos colas con las manos. Muestra su doble naturaleza marina.', correct: 'SIREN' },
    { id: 2, title: 'EL GUARDIÁN', desc: 'Une la realeza de la tierra y el cielo. Cuatro patas pisan, un pico desgarra.', correct: 'GRIFFIN' }
];

const StairsPuzzle: React.FC<StairsPuzzleProps> = ({ onSolved, onMistake }) => {
    const { t } = useTranslation();
    const beastOptions = BEAST_DATA.map(b => ({
        ...b,
        label: t(`puzzleComponents.stairs.beasts.${b.id}`)
    }));
    const [stage, setStage] = useState<Stage>('COUNTING');

    const [stepsCount, setStepsCount] = useState('');
    const [flightsCount, setFlightsCount] = useState('');
    const [countError, setCountError] = useState(false);

    const [userSequence, setUserSequence] = useState<string[]>([]);
    const [pianoError, setPianoError] = useState(false);

    const [selectedBeasts, setSelectedBeasts] = useState<(string | null)[]>([null, null, null]);
    const [activeSlot, setActiveSlot] = useState<number>(0);
    const [bestiaryError, setBestiaryError] = useState(false);

    const audioCtxRef = useRef<AudioContext | null>(null);

    const playTone = (freq: number) => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    };

    const handleCheckCounts = () => {
        if (stepsCount === '68' && flightsCount === '12') {
            setCountError(false);
            setStage('PIANO');
        } else {
            if (onMistake) onMistake();
            setCountError(true);
            setTimeout(() => setCountError(false), 2000);
        }
    };

    const handleNoteClick = (noteId: string, freq: number) => {
        playTone(freq);
        setPianoError(false);

        const newSeq = [...userSequence, noteId];
        setUserSequence(newSeq);

        const currentIndex = newSeq.length - 1;
        if (newSeq[currentIndex] !== TARGET_SEQUENCE[currentIndex]) {
            if (onMistake) onMistake();
            setPianoError(true);
            setTimeout(() => setUserSequence([]), 1000);
            return;
        }

        if (newSeq.length === TARGET_SEQUENCE.length) {
            setTimeout(() => setStage('BESTIARY'), 1000);
        }
    };

    const handleBeastSelect = (beastId: string) => {
        const newSelections = [...selectedBeasts];
        newSelections[activeSlot] = beastId;
        setSelectedBeasts(newSelections);

        if (activeSlot < 2) {
            setActiveSlot(activeSlot + 1);
        }
        setBestiaryError(false);
    };

    const handleBestiarySubmit = () => {
        // Validation: CENTAUR, SIREN, GRIFFIN in order
        if (
            selectedBeasts[0] === 'CENTAUR' &&
            selectedBeasts[1] === 'SIREN' &&
            selectedBeasts[2] === 'GRIFFIN'
        ) {
            onSolved('BESTIARY_SOLVED');
        } else {
            if (onMistake) onMistake();
            setBestiaryError(true);
            setTimeout(() => setBestiaryError(false), 2500);
        }
    };

    if (stage === 'COUNTING') {
        return (
            <div className="space-y-6 animate-fade-in text-center">
                <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-4">
                    {t('puzzleComponents.stairs.stage1')}
                </h4>
                <p className="text-sm text-gray-400 italic mb-4">
                    "{t('puzzleComponents.stairs.instr1')}"
                </p>

                <div className="space-y-6 max-w-xs mx-auto">
                    <div className="bg-navarra-panel p-4 rounded border border-navarra-gold/30">
                        <label className="block text-xs uppercase text-navarra-gold mb-2 font-bold tracking-wider">
                            {t('puzzleComponents.stairs.countSteps')}
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={stepsCount}
                            onChange={(e) => setStepsCount(e.target.value)}
                            className={`w-full bg-black text-white text-center text-2xl p-3 rounded border-2 focus:outline-none focus:border-navarra-gold font-serif placeholder-gray-700 ${countError ? 'border-red-500' : 'border-navarra-stone'}`}
                        />
                    </div>
                    <div className="bg-navarra-panel p-4 rounded border border-navarra-gold/30">
                        <label className="block text-xs uppercase text-navarra-gold mb-2 font-bold tracking-wider">
                            {t('puzzleComponents.stairs.countFlights')}
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            value={flightsCount}
                            onChange={(e) => setFlightsCount(e.target.value)}
                            className={`w-full bg-black text-white text-center text-2xl p-3 rounded border-2 focus:outline-none focus:border-navarra-gold font-serif placeholder-gray-700 ${countError ? 'border-red-500' : 'border-navarra-stone'}`}
                        />
                    </div>
                </div>

                {countError && <p className="text-red-400 text-xs animate-pulse bg-red-900/20 p-2 rounded">{t('puzzleComponents.stairs.errorArch')}</p>}

                <Button onClick={handleCheckCounts} className="w-full">
                    {t('puzzleComponents.stairs.validateArch')}
                </Button>
            </div>
        );
    }

    if (stage === 'PIANO') {
        return (
            <div className="space-y-6 animate-fade-in text-center">
                <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm mb-2">
                    {t('puzzleComponents.stairs.stage2')}
                </h4>

                <div className="text-sm text-gray-300 italic mb-4 px-6 py-4 bg-black/40 rounded border-l-4 border-navarra-gold/50 text-left leading-relaxed">
                    <p className="mb-2">"{t('puzzleComponents.stairs.instr2_1')}"</p>
                    <p className="mb-2">"{t('puzzleComponents.stairs.instr2_2')}"</p>
                    <p className="text-navarra-gold font-bold">"{t('puzzleComponents.stairs.instr2_3')}"</p>
                </div>

                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-6">
                    <div
                        className={`h-full transition-all duration-300 ${pianoError ? 'bg-red-500' : 'bg-navarra-gold'}`}
                        style={{ width: `${(userSequence.length / TARGET_SEQUENCE.length) * 100}%` }}
                    ></div>
                </div>

                <div className="flex justify-center gap-1 sm:gap-2 select-none">
                    {NOTES.map((note) => (
                        <button
                            key={note.id}
                            onClick={() => handleNoteClick(note.id, note.freq)}
                            className={`
                            h-32 w-10 sm:w-12 rounded-b-md flex flex-col justify-end items-center pb-2 text-xs font-bold transition-all active:scale-95 active:bg-navarra-gold/80 relative
                            bg-white text-black border-b-4 border-gray-400 shadow-lg
                        `}
                        >
                            <span className="absolute top-2 text-[10px] text-gray-400">{note.index}</span>
                            {note.label}
                        </button>
                    ))}
                </div>

                {pianoError && (
                    <p className="text-red-400 text-xs mt-4 animate-pulse font-bold">{t('puzzleComponents.stairs.errorMelody')}</p>
                )}

                <div className="mt-4">
                    <button onClick={() => setUserSequence([])} className="text-xs text-gray-500 uppercase tracking-wider hover:text-white transition-colors">{t('puzzleComponents.stairs.resetMelody')}</button>
                </div>
            </div>
        );
    }

    if (stage === 'BESTIARY') {
        return (
            <div className="space-y-6 animate-fade-in">
                <h4 className="text-navarra-gold font-serif uppercase tracking-widest text-sm text-center mb-4">
                    {t('puzzleComponents.stairs.stage3')}
                </h4>
                <div className="bg-navarra-panel border-l-4 border-navarra-crimson p-4 text-left text-sm text-gray-300 italic mb-4">
                    <p className="font-bold text-navarra-gold not-italic mb-2 text-center">{t('puzzleComponents.stairs.instr3_title')}</p>
                    <p>{t('puzzleComponents.stairs.instr3_1')}</p>
                    <p className="mt-1 text-white font-bold">{t('puzzleComponents.stairs.instr3_2')}</p>
                </div>


                <div className="grid gap-2 mb-6">
                    {[
                        { id: 0, titleKey: 'r1_title', descKey: 'r1_desc', correct: 'CENTAUR' },
                        { id: 1, titleKey: 'r2_title', descKey: 'r2_desc', correct: 'SIREN' },
                        { id: 2, titleKey: 'r3_title', descKey: 'r3_desc', correct: 'GRIFFIN' }
                    ].map((riddle, idx) => {
                        const filledBeast = beastOptions.find(b => b.id === selectedBeasts[idx]);
                        const isActive = activeSlot === idx;

                        return (
                            <div
                                key={riddle.id}
                                onClick={() => setActiveSlot(idx)}
                                className={`p-3 rounded border-2 transition-all cursor-pointer relative overflow-hidden
                                ${isActive ? 'border-navarra-gold bg-navarra-gold/10' : 'border-navarra-stone bg-black/40'}
                            `}
                            >
                                <p className="text-[10px] uppercase font-bold text-navarra-gold mb-1">{idx + 1}. {t(`puzzleComponents.stairs.riddles.${riddle.titleKey}`)}</p>
                                <p className="text-xs text-gray-300 leading-tight mb-2">{t(`puzzleComponents.stairs.riddles.${riddle.descKey}`)}</p>

                                <div className="flex items-center justify-end">
                                    {filledBeast ? (
                                        <div className="flex items-center gap-2 bg-navarra-stone px-3 py-1 rounded text-navarra-parchment font-bold text-sm shadow-sm border border-navarra-gold/30">
                                            <span>{filledBeast.icon}</span>
                                            <span>{filledBeast.label}</span>
                                        </div>
                                    ) : (
                                        <div className="text-xs text-gray-600 italic border border-dashed border-gray-600 px-3 py-1 rounded">
                                            {t('puzzleComponents.common.select')}...
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-4 gap-2">
                    {beastOptions.map((beast) => (
                        <button
                            key={beast.id}
                            onClick={() => handleBeastSelect(beast.id)}
                            className={`aspect-square rounded border border-navarra-stone bg-navarra-panel hover:bg-navarra-stone hover:border-navarra-gold transition-all flex flex-col items-center justify-center gap-1 active:scale-95`}
                        >
                            <span className="text-2xl">{beast.icon}</span>
                            <span className="text-[9px] uppercase font-bold text-gray-400">{beast.label}</span>
                        </button>
                    ))}
                </div>

                {bestiaryError && (
                    <div className="p-3 bg-red-900/30 border border-red-500/50 rounded animate-pulse text-center">
                        <p className="text-red-300 text-xs font-bold">{t('puzzleComponents.stairs.errorBeast')}</p>
                    </div>
                )}

                <Button
                    onClick={handleBestiarySubmit}
                    disabled={selectedBeasts.includes(null)}
                    className="w-full mt-4"
                >
                    {t('puzzleComponents.stairs.validateBeast')}
                </Button>
            </div>
        );
    }

    return null;
};

export default StairsPuzzle;
