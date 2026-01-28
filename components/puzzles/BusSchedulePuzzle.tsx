import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface BusSchedulePuzzleProps {
    onSolved: () => void;
    onExit: () => void;
    onOpenComputer?: () => void;
}

const BusSchedulePuzzle: React.FC<BusSchedulePuzzleProps> = ({ onSolved, onExit, onOpenComputer }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(0); // 0: Mendavia, 1: Pamplona, 2: Logroño
    const [error, setError] = useState(false);
    const [timeInput, setTimeInput] = useState({ hours: '', minutes: '' });

    // Question configurations
    const questions = [
        {
            id: 'mendavia',
            text: t('ega98.busPuzzle.q1', 'Estamos en el año 1998, es martes y quiero ir a Mendavia. ¿A qué hora cojo el autobús?'),
            answer: '17:30'
        },
        {
            id: 'pamplona',
            text: t('ega98.busPuzzle.q2', 'Quiero ir a Pamplona, es un día laborable y son las 15:08. ¿A qué hora puedo coger el próximo autobús?'),
            answer: '17:30'
        },
        {
            id: 'logrono',
            text: t('ega98.busPuzzle.q3', '¿Cuál es el último autobús que puedo coger para ir a Logroño?'),
            answer: '20:30'
        }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Format input to HH:MM
        const hours = timeInput.hours.padStart(2, '0');
        const minutes = timeInput.minutes.padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        if (formattedTime === questions[step].answer) {
            // Correct
            setError(false);
            setTimeInput({ hours: '', minutes: '' });

            if (step < questions.length - 1) {
                setStep(prev => prev + 1);
            } else {
                onSolved();
            }
        } else {
            // Incorrect
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    const handleInputChange = (field: 'hours' | 'minutes', value: string) => {
        // Only allow numbers, max 2 chars
        if (/^\d{0,2}$/.test(value)) {
            // Validate ranges
            if (field === 'hours' && parseInt(value) > 23) return;
            if (field === 'minutes' && parseInt(value) > 59) return;

            setTimeInput(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-start pt-28 p-4 font-mono text-green-500 overflow-y-auto">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-green-500/30 shadow-lg">
                <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                    <span>←</span>
                    <span>{t('common.back', 'Volver')}</span>
                </button>
                <div className="text-lg md:text-xl font-bold tracking-widest text-green-400">
                    ESTACIÓN DE AUTOBUSES 1998
                </div>
                <div className="flex items-center gap-2">
                    {onOpenComputer && (
                        <button
                            onClick={onOpenComputer}
                            className={`
                                w-10 h-10 bg-[#008080] hover:bg-[#009090] 
                                border-2 border-[#00b0b0] rounded-lg 
                                flex items-center justify-center 
                                shadow-lg transition-all duration-300
                                hover:scale-110 hover:shadow-[0_0_20px_rgba(0,200,200,0.5)]
                                ${step === 0 ? 'animate-pulse ring-2 ring-yellow-400 ring-offset-2 ring-offset-gray-900' : ''}
                            `}
                            title={t('ega98.computer.openComputer', 'Ordenador del Capi')}
                        >
                            <span className="text-xl">💻</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl w-full flex flex-col items-center gap-8">

                {/* Introduction Text (Only on step 0) */}
                {step === 0 && (
                    <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border-2 border-green-500/50 p-5 rounded-lg text-center mb-4 shadow-lg">
                        <p className="text-green-200 text-base md:text-lg flex items-center justify-center gap-2 flex-wrap">
                            <span className="text-2xl">💡</span>
                            <span>{t('ega98.busPuzzle.intro', 'Ayuda a los pasajeros a llegar a su destino. Consulta la CALLE MAYOR en el ordenador del Capi para ver los horarios de 1998.')}</span>
                        </p>
                    </div>
                )}

                {/* Progress Indicators */}
                <div className="flex gap-2 mb-4">
                    {questions.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${idx === step ? 'bg-green-500' : idx < step ? 'bg-green-800' : 'bg-gray-700'}`}
                        />
                    ))}
                </div>

                {/* Question */}
                <div className="text-center text-xl md:text-2xl text-white font-serif italic max-w-lg leading-relaxed">
                    "{questions[step].text}"
                </div>

                {/* Digital Clock Input */}
                <div className="bg-black border-4 border-gray-700 rounded-lg p-6 shadow-[0_0_30px_rgba(0,128,0,0.3)] transform hover:scale-105 transition-transform duration-300">
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
                        <div className="flex items-center gap-2">
                            {/* Hours */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={timeInput.hours}
                                    onChange={(e) => handleInputChange('hours', e.target.value)}
                                    placeholder="--"
                                    className="w-24 h-24 bg-gray-900 text-green-500 text-6xl text-center font-mono border-2 border-green-900 rounded focus:border-green-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,0,0.5)] placeholder-green-900"
                                    maxLength={2}
                                    autoFocus
                                />
                                <div className="text-center text-xs text-gray-500 mt-1">HH</div>
                            </div>

                            <span className="text-6xl text-green-500 animate-pulse pb-6">:</span>

                            {/* Minutes */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={timeInput.minutes}
                                    onChange={(e) => handleInputChange('minutes', e.target.value)}
                                    placeholder="--"
                                    className="w-24 h-24 bg-gray-900 text-green-500 text-6xl text-center font-mono border-2 border-green-900 rounded focus:border-green-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,0,0.5)] placeholder-green-900"
                                    maxLength={2}
                                />
                                <div className="text-center text-xs text-gray-500 mt-1">MM</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-12 rounded transition-colors text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!timeInput.hours || !timeInput.minutes}
                        >
                            {t('common.verify', 'COMPROBAR')}
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 font-bold text-xl animate-bounce">
                        {t('common.error', 'HORARIO INCORRECTO')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusSchedulePuzzle;
