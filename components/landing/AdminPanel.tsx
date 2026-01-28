import React, { useState } from 'react';
import { Button } from '../UIComponents';
import { seedDatabase, fetchDynamicContent } from '../../services/gameService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onDataUpdated }) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [confirmingSync, setConfirmingSync] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncClick = () => {
    setConfirmingSync(true);
    setSyncMessage(null);
  };

  const handleCancelSync = () => {
    setConfirmingSync(false);
  };

  const handleConfirmSync = async () => {
    setConfirmingSync(false);
    setIsSeeding(true);
    setSyncMessage("Sincronizando...");

    const result = await seedDatabase();

    setSyncMessage(result.message);
    setIsSeeding(false);

    // Notificar al padre para recargar datos
    if (result.success) {
      onDataUpdated();
    }

    setTimeout(() => {
      setSyncMessage(null);
    }, 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 bg-gray-900/90 p-6 rounded-lg border border-gray-800 max-w-2xl md:absolute md:bottom-16 md:right-0 md:w-[500px] z-50 shadow-2xl animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400 text-xs">Panel de Gestión (Solo Textos)</p>
        <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
      </div>

      <div className="flex gap-4 mb-4">
        {!confirmingSync ? (
          <button
            onClick={handleSyncClick}
            disabled={isSeeding}
            className={`
              flex-1 py-3 px-6 rounded font-bold uppercase tracking-widest text-xs transition-all duration-300
              ${isSeeding
                ? 'bg-gray-700 text-gray-400 cursor-wait'
                : 'bg-red-900/80 hover:bg-red-700 text-red-100 border border-red-800'}
            `}
          >
            {isSeeding ? '⏳ Sincronizando...' : '1. Sincronizar Textos (JSON)'}
          </button>
        ) : (
          <div className="flex-1 flex gap-2">
            <Button variant="secondary" onClick={handleCancelSync} className="w-1/2 py-2 text-xs">Cancelar</Button>
            <Button variant="danger" onClick={handleConfirmSync} className="w-1/2 py-2 text-xs">Confirmar</Button>
          </div>
        )}
      </div>

      {syncMessage && (
        <div className={`text-xs p-2 rounded border mb-4 ${syncMessage.includes('Error') ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}`}>
          {syncMessage}
        </div>
      )}

      <p className="text-[10px] text-gray-600 italic mt-2">
        Nota: La subida de imágenes se ha deshabilitado para mantener la aplicación ligera. 
        Gestionar assets multimedia directamente desde la consola de Firebase.
      </p>
    </div>
  );
};