import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RailwayPuzzleProps {
    onSolved: () => void;
    onExit: () => void;
    onOpenComputer?: () => void;
}

const RailwayPuzzle: React.FC<RailwayPuzzleProps> = ({ onSolved, onExit, onOpenComputer }) => {
    const { t } = useTranslation();
    const [bulletCount, setBulletCount] = useState('');
    const [year, setYear] = useState('');
    const [showError, setShowError] = useState(false);
    const [shake, setShake] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [phase, setPhase] = useState<'intro' | 'puzzle' | 'success'>('intro');

    // Correct answers - these can be adjusted based on actual counts
    const CORRECT_BULLET_COUNT = '7'; // Placeholder - adjust to actual count
    const CORRECT_YEAR = '1927'; // Year of Basque-Navarre Railway tile

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (bulletCount === CORRECT_BULLET_COUNT && year === CORRECT_YEAR) {
            setPhase('success');
            setTimeout(() => onSolved(), 3000);
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

    // History Modal Component
    const HistoryModal = () => (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gradient-to-b from-amber-900 to-amber-950 border-2 border-amber-600 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-amber-900 border-b border-amber-600 p-4 flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-amber-200">{t('ega98.monasteryPuzzle.historyTitle', 'Monasterio de Santa Clara')}</h2>
                    <button
                        onClick={() => setShowHistory(false)}
                        className="text-amber-400 hover:text-white text-2xl"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 space-y-4 text-amber-100">
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-amber-300">{t('ega98.monasteryPuzzle.foundation', 'Fundación (1255-1263)')}</h3>
                        <p className="leading-relaxed">
                            {t('ega98.monasteryPuzzle.foundationText', 'El Monasterio de Santa Clara fue fundado en Navarra entre 1255 y 1263, siendo uno de los primeros conventos de clarisas en España. Bernardo Montaner, rico caballero franco, fue su principal mecenas.')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-amber-300">{t('ega98.monasteryPuzzle.carlistWar', 'Guerras Carlistas (1833-1876)')}</h3>
                        <p className="leading-relaxed">
                            {t('ega98.monasteryPuzzle.carlistWarText', 'Durante la guerra, el monasterio fue utilizado como hospital militar. El 18 de agosto de 1873, los carlistas colocaron cañones en la huerta del monasterio para atacar la guarnición liberal en el convento de San Francisco. Las marcas de bala que ves hoy en la fachada sur son testigos de aquellos días.')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-amber-300">{t('ega98.monasteryPuzzle.railway', 'Ferrocarril Vasco-Navarro')}</h3>
                        <p className="leading-relaxed">
                            {t('ega98.monasteryPuzzle.railwayText', 'El Ferrocarril Vasco-Navarro conectó Navarra con otras ciudades desde 1927. Tras su cierre en 1967, la antigua vía se convirtió en la Vía Verde que hoy pasa junto al monasterio. Las baldosas del suelo recuerdan este importante patrimonio ferroviario.')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-amber-300">{t('ega98.monasteryPuzzle.closure', 'Cierre (2024)')}</h3>
                        <p className="leading-relaxed">
                            {t('ega98.monasteryPuzzle.closureText', 'Tras casi 8 siglos de historia, el convento cerró sus puertas en diciembre de 2024. La comunidad se trasladó a Navarra, llevando consigo el segundo archivo más importante de Navarra después del municipal.')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    // Intro Screen
    if (phase === 'intro') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-amber-900 to-black z-50 overflow-y-auto">
                <div className="min-h-screen flex flex-col items-center justify-start pt-24 p-4">
                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-b-2 border-amber-500/30 shadow-lg z-10">
                        <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                            <span>←</span>
                            <span>{t('common.back', 'Volver')}</span>
                        </button>
                        <div className="text-lg md:text-xl font-bold text-amber-400 tracking-widest hidden sm:block">
                            SANTA CLARA
                        </div>
                        <div className="flex items-center gap-2">
                            {onOpenComputer && (
                                <button
                                    onClick={onOpenComputer}
                                    className="w-10 h-10 bg-[#008080] hover:bg-[#009090] border-2 border-[#00b0b0] rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                    title={t('ega98.computer.openComputer', 'Ordenador del Capi')}
                                >
                                    <span className="text-xl">💻</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-w-2xl w-full space-y-6">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🏛️</div>
                            <h1 className="text-3xl md:text-4xl font-serif text-amber-400 mb-2">
                                {t('ega98.monasteryPuzzle.title', 'Las Cicatrices de la Historia')}
                            </h1>
                            <p className="text-amber-600 text-sm md:text-base italic">
                                {t('ega98.monasteryPuzzle.subtitle', 'Monasterio de Santa Clara')}
                            </p>
                        </div>

                        <div className="bg-black/40 border-2 border-amber-700/50 rounded-lg p-6 md:p-8 space-y-4">
                            <p className="text-amber-100 text-base md:text-lg leading-relaxed">
                                {t('ega98.monasteryPuzzle.intro1', 'En 1873, durante la Guerra Carlista, el Monasterio de Santa Clara quedó atrapado en medio del fuego. Los carlistas colocaron cañones en su huerta para atacar a los liberales.')}
                            </p>
                            <p className="text-amber-100 text-base md:text-lg leading-relaxed">
                                {t('ega98.monasteryPuzzle.intro2', 'Hoy, casi 150 años después, las marcas de aquellas balas siguen visibles en la fachada sur del monasterio, junto a las baldosas que recuerdan el antiguo Ferrocarril Vasco-Navarro.')}
                            </p>
                        </div>

                        <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-6">
                            <p className="text-amber-300 font-bold text-center mb-3">
                                📍 {t('ega98.monasteryPuzzle.instruction', 'Dirígete al Monasterio de Santa Clara')}
                            </p>
                            <p className="text-amber-200 text-sm text-center">
                                {t('ega98.monasteryPuzzle.instructionDetail', 'Busca la fachada sur del monasterio y las baldosas del suelo')}
                            </p>
                        </div>

                        <button
                            onClick={() => setPhase('puzzle')}
                            className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg text-lg"
                        >
                            {t('ega98.monasteryPuzzle.ready', 'Estoy en el Monasterio ►')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success Screen
    if (phase === 'success') {
        return (
            <div className="fixed inset-0 bg-gradient-to-b from-amber-900 to-black z-50 flex items-center justify-center p-4">
                <div className="max-w-2xl text-center space-y-6 animate-fade-in">
                    <div className="text-8xl animate-bounce">✓</div>
                    <h2 className="text-4xl font-serif text-amber-400">
                        {t('ega98.monasteryPuzzle.success', '¡Enigma Resuelto!')}
                    </h2>
                    <p className="text-amber-200 text-xl">
                        {t('ega98.monasteryPuzzle.successText', 'Has descubierto las cicatrices del monasterio')}
                    </p>
                    <button
                        onClick={() => setShowHistory(true)}
                        className="bg-amber-700 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-all"
                    >
                        📖 {t('ega98.monasteryPuzzle.learnMore', 'Saber Más')}
                    </button>
                </div>
                {showHistory && <HistoryModal />}
            </div>
        );
    }

    // Main Puzzle Screen
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-amber-900 to-black z-50 overflow-y-auto">
            <div className="min-h-screen flex flex-col items-center justify-start pt-24 p-4 pb-10">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 border-b-2 border-amber-500/30 shadow-lg z-10">
                    <button onClick={onExit} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm">
                        <span>←</span>
                        <span>{t('common.back', 'Volver')}</span>
                    </button>
                    <div className="text-lg md:text-xl font-bold text-amber-400 tracking-widest hidden sm:block">
                        SANTA CLARA
                    </div>
                    <div className="flex items-center gap-2">
                        {onOpenComputer && (
                            <button
                                onClick={onOpenComputer}
                                className="w-10 h-10 bg-[#008080] hover:bg-[#009090] border-2 border-[#00b0b0] rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                                title={t('ega98.computer.openComputer', 'Ordenador del Capi')}
                            >
                                <span className="text-xl">💻</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-serif text-amber-400 mb-2">
                            🏛️ {t('ega98.monasteryPuzzle.title', 'Las Cicatrices de la Historia')}
                        </h1>
                    </div>

                    {/* Question 1: Bullet Marks */}
                    <div className="bg-black/40 border-2 border-amber-700/50 rounded-lg p-6 md:p-8 space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-amber-400 text-2xl font-bold shrink-0">1.</span>
                            <div className="space-y-3 flex-1">
                                <h3 className="text-amber-300 font-bold text-lg">
                                    {t('ega98.monasteryPuzzle.question1', 'Observa la fachada sur del monasterio')}
                                </h3>
                                <p className="text-amber-100 leading-relaxed">
                                    {t('ega98.monasteryPuzzle.question1Detail', 'Durante el sitio de 1873, las balas liberales impactaron en la fachada. ¿Cuántas marcas de bala puedes contar?')}
                                </p>
                                <div className="bg-amber-900/30 border border-amber-600/40 rounded p-4 text-center">
                                    <span className="text-6xl">🎯</span>
                                    <p className="text-amber-400 text-sm mt-2 italic">
                                        {t('ega98.monasteryPuzzle.question1Hint', 'Cuenta con atención las marcas circulares en la pared')}
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    value={bulletCount}
                                    onChange={(e) => {
                                        if (/^\d{0,2}$/.test(e.target.value)) {
                                            setBulletCount(e.target.value);
                                        }
                                    }}
                                    className="w-full bg-black border-2 border-amber-900 focus:border-amber-500 text-amber-400 text-3xl text-center p-4 rounded font-mono tracking-wider outline-none transition-colors"
                                    placeholder="?"
                                    maxLength={2}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Question 2: Railway Tile */}
                    <div className="bg-black/40 border-2 border-amber-700/50 rounded-lg p-6 md:p-8 space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-amber-400 text-2xl font-bold shrink-0">2.</span>
                            <div className="space-y-3 flex-1">
                                <h3 className="text-amber-300 font-bold text-lg">
                                    {t('ega98.monasteryPuzzle.question2', 'Busca las baldosas en el suelo')}
                                </h3>
                                <p className="text-amber-100 leading-relaxed">
                                    {t('ega98.monasteryPuzzle.question2Detail', 'Cerca de la entrada encontrarás las baldosas que conmemoran el antiguo Ferrocarril Vasco-Navarro. ¿Qué año aparece en la inscripción?')}
                                </p>
                                <div className="bg-amber-900/30 border border-amber-600/40 rounded p-4 text-center">
                                    <span className="text-5xl">🚂</span>
                                    <p className="text-amber-300 font-bold mt-2">
                                        TREN VASCO NAVARRO
                                    </p>
                                    <p className="text-amber-400 text-sm italic">
                                        {t('ega98.monasteryPuzzle.question2Hint', 'Busca el año grabado en las baldosas')}
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    value={year}
                                    onChange={(e) => {
                                        if (/^\d{0,4}$/.test(e.target.value)) {
                                            setYear(e.target.value);
                                        }
                                    }}
                                    className="w-full bg-black border-2 border-amber-900 focus:border-amber-500 text-amber-400 text-3xl text-center p-4 rounded font-mono tracking-wider outline-none transition-colors"
                                    placeholder="19__"
                                    maxLength={4}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <form onSubmit={handleSubmit} className={shake ? 'animate-shake' : ''}>
                        <button
                            type="submit"
                            disabled={!bulletCount || year.length !== 4}
                            className="w-full bg-amber-800 hover:bg-amber-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
                        >
                            {t('common.verify', 'COMPROBAR')} ✓
                        </button>
                    </form>

                    {/* Error Message */}
                    {showError && (
                        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg animate-bounce font-bold z-50">
                            ❌ {t('common.incorrect', 'RESPUESTA INCORRECTA')}
                        </div>
                    )}
                </div>
            </div>
            {showHistory && <HistoryModal />}
        </div>
    );
};

export default RailwayPuzzle;
