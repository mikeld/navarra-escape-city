import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EnigmaTable as EnigmaTableType } from '../../types';

interface EnigmaTableProps {
    tableConfig: EnigmaTableType;
    onValidate: (isCorrect: boolean) => void;
}

export const EnigmaTable: React.FC<EnigmaTableProps> = ({ tableConfig, onValidate }) => {
    const { t } = useTranslation();

    // Función para mezclar un array (Fisher-Yates shuffle)
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Mezclar las opciones al montar el componente (una sola vez)
    const [shuffledOptions] = useState<string[][] | undefined>(() => {
        if (!tableConfig.columnOptions) return undefined;
        return tableConfig.columnOptions.map(columnOpts => {
            // Separar la opción vacía del resto
            const emptyOption = columnOpts[0] === '' ? [''] : [];
            const nonEmptyOptions = columnOpts.filter(opt => opt !== '');
            // Mezclar solo las opciones no vacías
            const shuffled = shuffleArray(nonEmptyOptions);
            // Retornar con la opción vacía al principio
            return [...emptyOption, ...shuffled];
        });
    });

    const [userAnswers, setUserAnswers] = useState<string[][]>(() => {
        // Initialize with empty strings for editable cells, keep header row
        return tableConfig.rows.map((row, rowIndex) =>
            row.cells.map(cell => cell.isEditable ? '' : t(cell.value))
        );
    });

    const [showFeedback, setShowFeedback] = useState<'success' | 'error' | null>(null);

    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[rowIndex][colIndex] = value;
        setUserAnswers(newAnswers);
        setShowFeedback(null); // Clear feedback when user types
    };

    const handleCheck = () => {
        // Compare user answers with solution (case-insensitive, trimmed)
        let isCorrect = true;

        for (let i = 1; i < userAnswers.length; i++) { // Skip header row (index 0)
            for (let j = 0; j < userAnswers[i].length; j++) {
                const userAnswer = userAnswers[i][j].trim().toLowerCase();
                const correctAnswer = tableConfig.solution[i][j].toLowerCase();

                if (userAnswer !== correctAnswer) {
                    isCorrect = false;
                    break;
                }
            }
            if (!isCorrect) break;
        }

        setShowFeedback(isCorrect ? 'success' : 'error');
        onValidate(isCorrect);
    };

    const handleReset = () => {
        const resetAnswers = tableConfig.rows.map((row) =>
            row.cells.map(cell => cell.isEditable ? '' : t(cell.value))
        );
        setUserAnswers(resetAnswers);
        setShowFeedback(null);
    };

    return (
        <div className="w-full">
            {/* Table container with horizontal scroll on mobile */}
            <div className="overflow-x-auto mb-6">
                <table className="w-full border-2 border-navarra-gold/30 rounded-lg overflow-hidden">
                    <tbody>
                        {tableConfig.rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={rowIndex === 0 ? 'bg-navarra-gold/20' : 'bg-navarra-panel/50'}
                            >
                                {row.cells.map((cell, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className="border border-navarra-gold/20 p-2 md:p-3"
                                    >
                                        {cell.isEditable ? (
                                            shuffledOptions && shuffledOptions[colIndex] ? (
                                                // Render SELECT dropdown if options are available
                                                <select
                                                    value={userAnswers[rowIndex][colIndex]}
                                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                    className={`w-full bg-navarra-dark/50 text-white px-2 py-2 rounded border ${showFeedback === 'success'
                                                        ? 'border-green-500'
                                                        : showFeedback === 'error'
                                                            ? 'border-red-500'
                                                            : 'border-navarra-gold/30'
                                                        } focus:outline-none focus:border-navarra-gold transition-colors text-sm md:text-base cursor-pointer`}
                                                >
                                                    {shuffledOptions[colIndex].map((option, optIndex) => (
                                                        <option key={optIndex} value={option}>
                                                            {option || t('enigmas.tablePlaceholder')}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                // Fallback to INPUT if no options defined
                                                <input
                                                    type="text"
                                                    value={userAnswers[rowIndex][colIndex]}
                                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                                    placeholder={t('enigmas.tablePlaceholder')}
                                                    className={`w-full bg-navarra-dark/50 text-white px-2 py-2 rounded border ${showFeedback === 'success'
                                                        ? 'border-green-500'
                                                        : showFeedback === 'error'
                                                            ? 'border-red-500'
                                                            : 'border-navarra-gold/30'
                                                        } focus:outline-none focus:border-navarra-gold transition-colors text-sm md:text-base`}
                                                />
                                            )
                                        ) : (
                                            <div className="text-center font-bold text-navarra-gold text-sm md:text-base">
                                                {t(cell.value)}
                                            </div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Feedback Message */}
            {showFeedback && (
                <div
                    className={`mb-4 p-4 rounded-lg text-center font-bold ${showFeedback === 'success'
                        ? 'bg-green-900/30 border-2 border-green-500 text-green-400'
                        : 'bg-red-900/30 border-2 border-red-500 text-red-400'
                        }`}
                >
                    <div className="text-lg mb-1">
                        {showFeedback === 'success' ? t('enigmas.successTitle') : t('enigmas.errorTitle')}
                    </div>
                    <div className="text-sm">
                        {showFeedback === 'success' ? t('enigmas.successMessage') : t('enigmas.errorMessage')}
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleCheck}
                    className="flex-1 bg-navarra-gold hover:bg-navarra-gold/80 text-navarra-dark font-bold py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
                >
                    ✓ {t('enigmas.checkSolution')}
                </button>
                <button
                    onClick={handleReset}
                    className="flex-1 bg-transparent border-2 border-navarra-gold/30 hover:border-navarra-gold text-navarra-gold font-bold py-3 px-6 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
                >
                    ↻ {t('enigmas.resetTable')}
                </button>
            </div>
        </div>
    );
};
