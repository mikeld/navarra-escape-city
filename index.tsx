import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import './i18n'; // Initialize i18next
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-navarra-gold">
        <div className="w-12 h-12 border-4 border-navarra-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-serif tracking-widest uppercase animate-pulse">Cargando...</p>
      </div>
    }>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Suspense>
  </React.StrictMode>
);