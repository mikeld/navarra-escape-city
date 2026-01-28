import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StationCountingPuzzleProps {
    onSolved: () => void;
    onExit: () => void;
    onOpenComputer?: () => void;
}

const StationCountingPuzzle: React.FC<StationCountingPuzzleProps> = ({ onSolved, onExit, onOpenComputer }) => {
    const { t } = useTranslation();

    // Correct answers
    const COUNTS = {
        windows: 168,
        doors: 24,
        clocks: 1,
        chimneys: 1
    };

    // Calculate final code: (Windows * Clocks) - (Doors * Chimneys)
    // (168 * 1) - (24 * 1) = 144
    const FINAL_CODE = (COUNTS.windows * COUNTS.clocks) - (COUNTS.doors * COUNTS.chimneys);

    const [phase, setPhase] = useState<'counting' | 'solving'>('counting');

    const [inputs, setInputs] = useState({
        windows: '',
        doors: '',
        clocks: '',
        chimneys: ''
    });

    const [finalInput, setFinalInput] = useState('');
    const [shake, setShake] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleInputChange = (field: keyof typeof inputs, value: string) => {
        if (/^\d*$/.test(value)) {
            setInputs(prev => ({ ...prev, [field]: value }));
        }
    };

    const handlePhase1Submit = (e: React.FormEvent) => {
        e.preventDefault();

        const isCorrect =
            parseInt(inputs.windows) === COUNTS.windows &&
            parseInt(inputs.doors) === COUNTS.doors &&
            parseInt(inputs.clocks) === COUNTS.clocks &&
            parseInt(inputs.chimneys) === COUNTS.chimneys;

        if (isCorrect) {
            setPhase('solving');
            setShowError(false);
        } else {
            triggerError();
        }
    };

    const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (parseInt(finalInput) === FINAL_CODE) {
            onSolved();
        } else {
            triggerError();
        }
    };

    const triggerError = () => {
        setShake(true);
        setShowError(true);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => setShowError(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-black z-50 overflow-y-auto">
            <div className="min-h-screen flex flex-col items-center justify-center p-4 font-mono relative">

                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-red-500/30 shadow-lg z-10">
                    <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                        <span>←</span>
                        <span>{t('common.back', 'Volver')}</span>
                    </button>
                    <div className="text-lg md:text-xl font-bold text-red-400 tracking-widest hidden sm:block">
                        {t('ega98.stationPuzzle.title', 'ENIGMA DE LA ESTACIÓN')}
                    </div>
                    <div className="flex items-center gap-2">
                        {onOpenComputer && (
                            <button
                                onClick={onOpenComputer}
                                className="
                                    w-10 h-10 bg-[#008080] hover:bg-[#009090] 
                                    border-2 border-[#00b0b0] rounded-lg 
                                    flex items-center justify-center 
                                    shadow-lg transition-all duration-300
                                    hover:scale-110 hover:shadow-[0_0_20px_rgba(0,200,200,0.5)]
                                "
                                title={t('ega98.computer.openComputer', 'Ordenador del Capi')}
                            >
                                <span className="text-xl">💻</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-2xl mt-20 mb-10 flex flex-col gap-8">

                    {/* Phase 1: Counting */}
                    {phase === 'counting' && (
                        <div className={`transition-opacity duration-500 ${shake ? 'animate-shake' : ''}`}>
                            <div className="bg-red-900/10 border border-red-500/30 p-6 rounded text-center mb-8">
                                <p className="text-gray-300 mb-2 text-lg">
                                    {t('ega98.stationPuzzle.instruction', 'Primero, demuestra que has observado bien la estación.')}
                                </p>
                                <p className="text-red-400 text-sm italic">
                                    {t('ega98.stationPuzzle.hint', 'Cuenta con precisión. Los números son la llave.')}
                                </p>
                            </div>

                            <form onSubmit={handlePhase1Submit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { id: 'windows', icon: '🪟', label: t('ega98.stationPuzzle.windows') },
                                        { id: 'doors', icon: '🚪', label: t('ega98.stationPuzzle.doors') },
                                        { id: 'clocks', icon: '🕐', label: t('ega98.stationPuzzle.clocks') },
                                        { id: 'chimneys', icon: '🏠', label: t('ega98.stationPuzzle.chimneys') }
                                    ].map((item) => (
                                        <div key={item.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center gap-4">
                                            <span className="text-4xl">{item.icon}</span>
                                            <div className="flex-1">
                                                <label className="text-gray-400 text-sm block mb-1">{item.label}</label>
                                                <input
                                                    type="text"
                                                    value={inputs[item.id as keyof typeof inputs]}
                                                    onChange={(e) => handleInputChange(item.id as keyof typeof inputs, e.target.value)}
                                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-center text-xl focus:border-red-500 outline-none transition-colors"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-4 px-8 rounded transition-all transform hover:scale-[1.02] shadow-lg shadow-red-900/20 mt-8"
                                >
                                    {t('ega98.stationPuzzle.verify', 'VERIFICAR CONTEO')}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Phase 2: Solving */}
                    {phase === 'solving' && (
                        <div className="animate-fade-in space-y-8">
                            <div className="bg-green-900/20 border border-green-500/30 p-4 rounded text-center">
                                <span className="text-green-400 font-bold">✓ CONTEO VERIFICADO</span>
                            </div>

                            <div className="bg-black/80 border-2 border-red-500/50 p-8 rounded-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>

                                <h2 className="text-2xl font-bold text-red-500 mb-6 text-center tracking-widest">
                                    {t('ega98.stationPuzzle.riddleTitle', 'FASE 2: EL CÓDIGO')}
                                </h2>

                                <div className="text-center space-y-6 mb-8">
                                    <p className="text-xl text-gray-200 font-serif italic leading-relaxed">
                                        "{t('ega98.stationPuzzle.riddle')}"
                                    </p>
                                    <p className="text-sm text-gray-500 font-mono">
                                        {t('ega98.stationPuzzle.riddleFormulaHint')}
                                    </p>
                                </div>

                                <form onSubmit={handleFinalSubmit} className="max-w-xs mx-auto space-y-6">
                                    <div>
                                        <label className="text-red-400 text-xs uppercase tracking-widest block text-center mb-2">
                                            {t('ega98.stationPuzzle.finalCodeLabel')}
                                        </label>
                                        <input
                                            type="text"
                                            value={finalInput}
                                            onChange={(e) => {
                                                if (/^\d*$/.test(e.target.value)) setFinalInput(e.target.value);
                                            }}
                                            className="w-full bg-black border-2 border-red-900 focus:border-red-500 text-white text-4xl text-center p-4 rounded font-mono tracking-[0.5em] outline-none transition-colors shadow-inner"
                                            placeholder="___"
                                            maxLength={3}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className={`w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded transition-all transform ${shake ? 'animate-shake bg-red-800' : ''}`}
                                    >
                                        {t('ega98.stationPuzzle.unlock', 'DESBLOQUEAR')}
                                    </button>
                                </form>
                            </div>

                            {/* Reference Numbers (Optional assistance) */}
                            <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-600 opacity-50">
                                <div>🪟 {inputs.windows}</div>
                                <div>🚪 {inputs.doors}</div>
                                <div>🕐 {inputs.clocks}</div>
                                <div>🏠 {inputs.chimneys}</div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {showError && (
                        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg animate-bounce font-bold z-50">
                            {t('common.error', 'INCORRECTO')}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default StationCountingPuzzle;
