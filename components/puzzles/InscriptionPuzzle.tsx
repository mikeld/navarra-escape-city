
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../UIComponents';
import { useTranslation } from 'react-i18next';

interface InscriptionPuzzleProps {
    onSolved: (val: string) => void;
    onMistake?: () => void;
}

const TOTAL_STEPS = 5;

// Configuración para la detección de la estrella
const CANVAS_SIZE = 300;
const CENTER = CANVAS_SIZE / 2;
const RADIUS = 100;
const HIT_RADIUS = 25;

const TARGET_POINTS = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 45 - 90) * (Math.PI / 180);
    return {
        id: i,
        x: CENTER + RADIUS * Math.cos(angle),
        y: CENTER + RADIUS * Math.sin(angle)
    };
});

const InscriptionPuzzle: React.FC<InscriptionPuzzleProps> = ({ onSolved, onMistake }) => {
    const { t } = useTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isSearching, setIsSearching] = useState(false);
    const [archivolts, setArchivolts] = useState<number>(0);
    const [maryInput, setMaryInput] = useState('');

    // Drawing State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hitHistory, setHitHistory] = useState<number[]>([]); // Para el trazo
    const [uniqueHits, setUniqueHits] = useState<Set<number>>(new Set()); // Para el contador
    const [drawingSuccess, setDrawingSuccess] = useState(false);

    const nextStep = () => {
        setErrorMsg(null);
        if (currentStep < TOTAL_STEPS - 1) {
            const next = currentStep + 1;
            setCurrentStep(next);
            if (next === 1 || next === 2 || next === 3) {
                setIsSearching(true);
            } else {
                setIsSearching(false);
            }
        } else {
            onSolved('EST HIC');
        }
    };

    const showError = (msg: string) => {
        if (onMistake) onMistake();
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(null), 4000);
    };

    const handleArchivoltsCheck = () => {
        if (archivolts === 5) {
            nextStep();
        } else {
            showError(t('puzzleComponents.common.error'));
        }
    };

    const handlePedroSelect = (item: string) => {
        if (item === 'KEYS') nextStep();
        else showError(t('puzzleComponents.common.error'));
    };

    const handleMiguelSelect = (item: string) => {
        if (item === 'LANCE') nextStep();
        else showError(t('puzzleComponents.common.error'));
    };

    const handleMaryCheck = () => {
        if (maryInput.toUpperCase().trim() === 'ALTERA MARIA') nextStep();
        else showError(t('puzzleComponents.common.error'));
    };

    // --- DRAWING LOGIC ---

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (drawingSuccess) return;
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#d4af37';
        }
        checkHits(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || drawingSuccess || !canvasRef.current) return;
        e.preventDefault();
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        checkHits(x, y);
    };

    const checkHits = (x: number, y: number) => {
        const hitIndex = TARGET_POINTS.findIndex(p => {
            const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
            return dist < HIT_RADIUS;
        });

        if (hitIndex !== -1) {
            // Actualizar historial de trazo (permitir repetidos para analizar geometría)
            setHitHistory(prev => {
                const lastHit = prev[prev.length - 1];
                if (lastHit !== hitIndex) return [...prev, hitIndex];
                return prev;
            });

            // Actualizar contador único (solo para UI)
            setUniqueHits(prev => new Set(prev).add(hitIndex));
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
    };

    const handleVerify = () => {
        // Simplificado: Si el usuario ha encontrado y conectado los 8 puntos, es válido.
        // Eliminamos la validación estricta de cruces para evitar frustración si el dibujo es imperfecto.
        if (uniqueHits.size === 8) {
            setDrawingSuccess(true);
            setTimeout(() => {
                nextStep();
            }, 1500);
        } else {
            showError("La geometría está incompleta. Debes conectar los 8 puntos del símbolo.");
        }
    };

    const resetCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }
        setHitHistory([]);
        setUniqueHits(new Set());
        setDrawingSuccess(false);
        setErrorMsg(null);
    };

    const renderProgressBar = () => (
        <div className="flex gap-1 mb-6">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                    key={i}
                    className={`h-1 flex-1 transition-all duration-500 ${i <= currentStep ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-800'}`}
                ></div>
            ))}
        </div>
    );

    const buttonStyle = "w-full py-3 bg-black border-2 border-green-500 text-green-500 font-mono font-bold uppercase tracking-widest hover:bg-green-900/30 hover:text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all mt-4";

    return (
        <div className="space-y-6 animate-fade-in font-mono">
            <div className="bg-black border border-green-500/30 p-4 rounded text-xs text-green-400 mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <p className="typing-effect">{`> ${t('puzzleComponents.inscription.logExec')}`}</p>
                <p className="mt-1">{`> ${t('puzzleComponents.inscription.logLayer')}: ${currentStep + 1}/${TOTAL_STEPS}`}</p>
                {errorMsg && <p className="text-red-500 mt-2 animate-pulse font-bold border-l-2 border-red-500 pl-2">{`> ERROR: ${errorMsg}`}</p>}
            </div>

            {renderProgressBar()}

            {currentStep === 0 && (
                <div className="space-y-4 text-center">
                    <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">{t('puzzleComponents.inscription.step1')}</h4>
                    <p className="text-white font-bold">{t('puzzleComponents.inscription.instr1')}</p>
                    <div className="flex justify-center items-center gap-4 bg-gray-900 p-4 rounded border border-gray-700">
                        <button onClick={() => setArchivolts(Math.max(0, archivolts - 1))} className="text-2xl text-green-500 p-2">-</button>
                        <span className="text-4xl text-white font-mono w-12">{archivolts}</span>
                        <button onClick={() => setArchivolts(archivolts + 1)} className="text-2xl text-green-500 p-2">+</button>
                    </div>
                    <button onClick={handleArchivoltsCheck} className={buttonStyle}>{t('puzzleComponents.inscription.btn')}</button>
                </div>
            )}

            {/* STEP 2: SAN PEDRO */}
            {currentStep === 1 && (
                <div className="space-y-6 text-center">
                    <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">{t('puzzleComponents.inscription.step2')}</h4>
                    {isSearching ? (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-white font-bold text-lg border-l-4 border-green-500 pl-4 py-2 bg-green-900/10 text-left">
                                {t('puzzleComponents.inscription.search2')}
                            </p>
                            <button onClick={() => setIsSearching(false)} className={buttonStyle}>
                                {t('puzzleComponents.inscription.btnFound2')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slide-up">
                            <p className="text-white font-bold text-lg">{t('puzzleComponents.inscription.instr2')}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handlePedroSelect('SWORD')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">⚔️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.sword')}</span>
                                </button>
                                <button onClick={() => handlePedroSelect('KEYS')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">🗝️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.keys')}</span>
                                </button>
                                <button onClick={() => handlePedroSelect('BOOK')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">📖</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.book')}</span>
                                </button>
                                <button onClick={() => handlePedroSelect('NET')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">🕸️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.net')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: SAN MIGUEL */}
            {currentStep === 2 && (
                <div className="space-y-6 text-center">
                    <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">{t('puzzleComponents.inscription.step3')}</h4>
                    {isSearching ? (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-white font-bold text-lg border-l-4 border-green-500 pl-4 py-2 bg-green-900/10 text-left">
                                {t('puzzleComponents.inscription.search3')}
                            </p>
                            <button onClick={() => setIsSearching(false)} className={buttonStyle}>
                                {t('puzzleComponents.inscription.btnFound3')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slide-up">
                            <p className="text-white font-bold text-lg">{t('puzzleComponents.inscription.instr3')}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => handleMiguelSelect('LANCE')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">🔱🛡️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.lance')}</span>
                                </button>
                                <button onClick={() => handleMiguelSelect('SCALE')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">⚖️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.scale')}</span>
                                </button>
                                <button onClick={() => handleMiguelSelect('SWORD_FIRE')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">🔥🗡️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.fire')}</span>
                                </button>
                                <button onClick={() => handleMiguelSelect('CROSS')} className="p-4 bg-gray-900 border border-gray-700 hover:border-green-500 rounded flex flex-col items-center gap-2">
                                    <span className="text-3xl">✝️</span>
                                    <span className="text-xs uppercase text-gray-500 font-bold">{t('puzzleComponents.inscription.items.cross')}</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 4: MARIAS */}
            {currentStep === 3 && (
                <div className="space-y-6 text-center">
                    <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">{t('puzzleComponents.inscription.step4')}</h4>
                    {isSearching ? (
                        <div className="space-y-4 animate-fade-in">
                            <p className="text-white font-bold text-lg border-l-4 border-green-500 pl-4 py-2 bg-green-900/10 text-left">
                                {t('puzzleComponents.inscription.search4')}
                            </p>
                            <button onClick={() => setIsSearching(false)} className={buttonStyle}>
                                {t('puzzleComponents.inscription.btnFound4')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slide-up">
                            <p className="text-white font-bold text-xs">{t('puzzleComponents.inscription.instr4')}</p>
                            <input type="text" placeholder="..." value={maryInput} onChange={(e) => setMaryInput(e.target.value)} className="w-full bg-black border-b-2 border-green-500 text-green-400 text-center p-3 focus:outline-none uppercase font-mono" />
                            <button onClick={handleMaryCheck} className={buttonStyle}>{t('puzzleComponents.inscription.btn')}</button>
                        </div>
                    )}
                </div>
            )}

            {currentStep === 4 && (
                <div className="space-y-6 text-center animate-fade-in">
                    <h4 className="text-green-500 font-bold uppercase tracking-widest text-sm">{t('puzzleComponents.inscription.step5')}</h4>

                    <div className="bg-green-900/10 border-l-4 border-green-500 p-4 text-left mb-4">
                        <p className="text-white font-serif text-sm leading-relaxed">{t('puzzleComponents.inscription.instr5_context')}</p>
                    </div>

                    {/* DRAWING CANVAS */}
                    <div className="relative mx-auto" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
                        <canvas
                            ref={canvasRef}
                            width={CANVAS_SIZE}
                            height={CANVAS_SIZE}
                            className="bg-black/90 border-2 border-navarra-gold/30 rounded-full touch-none cursor-crosshair shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />

                        {/* Guías sutiles (puntos), sin números */}
                        {TARGET_POINTS.map((p, i) => {
                            const isHit = uniqueHits.has(i);
                            return (
                                <div
                                    key={i}
                                    className={`absolute w-2 h-2 -ml-1 -mt-1 rounded-full transition-all duration-500 pointer-events-none 
                                    ${isHit ? 'bg-navarra-gold shadow-[0_0_10px_#d4af37] scale-150' : 'bg-gray-800'}`}
                                    style={{ left: p.x, top: p.y }}
                                ></div>
                            );
                        })}

                        {/* Success Overlay */}
                        {drawingSuccess && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/80 animate-fade-in rounded-full">
                                <span className="text-4xl text-navarra-gold font-bold drop-shadow-[0_0_20px_rgba(212,175,55,1)] animate-pulse">
                                    ★ STELLA ★
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Feedback Numérico Ciego */}
                    <div className="flex flex-col gap-4 pt-4">
                        <div className="flex justify-between items-center bg-black/40 p-2 rounded border-l-2 border-navarra-gold">
                            <span className="text-gray-500 text-xs font-mono uppercase">{t('puzzleComponents.inscription.verticesActivated')}</span>
                            <span className={`font-mono font-bold text-lg animate-pulse ${uniqueHits.size === 8 ? 'text-green-400' : 'text-navarra-gold'}`}>{uniqueHits.size}</span>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={resetCanvas}
                                className="flex-1 py-3 text-xs text-red-400 hover:text-red-300 border border-red-900/50 hover:bg-red-900/20 rounded uppercase tracking-widest transition-colors"
                            >
                                {t('puzzleComponents.inscription.clear')}
                            </button>
                            <button
                                onClick={handleVerify}
                                className={`flex-[2] py-3 text-sm font-bold uppercase tracking-widest rounded border transition-all shadow-lg
                                ${hitHistory.length > 0
                                        ? 'bg-navarra-gold text-black border-navarra-gold hover:bg-white'
                                        : 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'}`}
                            >
                                {t('puzzleComponents.inscription.invokeSymbol')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InscriptionPuzzle;
