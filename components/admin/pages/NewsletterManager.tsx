import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, query, getDocs, orderBy, limit, Timestamp, where } from 'firebase/firestore';

interface NewsletterSubscriber {
    id: string;
    name: string;
    email: string;
    createdAt: Timestamp;
    source?: string;
    language?: string;
}

interface Stats {
    totalSubscribers: number;
    newThisWeek: number;
    totalUsers: number;
}

/**
 * Newsletter Management Page
 * View, search, filter, and export all newsletter subscribers
 */
export const NewsletterManager: React.FC = () => {
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState<Stats>({ totalSubscribers: 0, newThisWeek: 0, totalUsers: 0 });

    useEffect(() => {
        loadSubscribers();
    }, []);

    useEffect(() => {
        // Filter subscribers based on search
        if (searchTerm) {
            const filtered = subscribers.filter(
                (sub) =>
                    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredSubscribers(filtered);
        } else {
            setFilteredSubscribers(subscribers);
        }
    }, [searchTerm, subscribers]);

    const loadSubscribers = async () => {
        try {
            setLoading(true);

            // Get all newsletter subscribers
            const newsletterRef = collection(db, 'newsletter');
            const newsletterSnapshot = await getDocs(newsletterRef);

            const allSubscribers: NewsletterSubscriber[] = [];
            newsletterSnapshot.forEach((doc) => {
                allSubscribers.push({ id: doc.id, ...doc.data() } as NewsletterSubscriber);
            });

            // Sort by date (newest first)
            allSubscribers.sort((a, b) => {
                const aTime = a.createdAt?.toMillis() || 0;
                const bTime = b.createdAt?.toMillis() || 0;
                return bTime - aTime;
            });

            setSubscribers(allSubscribers);
            setFilteredSubscribers(allSubscribers);

            // Calculate stats
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const newThisWeek = allSubscribers.filter(
                (sub) => sub.createdAt?.toDate() >= oneWeekAgo
            ).length;

            // Get total users
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);

            setStats({
                totalSubscribers: allSubscribers.length,
                newThisWeek,
                totalUsers: usersSnapshot.size,
            });

        } catch (error) {
            console.error('Error loading subscribers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp || !timestamp.toDate) return 'N/A';
        return timestamp.toDate().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const exportToCSV = () => {
        if (filteredSubscribers.length === 0) {
            alert('No hay suscriptores para exportar');
            return;
        }

        const headers = ['Nombre', 'Email', 'Fecha', 'Origen', 'Idioma'];
        const rows = filteredSubscribers.map((sub) => [
            sub.name,
            sub.email,
            formatDate(sub.createdAt),
            sub.source || 'home_view',
            sub.language || 'es',
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-navarra-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando suscriptores...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-white mb-2">Newsletter Subscribers</h1>
                <p className="text-gray-400">Gestión de suscriptores de la newsletter</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Suscriptores</h3>
                    <p className="text-4xl font-bold text-white">{stats.totalSubscribers}</p>
                </div>
                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Nuevos (7 días)</h3>
                    <p className="text-4xl font-bold text-green-400">{stats.newThisWeek}</p>
                </div>
                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Usuarios Registrados</h3>
                    <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
                </div>
            </div>

            {/* Search and Export */}
            <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-black/50 border border-navarra-gold/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-navarra-gold"
                        />
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="px-6 py-2 bg-navarra-gold text-black font-bold rounded-md hover:bg-yellow-500 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar CSV
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    Mostrando {filteredSubscribers.length} de {stats.totalSubscribers} suscriptores
                </p>
            </div>

            {/* Subscribers Table */}
            <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black/20">
                            <tr className="text-left">
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Fecha de Registro
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Origen
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Idioma
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navarra-gold/10">
                            {filteredSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm ? 'No se encontraron resultados' : 'No hay suscriptores todavía'}
                                    </td>
                                </tr>
                            ) : (
                                filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">
                                            {sub.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {sub.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                            {formatDate(sub.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs">
                                                {sub.source || 'home_view'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {sub.language || 'es'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
