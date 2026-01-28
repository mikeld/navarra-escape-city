import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminDashboard } from './pages/AdminDashboard';
import { NewsletterManager } from './pages/NewsletterManager';
import { EmailComposer } from './pages/EmailComposer';
import { AnalyticsDashboard } from './pages/AnalyticsDashboard';
import { MemoriesManager } from './pages/MemoriesManager';

/**
 * Admin Panel Layout with Sidebar Navigation
 */
export const AdminLayout: React.FC = () => {
    const { userProfile, signOut } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const path = window.location.pathname.replace(/\/$/, '') || '/admin';

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/newsletter', label: 'Newsletter', icon: '📧' },
        { path: '/admin/email', label: 'Enviar Email', icon: '✉️' },
        { path: '/admin/memories', label: 'Recuerdos', icon: '🧠' },
        { path: '/admin/analytics', label: 'Analíticas', icon: '📈' },
    ];

    const isActive = (navPath: string) => {
        if (navPath === '/admin') {
            return path === navPath;
        }
        return path.startsWith(navPath);
    };

    const navigate = (to: string) => {
        window.history.pushState({}, '', to);
        window.location.reload();
    };

    // Render appropriate page based on path
    const renderPage = () => {
        if (path === '/admin/newsletter') return <NewsletterManager />;
        if (path === '/admin/email') return <EmailComposer />;
        if (path === '/admin/memories') return <MemoriesManager />;
        if (path === '/admin/analytics') return <AnalyticsDashboard />;
        return <AdminDashboard />;
    };

    return (
        <div className="min-h-screen bg-navarra-dark flex">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-navarra-panel border-r border-navarra-gold/30 transition-all duration-300 flex flex-col`}
            >
                {/* Header */}
                <div className="p-6 border-b border-navarra-gold/30">
                    <div className="flex items-center justify-between">
                        {sidebarOpen && (
                            <h1 className="text-xl font-serif text-navarra-gold font-bold">
                                Admin Panel
                            </h1>
                        )}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {sidebarOpen ? '◀' : '▶'}
                        </button>
                    </div>
                </div>

                {/* Home Button */}
                <div className="p-4 border-b border-navarra-gold/30">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-navarra-gold/10 border border-navarra-gold/50 text-navarra-gold hover:bg-navarra-gold/20 transition-all"
                    >
                        <span className="text-2xl">🏠</span>
                        {sidebarOpen && (
                            <span className="font-medium">Volver a Home</span>
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                ? 'bg-navarra-gold/20 text-navarra-gold border border-navarra-gold/50'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            {sidebarOpen && (
                                <span className="font-medium">{item.label}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-navarra-gold/30">
                    {sidebarOpen ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-navarra-gold/20 rounded-full flex items-center justify-center text-navarra-gold font-bold">
                                    {userProfile?.displayName?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {userProfile?.displayName || 'Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {userProfile?.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="w-full px-4 py-2 bg-red-900/20 border border-red-500/50 text-red-400 rounded-md hover:bg-red-900/40 transition-colors text-sm font-medium"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signOut()}
                            className="w-full p-2 text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                            title="Cerrar Sesión"
                        >
                            🚪
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {renderPage()}
            </main>
        </div>
    );
};
