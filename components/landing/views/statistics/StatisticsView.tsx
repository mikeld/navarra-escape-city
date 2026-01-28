import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../../../firebaseConfig';
import { collection, query, where, orderBy, limit, getDocs, getCountFromServer } from 'firebase/firestore';

interface StatisticsViewProps {
    onBack: () => void;
    gameId?: string; // Default: 'elgacena'
}

interface CompletionData {
    id: string;
    name: string;
    score: number;
    timeElapsed: number;
    date: string;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ onBack, gameId = 'elgacena' }) => {
    const { t } = useTranslation();
    const [totalCompletions, setTotalCompletions] = useState<number>(0);
    const [leaderboard, setLeaderboard] = useState<CompletionData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!db) return;
            setLoading(true);
            try {
                // 1. Get Total Completions
                const coll = collection(db, "completions");
                const snapshot = await getCountFromServer(query(coll, where("gameId", "==", gameId)));
                setTotalCompletions(snapshot.data().count);

                try {
                    // 2. Get Leaderboard (Top 10 by Score, then Time)
                    const q = query(
                        coll,
                        where("gameId", "==", gameId),
                        orderBy("score", "desc"),
                        orderBy("timeElapsed", "asc"),
                        limit(10)
                    );

                    const querySnapshot = await getDocs(q);
                    const results: CompletionData[] = [];
                    querySnapshot.forEach((doc) => {
                        results.push({ id: doc.id, ...doc.data() } as CompletionData);
                    });
                    setLeaderboard(results);
                } catch (indexErr: any) {
                    // Fallback: If index is missing, query ONLY by score (no secondary sort by time)
                    const isIndexError =
                        indexErr.code === 'failed-precondition' ||
                        (indexErr.message && indexErr.message.includes("index"));

                    if (isIndexError) {
                        console.warn("Index missing (failed-precondition), falling back to simple query.");

                        const fallbackQ = query(
                            coll,
                            where("gameId", "==", gameId),
                            orderBy("score", "desc"),
                            limit(10)
                        );

                        const val = await getDocs(fallbackQ);
                        const fallbackResults: CompletionData[] = [];
                        val.forEach((doc) => {
                            fallbackResults.push({ id: doc.id, ...doc.data() } as CompletionData);
                        });
                        setLeaderboard(fallbackResults);

                        console.info("Showing leaderboard with simple sort (Score only).");
                    } else {
                        throw indexErr; // Re-throw if it's not an index error
                    }
                }

            } catch (err: any) {
                console.error("Error fetching stats:", err);
                setError("Error loading data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gameId]);

    // Format time (seconds to MM:SS)
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-navarra-dark text-white pt-24 pb-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto animate-fade-in">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-navarra-gold"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-white">
                        {t('stats.title', 'Estadísticas del Juego')}
                    </h1>
                </div>

                {/* Summary Card */}
                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6 mb-8 shadow-lg text-center">
                    <p className="text-navarra-gold/60 text-xs uppercase tracking-widest font-bold mb-2">
                        {t('stats.totalCompletions', 'Total Aventureros que han completado la misión')}
                    </p>
                    <p className="text-5xl font-serif text-white">{totalCompletions}</p>
                </div>

                {/* Leaderboard */}
                <div>
                    <h2 className="text-xl font-serif font-bold text-navarra-gold mb-4 flex items-center gap-2">
                        <span>🏆</span> {t('stats.ranking', 'Ranking - Top 10')}
                    </h2>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            {t('common.loading', 'Cargando...')}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-400 border border-red-900/50 rounded bg-red-900/10">
                            {error} <br />
                            <span className="text-xs text-gray-500">(Check Firestore indexes)</span>
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 italic">
                            {t('stats.empty', 'Aún no hay registros.')}
                        </div>
                    ) : (
                        <div className="bg-navarra-panel/50 rounded-lg border border-navarra-stone/30 overflow-hidden">
                            <div className="grid grid-cols-12 gap-2 p-4 text-navarra-gold/70 text-xs uppercase tracking-wider font-bold border-b border-navarra-stone/30">
                                <div className="col-span-2 md:col-span-1 text-center">{t('stats.rank', '#')}</div>
                                <div className="col-span-6 md:col-span-7">{t('stats.player', 'Aventurero')}</div>
                                <div className="col-span-2 text-right">{t('stats.score', 'Puntos')}</div>
                                <div className="col-span-2 text-right">{t('stats.time', 'Tiempo')}</div>
                            </div>

                            {leaderboard.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className={`grid grid-cols-12 gap-2 p-4 items-center border-b border-white/5 hover:bg-white/5 transition-colors ${index === 0 ? 'bg-navarra-gold/10' : ''
                                        }`}
                                >
                                    <div className="col-span-2 md:col-span-1 text-center font-bold">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                    </div>
                                    <div className="col-span-6 md:col-span-7 font-medium truncate pr-2">
                                        {entry.name || 'Anonymous'}
                                        {index === 0 && <span className="ml-2 text-[10px] bg-navarra-gold text-black px-1 rounded font-bold">TOP</span>}
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-navarra-gold">
                                        {entry.score}
                                    </div>
                                    <div className="col-span-2 text-right font-mono text-gray-400 text-sm">
                                        {formatTime(entry.timeElapsed)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
