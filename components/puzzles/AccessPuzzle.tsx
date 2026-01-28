import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AccessPuzzleProps {
    onSolved: () => void;
}

const AccessPuzzle: React.FC<AccessPuzzleProps> = ({ onSolved }) => {
    const { t } = useTranslation();
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleSubmit = () => {
        if (!answer.trim()) return;

        setIsSubmitting(true);

        // Simulate processing
        setTimeout(() => {
            setShowResult(true);
        }, 2000);
    };

    const handleContinue = () => {
        onSolved();
    };

    // Result Screen
    if (showResult) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <div className="max-w-lg w-full text-center space-y-8">
                    {/* Access Granted Animation */}
                    <div className="relative">
                        <div className="text-green-500 text-6xl mb-4 animate-pulse">🔓</div>
                        <h1 className="text-4xl font-mono text-green-400 font-bold tracking-wider">
                            {t('ega98.access.granted', 'ACCESO CONCEDIDO')}
                        </h1>
                        <div className="mt-4 h-1 bg-green-500/20 overflow-hidden">
                            <div className="h-full bg-green-500 animate-pulse" style={{ width: '100%' }} />
                        </div>
                    </div>

                    {/* User's Answer */}
                    <div className="bg-green-900/20 border border-green-900 p-6 rounded">
                        <p className="text-gray-400 text-sm mb-2">
                            {t('ega98.access.yourAnswer', 'Tu respuesta:')}
                        </p>
                        <p className="text-green-300 text-lg italic">
                            "{answer}"
                        </p>
                    </div>

                    {/* Message */}
                    <div className="text-gray-400 font-mono text-sm space-y-2">
                        <p>{t('ega98.access.noWrongAnswer', 'No había respuesta incorrecta.')}</p>
                        <p>{t('ega98.access.humanAnswer', 'Solo hacía falta una respuesta humana.')}</p>
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinue}
                        className="w-full bg-green-900 hover:bg-green-800 text-green-100 py-4 px-8 font-mono text-lg transition-colors rounded"
                    >
                        {t('ega98.access.seeTheTruth', 'Ver la Verdad ►')}
                    </button>
                </div>
            </div>
        );
    }

    // Submitting Screen
    if (isSubmitting) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="text-6xl animate-spin">⏳</div>
                    <p className="text-green-500 font-mono animate-pulse">
                        {t('ega98.access.processing', 'Procesando respuesta...')}
                    </p>
                    <div className="flex justify-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        );
    }

    // Main Access Interface
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-6">
            <div className="max-w-lg w-full">
                {/* Bank Interface Header */}
                <div className="bg-gray-900 border border-gray-700 rounded-t-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-3xl">🏦</span>
                        <h1 className="text-xl font-mono text-gray-300 uppercase tracking-widest">
                            {t('ega98.access.bankTitle', 'Sistema de Acceso Seguro')}
                        </h1>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
                </div>

                {/* Main Interface */}
                <div className="bg-[#0a0a12] border-x border-b border-gray-700 rounded-b-lg p-8">
                    {/* Status */}
                    <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-6">
                        <span>ACCOUNT: ████████-EGA98</span>
                        <span className="text-green-500">● CONNECTED</span>
                    </div>

                    {/* Pieces Collected */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded p-4 mb-6">
                        <p className="text-gray-400 text-sm mb-2">
                            {t('ega98.access.pieces', 'Piezas recopiladas:')}
                        </p>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-green-900/30 text-green-500 p-2 rounded text-xs">✓ ACT I</div>
                            <div className="bg-green-900/30 text-green-500 p-2 rounded text-xs">✓ ACT II</div>
                            <div className="bg-green-900/30 text-green-500 p-2 rounded text-xs">✓ ACT III</div>
                            <div className="bg-green-900/30 text-green-500 p-2 rounded text-xs">✓ ACT IV</div>
                            <div className="bg-green-900/30 text-green-500 p-2 rounded text-xs">✓ ACT V</div>
                            <div className="bg-green-900/30 text-green-500 p-2 rounded text-xs">✓ ACT VI</div>
                            <div className="bg-yellow-900/30 text-yellow-500 p-2 rounded text-xs col-span-2">⋯ ACT VII</div>
                        </div>
                    </div>

                    {/* The Question */}
                    <div className="text-center mb-8">
                        <p className="text-gray-500 text-sm mb-4 font-mono">
                            {t('ega98.access.securityQuestion', 'PREGUNTA DE SEGURIDAD FINAL:')}
                        </p>
                        <h2 className="text-2xl md:text-3xl font-serif text-white">
                            "{t('ega98.access.question', '¿Por qué esperaste?')}"
                        </h2>
                    </div>

                    {/* Answer Input */}
                    <div className="space-y-4">
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder={t('ega98.access.placeholder', 'Escribe tu respuesta...')}
                            className="w-full h-32 bg-black border border-gray-700 rounded p-4 text-white font-mono resize-none focus:outline-none focus:border-green-900 placeholder-gray-600"
                        />

                        <button
                            onClick={handleSubmit}
                            disabled={!answer.trim()}
                            className={`w-full py-4 px-8 font-mono text-lg rounded transition-all ${answer.trim()
                                    ? 'bg-green-900 hover:bg-green-800 text-green-100 cursor-pointer'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {t('ega98.access.submit', 'Enviar Respuesta')}
                        </button>
                    </div>

                    {/* Hint */}
                    <p className="text-gray-600 text-center text-sm mt-6 font-mono italic">
                        {t('ega98.access.hint', 'No hay respuesta incorrecta. Solo hace falta una humana.')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccessPuzzle;
