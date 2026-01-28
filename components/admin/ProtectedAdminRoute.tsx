import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/adminCheck';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

/**
 * Protected Route Component for Admin Panel
 * Only allows access to mikeldiaz0@gmail.com
 */
export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
    const { user, userProfile, loading } = useAuth();

    // Redirect if not logged in (use effect to avoid render during render)
    useEffect(() => {
        if (!loading && !user) {
            window.history.pushState({}, '', '/');
            window.location.reload();
        }
    }, [user, loading]);

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-navarra-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-navarra-gold mx-auto mb-4"></div>
                    <p className="text-gray-400">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // Don't render anything while redirecting
    if (!user) {
        return null;
    }

    // Check admin access
    const userEmail = user.email || userProfile?.email;
    if (!isAdmin(userEmail)) {
        return (
            <div className="min-h-screen bg-navarra-dark flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-navarra-panel border border-navarra-gold/30 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-2xl font-serif text-white mb-2">Acceso Denegado</h2>
                    <p className="text-gray-400 mb-6">
                        No tienes permisos para acceder al panel de administración.
                    </p>
                    <button
                        onClick={() => {
                            window.history.pushState({}, '', '/');
                            window.location.reload();
                        }}
                        className="inline-block px-6 py-3 bg-navarra-gold text-black font-bold rounded-md hover:bg-yellow-500 transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    // User is admin, render children
    return <>{children}</>;
};
