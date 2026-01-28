import React, { useState, useEffect } from 'react';
import { db } from '../../../firebaseConfig';
import { collection, query, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

interface NewsletterSubscriber {
    id: string;
    name: string;
    email: string;
    createdAt: Timestamp;
    source?: string;
}

interface Stats {
    totalSubscribers: number;
    newThisWeek: number;
    totalUsers: number;
}

/**
 * Admin Dashboard - Main Overview Page
 */
export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats>({ totalSubscribers: 0, newThisWeek: 0, totalUsers: 0 });
    const [recentSubscribers, setRecentSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            console.log('📊 Loading dashboard data...');

            // Get all newsletter subscribers
            const newsletterRef = collection(db, 'newsletter');
            console.log('📧 Fetching newsletter collection...');
            const newsletterSnapshot = await getDocs(newsletterRef);
            console.log(`✅ Found ${newsletterSnapshot.size} newsletter subscribers`);

            const totalSubscribers = newsletterSnapshot.size;

            // Count subscribers from last 7 days
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            let newThisWeek = 0;
            const allSubscribers: any[] = [];

            newsletterSnapshot.forEach((doc) => {
                const data = doc.data();
                allSubscribers.push({ id: doc.id, ...data });

                if (data.createdAt) {
                    const createdDate = data.createdAt.toDate();
                    if (createdDate >= oneWeekAgo) {
                        newThisWeek++;
                    }
                }
            });

            console.log(`📅 New subscribers this week: ${newThisWeek}`);

            // Get total users
            const usersRef = collection(db, 'users');
            console.log('👥 Fetching users collection...');
            const usersSnapshot = await getDocs(usersRef);
            console.log(`✅ Found ${usersSnapshot.size} registered users`);

            const totalUsers = usersSnapshot.size;

            setStats({ totalSubscribers, newThisWeek, totalUsers });
            console.log('✅ Stats updated:', { totalSubscribers, newThisWeek, totalUsers });

            // Get recent subscribers (last 10) - sorted manually since we already have all data
            const sortedSubscribers = allSubscribers
                .filter(sub => sub.createdAt) // Filter out any without timestamp
                .sort((a, b) => {
                    const aTime = a.createdAt.toMillis();
                    const bTime = b.createdAt.toMillis();
                    return bTime - aTime; // Newest first
                })
                .slice(0, 10);

            setRecentSubscribers(sortedSubscribers as NewsletterSubscriber[]);
            console.log(`✅ Loaded ${sortedSubscribers.length} recent subscribers`);

        } catch (error) {
            console.error('❌ Error loading dashboard:', error);
            alert('Error al cargar datos del dashboard. Revisa la consola para más detalles.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return timestamp.toDate().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-navarra-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Cargando datos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Panel de control y estadísticas</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Suscriptores Newsletter</h3>
                        <span className="text-2xl">📧</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{stats.totalSubscribers}</p>
                    <p className="text-xs text-green-400">+{stats.newThisWeek} esta semana</p>
                </div>

                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Usuarios Registrados</h3>
                        <span className="text-2xl">👥</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500">Total en plataforma</p>
                </div>

                <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400 text-sm font-medium">Tasa de Apertura</h3>
                        <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-4xl font-bold text-white mb-1">--</p>
                    <p className="text-xs text-gray-500">Próximamente</p>
                </div>
            </div>

            {/* Recent Subscribers */}
            <div className="bg-navarra-panel border border-navarra-gold/30 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-navarra-gold/30">
                    <h2 className="text-xl font-serif text-white">Suscriptores Recientes</h2>
                </div>
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
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Origen
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navarra-gold/10">
                            {recentSubscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {sub.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {sub.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {formatDate(sub.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {sub.source || 'home_view'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                    href="/admin/email"
                    className="p-6 bg-gradient-to-r from-navarra-gold/20 to-transparent border-l-4 border-navarra-gold rounded-lg hover:bg-navarra-gold/30 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">✉️</span>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-navarra-gold transition-colors">
                                Enviar Email
                            </h3>
                            <p className="text-sm text-gray-400">Componer y enviar newsletter</p>
                        </div>
                    </div>
                </a>

                <a
                    href="/admin/newsletter"
                    className="p-6 bg-gradient-to-r from-blue-500/20 to-transparent border-l-4 border-blue-500 rounded-lg hover:bg-blue-500/30 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">👥</span>
                        <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                Ver Suscriptores
                            </h3>
                            <p className="text-sm text-gray-400">Gestionar lista completa</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    );
};
