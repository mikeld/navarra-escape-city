
import React, { useState, useEffect } from 'react';
import { CHARACTERS, PLACES_INFO } from '../constants';
import { uploadAsset, fetchDynamicContent, fetchResourceConfig } from '../services/gameService';
import { SafeImage } from './UIComponents';

export const AssetManager: React.FC = () => {
    const [uploading, setUploading] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const [uploadedResources, setUploadedResources] = useState<Record<string, boolean>>({});
    
    // Estado local para visualizar los cambios inmediatamente
    const [previewImages, setPreviewImages] = useState<Record<string, string>>({});

    // Cargar imágenes actuales de la DB
    useEffect(() => {
        const loadCurrentData = async () => {
            const data = await fetchDynamicContent();
            const map: Record<string, string> = {};
            data.characters.forEach(c => map[c.id] = c.image);
            data.places.forEach(p => map[p.id] = p.image);
            setPreviewImages(map);

            const resources = await fetchResourceConfig();
            setUploadedResources({
                video_main: !!resources['video_main'],
                audio_summary: !!resources['audio_summary']
            });
        };
        loadCurrentData();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, id: string, folder: 'characters' | 'places' | 'resources') => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        // Validar tamaño (video puede ser grande, imagenes max 5mb)
        const limit = folder === 'resources' ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
        
        if (file.size > limit) {
             setMessage({ text: `El archivo es demasiado grande (Máx ${folder === 'resources' ? '50MB' : '5MB'})`, type: 'error' });
             return;
        }

        setUploading(id);
        setMessage(null);

        const result = await uploadAsset(file, folder, id);

        if (result.success && result.url) {
            setMessage({ text: `✅ ${file.name} subido correctamente!`, type: 'success' });
            if (folder !== 'resources') {
                setPreviewImages(prev => ({ ...prev, [id]: result.url! }));
            } else {
                setUploadedResources(prev => ({ ...prev, [id]: true }));
            }
        } else {
            setMessage({ text: `❌ Error: ${result.message}`, type: 'error' });
        }
        setUploading(null);
    };

    return (
        <div className="bg-navarra-dark p-6 rounded-lg border border-navarra-gold/30 mt-8 max-w-4xl mx-auto text-left">
            <h3 className="text-xl font-serif text-navarra-gold mb-6 border-b border-navarra-gold/20 pb-2">
                📸 Gestor de Archivos (Firebase Storage)
            </h3>
            
            {message && (
                <div className={`p-3 mb-4 rounded text-sm font-bold ${message.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-12">
                
                {/* RECURSOS DIDÁCTICOS (NUEVO) */}
                <div className="bg-blue-900/20 p-4 rounded border border-blue-800">
                    <h4 className="text-blue-300 uppercase tracking-widest text-xs font-bold mb-4">Recursos Didácticos (Video/Audio)</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center justify-between">
                                Video Principal (video.mp4)
                                {uploadedResources['video_main'] && <span className="text-green-400 text-xs bg-green-900/40 px-2 py-0.5 rounded">✅ Subido</span>}
                            </label>
                            <input 
                                type="file" 
                                accept="video/mp4"
                                disabled={uploading !== null}
                                onChange={(e) => handleFileChange(e, 'video_main', 'resources')}
                                className="text-xs text-gray-400"
                            />
                            {uploading === 'video_main' && <span className="text-xs animate-pulse text-navarra-gold">Subiendo video...</span>}
                        </div>
                         <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center justify-between">
                                Audio Resumen (resumen.m4a)
                                {uploadedResources['audio_summary'] && <span className="text-green-400 text-xs bg-green-900/40 px-2 py-0.5 rounded">✅ Subido</span>}
                            </label>
                            <input 
                                type="file" 
                                accept="audio/*"
                                disabled={uploading !== null}
                                onChange={(e) => handleFileChange(e, 'audio_summary', 'resources')}
                                className="text-xs text-gray-400"
                            />
                             {uploading === 'audio_summary' && <span className="text-xs animate-pulse text-navarra-gold">Subiendo audio...</span>}
                        </div>
                    </div>
                </div>

                {/* PERSONAJES */}
                <div>
                    <h4 className="text-navarra-parchment uppercase tracking-widest text-xs font-bold mb-4">Personajes</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        {Object.values(CHARACTERS).map(char => (
                            <div key={char.id} className="flex items-center gap-4 bg-black/30 p-3 rounded border border-gray-800">
                                <div className="w-16 h-16 shrink-0 relative">
                                    <SafeImage src={previewImages[char.id] || char.image} alt={char.name} className="w-full h-full object-cover rounded" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-navarra-gold font-bold truncate">{char.name}</p>
                                    <div className="relative mt-2">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            disabled={uploading !== null}
                                            onChange={(e) => handleFileChange(e, char.id, 'characters')}
                                            className="text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-navarra-gold/10 file:text-navarra-gold hover:file:bg-navarra-gold/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LUGARES */}
                <div>
                    <h4 className="text-navarra-parchment uppercase tracking-widest text-xs font-bold mb-4">Lugares y Monumentos</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        {PLACES_INFO.map(place => (
                            <div key={place.id} className="flex items-center gap-4 bg-black/30 p-3 rounded border border-gray-800">
                                <div className="w-16 h-16 shrink-0 relative">
                                    <SafeImage src={previewImages[place.id] || place.image} alt={place.name} className="w-full h-full object-cover rounded" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-navarra-gold font-bold truncate">{place.name}</p>
                                    <div className="relative mt-2">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            disabled={uploading !== null}
                                            onChange={(e) => handleFileChange(e, place.id, 'places')}
                                            className="text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-navarra-gold/10 file:text-navarra-gold hover:file:bg-navarra-gold/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
