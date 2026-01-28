import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface OldComputerProps {
    onSolved?: () => void;
    onClose?: () => void;
    isModal?: boolean;
}

type FileType = 'notes' | 'map' | 'access' | 'pdf_calle_mayor' | 'plano1' | 'plano2' | 'transport' | null;

const OldComputer: React.FC<OldComputerProps> = ({ onSolved, onClose, isModal = false }) => {
    const { t } = useTranslation();
    const [openFile, setOpenFile] = useState<FileType>(null);
    const [filesOpened, setFilesOpened] = useState<Set<string>>(new Set());
    const [showAccessError, setShowAccessError] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);

    // State for transport input
    const [transportInput, setTransportInput] = useState('');
    const [showTransportError, setShowTransportError] = useState(false);
    const [destinoSolved, setDestinoSolved] = useState(() => {
        return localStorage.getItem('ega98_destino_solved') === 'true';
    });

    const handleFileClick = (file: FileType) => {
        if (file === 'access') {
            setShowAccessError(true);
            setTimeout(() => setShowAccessError(false), 3000);
            return;
        }
        setOpenFile(file);
        if (file) {
            setFilesOpened(prev => new Set([...prev, file]));
        }
    };

    const handleCloseFile = () => {
        setOpenFile(null);
        // Check if important files have been opened (optional logic)
    };

    const handleContinue = () => {
        if (onSolved) {
            onSolved();
        }
    };

    const handleOpenCalleMayor = () => {
        setOpenFile('pdf_calle_mayor');
    };

    const handleTransportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const normalizedInput = transportInput.toLowerCase().trim();
        if (normalizedInput.includes('estacion') || normalizedInput.includes('autobus') || normalizedInput.includes('estación')) {
            // Correct answer - save and unlock next stage
            localStorage.setItem('ega98_destino_solved', 'true');
            setDestinoSolved(true);
            // Dispatch event to notify other components
            window.dispatchEvent(new Event('destino_solved'));
            if (onSolved) onSolved();
        } else {
            setShowTransportError(true);
            setTimeout(() => setShowTransportError(false), 2000);
        }
    };

    // Desktop Icon Component
    const DesktopIcon = ({
        icon,
        label,
        onClick,
        disabled = false
    }: {
        icon: string;
        label: string;
        onClick: () => void;
        disabled?: boolean;
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex flex-col items-center gap-2 p-3 rounded hover:bg-[#000080]/50 transition-colors group ${disabled ? 'opacity-60 cursor-not-allowed' : ''
                }`}
        >
            <span className="text-4xl group-hover:scale-110 transition-transform">{icon}</span>
            <span className={`text-sm text-center px-2 py-0.5 ${disabled ? 'text-gray-500' : 'text-white bg-[#000080] group-hover:bg-[#0000aa]'
                }`}>
                {label}
            </span>
        </button>
    );

    // Window Component
    const Window = ({
        title,
        children,
        onClose,
        className = ""
    }: {
        title: string;
        children: React.ReactNode;
        onClose: () => void;
        className?: string;
    }) => (
        <div className={`fixed inset-4 md:inset-12 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-700 border-r-gray-700 shadow-2xl flex flex-col z-50 ${className}`}>
            {/* Title Bar */}
            <div className="bg-[#000080] text-white px-2 py-1 flex items-center justify-between shrink-0">
                <span className="font-bold text-sm truncate pr-4">{title}</span>
                <button
                    onClick={onClose}
                    className="bg-[#c0c0c0] text-black w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-t-white border-l-white border-b-gray-700 border-r-gray-700 hover:bg-[#d0d0d0]"
                >
                    ✕
                </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-auto bg-white p-4 font-mono text-sm relative">
                {children}
            </div>
        </div>
    );

    // File Contents
    const renderFileContent = () => {
        switch (openFile) {
            case 'notes':
                return (
                    <Window title="NOTAS_98.txt - Bloc de notas" onClose={handleCloseFile}>
                        <div className="text-black leading-relaxed font-mono">
                            <pre className="whitespace-pre-wrap">
                                {t('ega98.computer.notes', `Tengo andenes pero no toco el mar,
tengo bancos pero no soy para ahorrar.

Gigantes de hierro entran a dormir,
recogen personas y vuelven a salir.

Si quieres marcharte, aquí has de venir.`)}
                            </pre>
                        </div>
                    </Window>
                );
            case 'transport':
                return (
                    <Window title="DESTINO.exe - Sistema de Transporte" onClose={handleCloseFile} className="!bg-[#008080]">
                        <div className="flex flex-col items-center justify-center p-6 text-white h-full">
                            <div className="mb-6 text-center">
                                <h3 className="text-xl font-bold mb-2">SISTEMA INTEGRADO DE TRANSPORTE</h3>
                                <p className="text-sm">Introduce el destino del enigma:</p>
                            </div>

                            <form onSubmit={handleTransportSubmit} className="w-full max-w-xs flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={transportInput}
                                    onChange={(e) => setTransportInput(e.target.value)}
                                    placeholder="¿Donde empezamos la misión?"
                                    className="w-full p-2 text-black font-mono text-center uppercase border-2 border-gray-400 focus:outline-none focus:border-white"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="bg-gray-300 text-black font-bold py-2 border-2 border-white border-b-gray-600 border-r-gray-600 active:border-t-gray-600 active:border-l-gray-600 active:border-b-white active:border-r-white"
                                >
                                    ACCEDER
                                </button>
                            </form>

                            {showTransportError && (
                                <div className="mt-4 bg-red-600 text-white px-4 py-2 font-bold animate-pulse">
                                    DESTINO INCORRECTO
                                </div>
                            )}
                        </div>
                    </Window>
                );
            case 'map':
                return (
                    <Window title="ESTELLA.bmp - Visor de imágenes" onClose={handleCloseFile}>
                        <div className="flex flex-col items-center">
                            {/* Simple schematic map */}
                            <div className="bg-white border-2 border-black p-8 mb-4">
                                <svg viewBox="0 0 300 200" className="w-full max-w-md">
                                    {/* Grid lines */}
                                    <line x1="50" y1="50" x2="250" y2="50" stroke="#888" strokeWidth="2" />
                                    <line x1="50" y1="100" x2="200" y2="100" stroke="#888" strokeWidth="2" />
                                    <line x1="100" y1="150" x2="250" y2="150" stroke="#888" strokeWidth="2" />
                                    <line x1="50" y1="50" x2="50" y2="150" stroke="#888" strokeWidth="2" />
                                    <line x1="150" y1="50" x2="150" y2="150" stroke="#888" strokeWidth="2" />
                                    <line x1="250" y1="50" x2="250" y2="150" stroke="#888" strokeWidth="2" />
                                    {/* Large rectangle (main building) */}
                                    <rect x="80" y="70" width="80" height="50" fill="none" stroke="black" strokeWidth="3" />
                                    {/* Marked point */}
                                    <circle cx="120" cy="95" r="8" fill="red" />
                                    <text x="120" y="130" textAnchor="middle" className="text-xs" fill="black">●</text>
                                </svg>
                            </div>
                            <div className="text-black mt-4 text-center space-y-2">
                                <p className="italic text-gray-600">
                                    {t('ega98.computer.mapNote', '1998 ≠ ahora')}
                                </p>
                                <p className="font-bold border-t pt-4">
                                    "{t('ega98.computer.mapQuote', 'Las ciudades cambian de nombre antes que de forma.')}"
                                </p>
                            </div>
                        </div>
                    </Window>
                );
            case 'pdf_calle_mayor':
                return (
                    <Window title="CALLE_MAYOR.pdf - Visor PDF" onClose={handleCloseFile} className="!bg-[#505050]">
                        <iframe
                            src="https://www.revistacallemayor.es/documentos/revistas/148.pdf"
                            className="w-full h-full border- none"
                            title="Calle Mayor PDF"
                        />
                    </Window>
                );
            case 'plano1':
                return (
                    <Window title="PLANO_1.png - Visor de imágenes" onClose={handleCloseFile}>
                        <div className="flex items-center justify-center min-h-full bg-gray-100">
                            <img src="/plano1.png" alt="Plano 1" className="max-w-full max-h-full object-contain shadow-lg" />
                        </div>
                    </Window>
                );
            case 'plano2':
                return (
                    <Window title="PLANO_2.png - Visor de imágenes" onClose={handleCloseFile}>
                        <div className="flex items-center justify-center min-h-full bg-gray-100">
                            <img src="/plano2.png" alt="Plano 2" className="max-w-full max-h-full object-contain shadow-lg" />
                        </div>
                    </Window>
                );
            default:
                return null;
        }
    };

    // Access Error Popup
    const AccessError = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-700 border-r-gray-700 p-1 max-w-sm">
                <div className="bg-[#000080] text-white px-2 py-1 flex items-center gap-2 mb-2">
                    <span>❌</span>
                    <span className="font-bold text-sm">Error</span>
                </div>
                <div className="bg-[#c0c0c0] p-4 flex gap-4">
                    <span className="text-4xl">⛔</span>
                    <div className="text-sm">
                        <p className="font-bold mb-2">{t('ega98.computer.accessBlocked', 'ACCESO BLOQUEADO.')}</p>
                        <p className="text-gray-700">{t('ega98.computer.noPosition', 'Sin posición inicial.')}</p>
                        <div className="mt-4 p-2 bg-white border border-gray-400 text-xs">
                            <p className="font-bold">{t('ega98.computer.startPoint', 'PUNTO DE PARTIDA:')}</p>
                            <p className="italic mt-1">{t('ega98.computer.startPointHint', 'Donde todo el mundo entra y sale. Pero nadie se queda.')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // Final Message Popup (Not currently used but kept for logic structure if needed)
    const FinalMessage = () => null;

    return (
        <div
            className={`${isModal ? 'fixed inset-0 z-50' : 'min-h-screen'
                } bg-[#008080] relative overflow-hidden flex flex-col`}
            style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif' }}
        >
            {/* Close Button (Only in Modal Mode) */}
            {isModal && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-700 border-r-gray-700 w-12 h-12 flex items-center justify-center text-xl font-bold hover:bg-[#d0d0d0] transition-colors shadow-lg group"
                    title={t('common.close', 'Cerrar')}
                >
                    <span className="group-hover:scale-125 transition-transform">✕</span>
                </button>
            )}

            {/* CRT Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />

            {/* Path Header */}
            <div className="bg-[#c0c0c0] border-b-2 border-gray-700 px-4 py-2 flex items-center justify-between shrink-0">
                <p className="font-mono text-sm text-black">
                    C:\USERS\CAPI\DESKTOP\
                </p>
            </div>

            {/* Desktop Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-6 grid grid-cols-3 gap-4 max-w-md">
                    <DesktopIcon
                        icon="🗂️"
                        label="NOTAS_98.txt"
                        onClick={() => handleFileClick('notes')}
                    />
                    <DesktopIcon
                        icon="🗺️"
                        label="ESTELLA.bmp"
                        onClick={() => handleFileClick('map')}
                    />
                    <DesktopIcon
                        icon="📰"
                        label="CALLE_MAYOR.pdf"
                        onClick={handleOpenCalleMayor}
                    />
                    <DesktopIcon
                        icon="📄"
                        label="PLANO_1.png"
                        onClick={() => setOpenFile('plano1')}
                    />
                    <DesktopIcon
                        icon="📄"
                        label="PLANO_2.png"
                        onClick={() => setOpenFile('plano2')}
                    />
                    {!destinoSolved && (
                        <DesktopIcon
                            icon="🚌"
                            label="DESTINO.exe"
                            onClick={() => handleFileClick('transport')}
                        />
                    )}
                    <DesktopIcon
                        icon="❌"
                        label="ACCESO.exe"
                        onClick={() => handleFileClick('access')}
                        disabled={true}
                    />
                </div>

                {/* Instructions */}
                <div className="text-center px-4 pb-6">
                    <p className="text-white/60 text-sm font-mono">
                        {t('ega98.computer.instruction', 'Haz clic en los archivos para explorar')}
                    </p>
                </div>
            </div>

            {/* Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 bg-[#c0c0c0] border-t-2 border-white h-10 flex items-center px-2 shrink-0">
                <button className="bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-gray-700 border-r-gray-700 px-4 py-1 flex items-center gap-2 text-sm font-bold">
                    <span className="text-xl">🪟</span>
                    {t('ega98.computer.start', 'Inicio')}
                </button>
                <div className="flex-1" />
                <div className="bg-[#c0c0c0] border-t-gray-700 border-l-gray-700 border-b-white border-r-white px-3 py-1 text-sm">
                    23:58
                </div>
            </div>

            {/* File Windows */}
            {openFile && renderFileContent()}

            {/* Access Error Popup */}
            {showAccessError && <AccessError />}
        </div>
    );
};

export default OldComputer;
