import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EmailInboxProps {
    onSolved: () => void;
    onExit?: () => void;
}

interface Email {
    id: string;
    from: string;
    subject: string;
    date: string;
    preview: string;
    body: string;
    isRead: boolean;
    hasVideo: boolean;
    videoId?: string;
}

const EmailInbox: React.FC<EmailInboxProps> = ({ onSolved, onExit }) => {
    const { t, i18n } = useTranslation();
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [hasWatchedVideo, setHasWatchedVideo] = useState(false);

    // Auto-skip if email already completed
    useEffect(() => {
        const emailCompleted = localStorage.getItem('ega98_email_completed') === 'true';
        if (emailCompleted) {
            onSolved();
        }
    }, [onSolved]);

    // Video IDs per language
    const VIDEO_IDS = {
        es: 'PLACEHOLDER_TESTAMENT_ES',
        en: 'PLACEHOLDER_TESTAMENT_EN',
        eu: 'PLACEHOLDER_TESTAMENT_EU'
    };

    const getVideoId = () => {
        const lang = i18n.language.substring(0, 2) as keyof typeof VIDEO_IDS;
        return VIDEO_IDS[lang] || VIDEO_IDS.es;
    };

    const emails: Email[] = [
        {
            id: 'testament',
            from: 'El Capi <nocturno@estella98.net>',
            subject: t('ega98.email.subject', 'No era dinero. Era tiempo.'),
            date: '16/12/2024',
            preview: t('ega98.email.preview', 'Si estás viendo esto, es que he muerto...'),
            body: t('ega98.email.body', `Si estás leyendo esto, es que he muerto.
Y si te hablo a ti… es porque eras el único limpio.

En el 98 hubo un robo.
No salió en prensa.
No hubo culpables.
Y nadie se llevó el dinero.

El dinero sigue existiendo.
Nunca estuvo perdido.
Nunca estuvo en manos de uno solo.

El acceso sigue bloqueado.
Si crees que puedes abrirlo… empieza.

Hay un video adjunto. Míralo.

- El Capi`),
            isRead: false,
            hasVideo: true,
            videoId: getVideoId()
        }
    ];

    const handleEmailClick = (email: Email) => {
        setSelectedEmail(email);
    };

    const handleWatchVideo = () => {
        setShowVideo(true);
    };

    const handleVideoEnd = () => {
        setHasWatchedVideo(true);
        setShowVideo(false);
    };

    const handleContinue = () => {
        localStorage.setItem('ega98_email_completed', 'true');
        onSolved();
    };

    // Video Player View
    if (showVideo) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                    <h2 className="text-gray-400 text-sm mb-4 font-mono">
                        📹 {t('ega98.email.videoTitle', 'VIDEO ADJUNTO - ÚLTIMA GRABACIÓN')}
                    </h2>
                    <div className="aspect-video bg-gray-900 border border-gray-700 rounded overflow-hidden mb-6">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${selectedEmail?.videoId}?autoplay=1&rel=0`}
                            title="El Capi Testament"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>
                    <button
                        onClick={handleVideoEnd}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded font-mono text-sm transition-colors"
                    >
                        {t('ega98.email.closeVideo', 'Cerrar Video ✕')}
                    </button>
                </div>
            </div>
        );
    }

    // Email Detail View
    if (selectedEmail) {
        return (
            <div className="min-h-screen max-h-screen overflow-y-auto bg-[#1a1a2e] text-gray-200 font-mono">
                {/* Email Header */}
                <div className="bg-[#16213e] border-b border-gray-700 p-4">
                    <button
                        onClick={() => setSelectedEmail(null)}
                        className="text-gray-400 hover:text-white mb-4 flex items-center gap-2"
                    >
                        ← {t('ega98.email.backToInbox', 'Volver a Bandeja')}
                    </button>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm w-16">De:</span>
                            <span className="text-green-400">{selectedEmail.from}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm w-16">Asunto:</span>
                            <span className="text-white font-bold">{selectedEmail.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm w-16">Fecha:</span>
                            <span className="text-gray-400">{selectedEmail.date}</span>
                        </div>
                    </div>
                </div>

                {/* Email Body */}
                <div className="p-6 max-w-3xl mx-auto">
                    <div className="bg-[#0f0f23] border border-gray-700 rounded-lg p-6 mb-6 max-h-60 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                            {selectedEmail.body}
                        </pre>
                    </div>

                    {/* Video Attachment */}
                    {selectedEmail.hasVideo && (
                        <div className="bg-gray-900 border border-red-900/50 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">📎</span>
                                <div>
                                    <p className="text-gray-300 font-bold">
                                        {t('ega98.email.attachment', 'Archivo adjunto')}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        ultima_grabacion.mp4
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleWatchVideo}
                                className="w-full bg-red-900/50 hover:bg-red-800 text-red-100 py-3 px-4 rounded transition-colors flex items-center justify-center gap-2"
                            >
                                <span>▶</span>
                                {t('ega98.email.watchVideo', 'Reproducir Video')}
                            </button>
                        </div>
                    )}

                    {/* Continue Button (only after watching video) */}
                    {hasWatchedVideo && (
                        <button
                            onClick={handleContinue}
                            className="w-full bg-green-900/50 hover:bg-green-800 text-green-100 py-4 px-6 rounded-lg transition-colors font-bold animate-pulse"
                        >
                            {t('ega98.email.continue', 'Continuar ►')}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Inbox List View
    return (
        <div className="min-h-screen max-h-screen overflow-y-auto bg-[#1a1a2e] text-gray-200 font-mono">
            {/* Header with Back Button */}
            <div className="bg-[#16213e] border-b border-gray-700 p-4">
                {onExit && (
                    <button
                        onClick={onExit}
                        className="text-gray-400 hover:text-white mb-3 flex items-center gap-2 text-sm"
                    >
                        ← {t('common.backToHome', 'Volver al Inicio')}
                    </button>
                )}
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📧</span>
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {t('ega98.email.inbox', 'Bandeja de Entrada')}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            {t('ega98.email.unread', '1 mensaje sin leer')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Email List */}
            <div className="p-4 space-y-2">
                {emails.map((email) => (
                    <button
                        key={email.id}
                        onClick={() => handleEmailClick(email)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${email.isRead
                            ? 'bg-gray-800/50 border-gray-700'
                            : 'bg-[#0f0f23] border-red-900/50 hover:border-red-700 shadow-lg shadow-red-900/20'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {!email.isRead && (
                                <span className="w-3 h-3 bg-red-500 rounded-full mt-1.5 animate-pulse" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`font-bold truncate ${email.isRead ? 'text-gray-400' : 'text-green-400'}`}>
                                        {email.from}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                        {email.date}
                                    </span>
                                </div>
                                <p className={`font-bold mb-1 ${email.isRead ? 'text-gray-400' : 'text-white'}`}>
                                    {email.subject}
                                </p>
                                <p className="text-gray-500 text-sm truncate">
                                    {email.preview}
                                </p>
                                {email.hasVideo && (
                                    <span className="inline-flex items-center gap-1 text-red-400 text-xs mt-2">
                                        📎 {t('ega98.email.hasAttachment', 'Contiene archivo adjunto')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Hint */}
            <div className="p-4 text-center">
                <p className="text-gray-600 text-sm italic">
                    {t('ega98.email.hint', 'Haz clic en el mensaje para abrirlo')}
                </p>
            </div>
        </div>
    );
};

export default EmailInbox;
