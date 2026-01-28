import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Difference } from '../../types';

interface FindDifferencesGameProps {
    gameImage: string;
    solutionImage: string;
    differences: Difference[];
    onComplete: () => void;
}

export const FindDifferencesGame: React.FC<FindDifferencesGameProps> = ({
    gameImage,
    solutionImage,
    differences,
    onComplete
}) => {
    const { t } = useTranslation();
    const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
    const [showSolution, setShowSolution] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    // Check if all differences are found
    useEffect(() => {
        if (foundDifferences.length === differences.length && differences.length > 0) {
            onComplete();
        }
    }, [foundDifferences, differences.length, onComplete]);

    const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
        if (showSolution) return; // No clicks allowed when showing solution

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Check if click is within any difference zone
        for (const diff of differences) {
            if (foundDifferences.includes(diff.id)) continue; // Already found

            const distance = Math.sqrt(
                Math.pow(x - diff.x, 2) + Math.pow(y - diff.y, 2)
            );

            if (distance <= diff.radius) {
                setFoundDifferences(prev => [...prev, diff.id]);
                break;
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Counter */}
            <div className="bg-navarra-gold/20 border-2 border-navarra-gold/60 px-6 py-3 rounded-xl">
                <p className="text-navarra-gold font-bold text-lg">
                    {t('enigmas.differencesFound')}: {foundDifferences.length} / {differences.length}
                </p>
            </div>

            {/* Game Image */}
            <div className="relative group flex justify-center w-full">
                <div className="relative inline-block">
                    <img
                        ref={imageRef}
                        src={showSolution ? solutionImage : gameImage}
                        alt="Find the differences"
                        onClick={handleImageClick}
                        className={`rounded-lg shadow-xl border border-white/10 max-h-[80vh] w-auto object-contain transition-all duration-500 ${!showSolution ? 'cursor-crosshair' : 'cursor-default'
                            }`}
                    />



                    {/* Found differences markers - Only show on game image, not solution */}
                    {!showSolution && imageRef.current && foundDifferences.map(diffId => {
                        const diff = differences.find(d => d.id === diffId);
                        if (!diff) return null;

                        return (
                            <div
                                key={diffId}
                                className="absolute pointer-events-none animate-pulse"
                                style={{
                                    left: `${diff.x}%`,
                                    top: `${diff.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                }}
                            >
                                <div
                                    className="rounded-full border-4 border-green-400 bg-green-400/20"
                                    style={{
                                        width: `${diff.radius * 2}%`,
                                        height: `${diff.radius * 2}%`,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 w-full">
                <button
                    onClick={() => setShowSolution(!showSolution)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 border-2 ${showSolution
                        ? 'bg-navarra-dark text-navarra-gold border-navarra-gold'
                        : 'bg-navarra-gold/10 text-navarra-gold border-navarra-gold/30 hover:bg-navarra-gold/20'
                        }`}
                >
                    {showSolution ? (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {t('enigmas.hideSolution')}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.04m5.88 5.88l4.242 4.242M9.88 9.88l4.242 4.242M9.88 9.88L14.242 5.638" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m0 0l-1.5-1.5M15 15l1.5-1.5" />
                            </svg>
                            {t('enigmas.showSolution')}
                        </>
                    )}
                </button>
            </div>

            {/* Completion message */}
            {foundDifferences.length === differences.length && differences.length > 0 && (
                <div className="bg-green-900/20 border-2 border-green-500/50 p-4 rounded-lg animate-fade-in">
                    <p className="text-green-400 font-bold text-center">
                        🎉 {t('enigmas.allDifferencesFound')}
                    </p>
                </div>
            )}
        </div>
    );
};
