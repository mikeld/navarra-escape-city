import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
    getUserGameProgress,
    getUserCompletions,
    getUserEnigmasCompleted,
    uploadProfileImage,
    UserGameProgress,
    UserEnigmaProgress
} from '../../services/userService';
import { ENIGMAS } from '../../data/enigmas';

interface ProfilePageProps {
    onBack: () => void;
    onNavigateToGame?: (gameId: string) => void;
    onNavigateToEnigma?: (enigmaId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onNavigateToGame, onNavigateToEnigma }) => {
    const { t } = useTranslation();
    const { user, userProfile, updateUserProfileData } = useAuth();

    const [activeTab, setActiveTab] = useState<'info' | 'games' | 'scores' | 'enigmas'>('info');

    // Personal Info State
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(userProfile?.firstName || '');
    const [lastName, setLastName] = useState(userProfile?.lastName || '');
    const [phone, setPhone] = useState(userProfile?.phone || '');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Game Progress State
    const [gameProgress, setGameProgress] = useState<UserGameProgress[]>([]);
    const [completions, setCompletions] = useState<any[]>([]);
    const [enigmasCompleted, setEnigmasCompleted] = useState<UserEnigmaProgress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserData();
        }
    }, [user]);

    useEffect(() => {
        if (userProfile) {
            setFirstName(userProfile.firstName || '');
            setLastName(userProfile.lastName || '');
            setPhone(userProfile.phone || '');
        }
    }, [userProfile]);

    const loadUserData = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const [progress, comps, enigmas] = await Promise.all([
                getUserGameProgress(user.uid),
                getUserCompletions(user.uid),
                getUserEnigmasCompleted(user.uid)
            ]);

            setGameProgress(progress);
            setCompletions(comps);
            setEnigmasCompleted(enigmas);
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'La imagen debe ser menor a 5MB' });
            return;
        }

        setUploading(true);
        try {
            await uploadProfileImage(user.uid, file);
            setMessage({ type: 'success', text: 'Foto actualizada correctamente' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;

        setSaving(true);
        setMessage(null);
        try {
            await updateUserProfileData({
                firstName,
                lastName,
                phone
            });
            setMessage({ type: 'success', text: t('profile.personalInfo.successSave') });
            setIsEditing(false);
        } catch (error: any) {
            setMessage({ type: 'error', text: t('profile.personalInfo.errorSave') });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getGameTitle = (gameId: string) => {
        const titles: Record<string, string> = {
            'elgacena': t('games.elgacena.title'),
            'ega98': t('games.ega98.title')
        };
        return titles[gameId] || gameId;
    };

    if (!user || !userProfile) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-navarra-dark via-gray-900 to-black text-navarra-parchment">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={onBack}
                    className="mb-6 text-navarra-gold hover:text-navarra-parchment transition-colors flex items-center gap-2"
                >
                    <span>←</span>
                    <span>{t('common.backToHome')}</span>
                </button>

                <h1 className="text-4xl font-serif text-navarra-gold mb-8">{t('profile.title')}</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-navarra-gold/30 overflow-x-auto">
                    {(['info', 'games', 'scores', 'enigmas'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-semibold transition whitespace-nowrap ${activeTab === tab
                                ? 'text-navarra-gold border-b-2 border-navarra-gold'
                                : 'text-navarra-parchment/60 hover:text-navarra-parchment'
                                }`}
                        >
                            {tab === 'info' && t('profile.personalInfo.title')}
                            {tab === 'games' && t('profile.games.title')}
                            {tab === 'scores' && t('profile.scores.title')}
                            {tab === 'enigmas' && t('profile.enigmas.title')}
                        </button>
                    ))}
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded border ${message.type === 'success'
                        ? 'bg-green-900/30 border-green-500 text-green-200'
                        : 'bg-red-900/30 border-red-500 text-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Content */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-navarra-gold rounded-lg p-8">
                    {/* Personal Info Tab */}
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            {/* Photo Upload */}
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-navarra-gold">
                                        <img
                                            src={userProfile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.displayName)}&background=D4AF37&color=000`}
                                            alt={userProfile.displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <div className="w-6 h-6 border-3 border-navarra-gold border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-navarra-parchment/70 mb-2">{t('profile.personalInfo.photoLabel')}</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-navarra-gold/20 border border-navarra-gold text-navarra-gold rounded hover:bg-navarra-gold hover:text-black transition disabled:opacity-50"
                                    >
                                        {uploading ? t('common.loading') : t('profile.personalInfo.changePhoto')}
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-2">{t('profile.personalInfo.firstName')}</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold disabled:opacity-60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2">{t('profile.personalInfo.lastName')}</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold disabled:opacity-60"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2">{t('profile.personalInfo.email')}</label>
                                    <input
                                        type="email"
                                        value={userProfile.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2">{t('profile.personalInfo.phone')}</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold disabled:opacity-60"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-navarra-gold to-yellow-600 text-black font-bold rounded hover:from-yellow-600 hover:to-navarra-gold transition"
                                    >
                                        Editar
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="px-6 py-3 bg-gradient-to-r from-navarra-gold to-yellow-600 text-black font-bold rounded hover:from-yellow-600 hover:to-navarra-gold transition disabled:opacity-50"
                                        >
                                            {saving ? t('profile.personalInfo.saving') : t('profile.personalInfo.save')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFirstName(userProfile.firstName || '');
                                                setLastName(userProfile.lastName || '');
                                                setPhone(userProfile.phone || '');
                                            }}
                                            className="px-6 py-3 bg-gray-700 text-navarra-parchment rounded hover:bg-gray-600 transition"
                                        >
                                            {t('profile.personalInfo.cancel')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Games Tab */}
                    {activeTab === 'games' && (
                        <div>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 border-4 border-navarra-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p>{t('common.loading')}</p>
                                </div>
                            ) : gameProgress.length === 0 ? (
                                <p className="text-center py-12 text-navarra-parchment/60">{t('profile.games.noGames')}</p>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {gameProgress.map((game) => (
                                        <div key={game.gameId} className="bg-black/30 border border-navarra-gold/30 rounded-lg p-6">
                                            <h3 className="text-xl font-serif text-navarra-gold mb-4">{getGameTitle(game.gameId)}</h3>
                                            <div className="space-y-2 text-sm">
                                                {game.isCompleted ? (
                                                    <p className="text-green-400">✓ {t('profile.games.completed')}</p>
                                                ) : (
                                                    <p>{t('profile.games.stage')} {game.currentStageIndex}</p>
                                                )}
                                                <p>{t('profile.games.lastPlayed')}: {formatDate(game.lastPlayed)}</p>
                                                {game.bestScore && <p>{t('profile.games.bestScore')}: {game.bestScore}</p>}
                                            </div>
                                            <button
                                                onClick={() => onNavigateToGame && onNavigateToGame(game.gameId)}
                                                className="mt-4 w-full px-4 py-2 bg-navarra-gold text-black font-semibold rounded hover:bg-yellow-600 transition"
                                            >
                                                {game.isCompleted ? t('profile.games.playAgain') : t('profile.games.continueGame')}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Scores Tab */}
                    {activeTab === 'scores' && (
                        <div>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 border-4 border-navarra-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p>{t('common.loading')}</p>
                                </div>
                            ) : completions.length === 0 ? (
                                <p className="text-center py-12 text-navarra-parchment/60">{t('profile.scores.noScores')}</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-navarra-gold/30">
                                                <th className="text-left py-3 px-4">{t('profile.scores.game')}</th>
                                                <th className="text-left py-3 px-4">{t('profile.scores.date')}</th>
                                                <th className="text-left py-3 px-4">{t('profile.scores.score')}</th>
                                                <th className="text-left py-3 px-4">{t('profile.scores.time')}</th>
                                                <th className="text-left py-3 px-4">{t('profile.scores.hints')}</th>
                                                <th className="text-left py-3 px-4">{t('profile.scores.mistakes')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {completions.map((completion, index) => (
                                                <tr key={index} className="border-b border-navarra-gold/10">
                                                    <td className="py-3 px-4">{getGameTitle(completion.gameId)}</td>
                                                    <td className="py-3 px-4">{formatDate(completion.date)}</td>
                                                    <td className="py-3 px-4 text-navarra-gold font-semibold">{completion.score}</td>
                                                    <td className="py-3 px-4">{formatTime(completion.timeElapsed)}</td>
                                                    <td className="py-3 px-4">{completion.hintsUsed}</td>
                                                    <td className="py-3 px-4">{completion.mistakesMade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Enigmas Tab */}
                    {activeTab === 'enigmas' && (
                        <div>
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-12 h-12 border-4 border-navarra-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p>{t('common.loading')}</p>
                                </div>
                            ) : enigmasCompleted.length === 0 ? (
                                <p className="text-center py-12 text-navarra-parchment/60">{t('profile.enigmas.noEnigmas')}</p>
                            ) : (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {enigmasCompleted.map((enigma) => {
                                        const enigmaData = ENIGMAS.find(e => e.id === enigma.enigmaId);
                                        return (
                                            <div key={enigma.enigmaId} className="bg-black/30 border border-navarra-gold/30 rounded-lg p-6">
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-lg font-serif text-navarra-gold">
                                                        {enigmaData ? t(enigmaData.title) : enigma.enigmaId}
                                                    </h3>
                                                    <span className="text-green-400">✓</span>
                                                </div>
                                                <p className="text-sm text-navarra-parchment/60 mb-4">
                                                    {t('profile.enigmas.completedOn')}: {formatDate(enigma.completedAt)}
                                                </p>
                                                {onNavigateToEnigma && (
                                                    <button
                                                        onClick={() => onNavigateToEnigma(enigmaData?.number?.toString() || '1')}
                                                        className="w-full px-4 py-2 bg-navarra-gold/20 border border-navarra-gold text-navarra-gold rounded hover:bg-navarra-gold hover:text-black transition"
                                                    >
                                                        {t('profile.enigmas.viewEnigma')}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
