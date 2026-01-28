
import React, { useState, useEffect } from 'react';
import { getMemories, addMemory, updateMemory, deleteMemory, Memory } from '../../../services/memoriesService';

export const MemoriesManager: React.FC = () => {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        protagonist: '',
        description: '',
        youtubeUrl: ''
    });

    useEffect(() => {
        loadMemories();
    }, []);

    const loadMemories = async () => {
        setLoading(true);
        try {
            const data = await getMemories();
            setMemories(data);
        } catch (error) {
            console.error("Error loading memories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMemory) {
                await updateMemory(editingMemory.id, formData);
                alert("Recuerdo actualizado correctamente");
            } else {
                await addMemory(formData);
                alert("Recuerdo creado correctamente");
            }
            setEditingMemory(null);
            setFormData({ title: '', protagonist: '', description: '', youtubeUrl: '' });
            loadMemories();
        } catch (error) {
            alert("Error al guardar el recuerdo");
        }
    };

    const handleEdit = (memory: Memory) => {
        setEditingMemory(memory);
        setFormData({
            title: memory.title,
            protagonist: memory.protagonist,
            description: memory.description,
            youtubeUrl: memory.youtubeUrl
        });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este recuerdo?")) {
            try {
                await deleteMemory(id);
                loadMemories();
            } catch (error) {
                alert("Error al eliminar");
            }
        }
    };

    const handleCancel = () => {
        setEditingMemory(null);
        setFormData({ title: '', protagonist: '', description: '', youtubeUrl: '' });
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-serif text-navarra-gold mb-8">Gestión de Recuerdos</h2>

            {/* Form */}
            <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6 mb-8">
                <h3 className="text-xl text-white mb-4">{editingMemory ? 'Editar Recuerdo' : 'Nuevo Recuerdo'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Título</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-navarra-gold/30 rounded p-2 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Protagonista</label>
                            <input
                                type="text"
                                name="protagonist"
                                value={formData.protagonist}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-navarra-gold/30 rounded p-2 text-white"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full bg-black/40 border border-navarra-gold/30 rounded p-2 text-white h-24"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Enlace YouTube</label>
                        <input
                            type="text"
                            name="youtubeUrl"
                            value={formData.youtubeUrl}
                            onChange={handleInputChange}
                            placeholder="https://youtu.be/..."
                            className="w-full bg-black/40 border border-navarra-gold/30 rounded p-2 text-white"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        {editingMemory && (
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-navarra-gold text-navarra-dark font-bold rounded hover:bg-white transition-colors"
                        >
                            {editingMemory ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-black/40 text-navarra-gold uppercase text-xs">
                        <tr>
                            <th className="p-4">Título</th>
                            <th className="p-4">Protagonista</th>
                            <th className="p-4">Video</th>
                            <th className="p-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-navarra-gold/10">
                        {loading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">Cargando...</td></tr>
                        ) : memories.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-gray-500">No hay recuerdos registrados</td></tr>
                        ) : (
                            memories.map((memory) => (
                                <tr key={memory.id} className="text-gray-300 hover:bg-white/5">
                                    <td className="p-4 font-bold">{memory.title}</td>
                                    <td className="p-4">{memory.protagonist}</td>
                                    <td className="p-4">
                                        <a href={memory.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm truncate max-w-[200px] block">
                                            {memory.youtubeUrl}
                                        </a>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(memory)}
                                            className="text-navarra-gold hover:text-white"
                                            title="Editar"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(memory.id)}
                                            className="text-red-400 hover:text-red-300"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
