import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { isValidEmail, validatePasswordStrength } from '../../services/authService';

type AuthView = 'login' | 'register' | 'reset';

interface LoginPageProps {
    onBack: () => void;
    onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess }) => {
    const { t } = useTranslation();
    const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!isValidEmail(email)) {
            setError(t('auth.errors.invalidEmail'));
            return;
        }

        if (view === 'reset') {
            // Password reset
            setLoading(true);
            try {
                await resetPassword(email);
                setSuccess(t('auth.reset.successMessage'));
                setEmail('');
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
            return;
        }

        if (!password || password.length < 6) {
            setError(t('auth.errors.weakPassword'));
            return;
        }

        if (view === 'register') {
            // Registration validation
            if (!displayName || displayName.trim().length < 2) {
                setError(t('auth.errors.nameRequired'));
                return;
            }

            if (password !== confirmPassword) {
                setError(t('auth.errors.passwordMismatch'));
                return;
            }

            const passwordCheck = validatePasswordStrength(password);
            if (!passwordCheck.isValid) {
                setError(passwordCheck.message);
                return;
            }
        }

        setLoading(true);
        try {
            if (view === 'login') {
                await signIn(email, password);
                if (onLoginSuccess) onLoginSuccess();
            } else {
                await signUp(email, password, displayName);
                if (onLoginSuccess) onLoginSuccess();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            await signInWithGoogle();
            if (onLoginSuccess) onLoginSuccess();
        } catch (err: any) {
            if (err.message !== 'POPUP_CLOSED') {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const passwordStrength = view === 'register' && password
        ? validatePasswordStrength(password)
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-navarra-dark via-gray-900 to-black flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Back Button */}
                <button
                    onClick={onBack}
                    className="mb-6 text-navarra-gold hover:text-navarra-parchment transition-colors flex items-center gap-2"
                >
                    <span>←</span>
                    <span>{t('common.backToHome')}</span>
                </button>

                {/* Main Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-navarra-gold rounded-lg p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif text-navarra-gold mb-2">
                            {view === 'login' && t('auth.login.title')}
                            {view === 'register' && t('auth.register.title')}
                            {view === 'reset' && t('auth.reset.title')}
                        </h1>
                        <p className="text-navarra-parchment text-sm">
                            {view === 'login' && t('auth.login.subtitle')}
                            {view === 'register' && t('auth.register.subtitle')}
                            {view === 'reset' && t('auth.reset.subtitle')}
                        </p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-200 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-900/30 border border-green-500 rounded text-green-200 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {view === 'register' && (
                            <div>
                                <label className="block text-navarra-parchment text-sm mb-2">
                                    {t('auth.register.displayName')}
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold transition"
                                    placeholder={t('auth.register.displayNamePlaceholder')}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-navarra-parchment text-sm mb-2">
                                {t('auth.login.email')}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold transition"
                                placeholder={t('auth.login.emailPlaceholder')}
                                required
                            />
                        </div>

                        {view !== 'reset' && (
                            <>
                                <div>
                                    <label className="block text-navarra-parchment text-sm mb-2">
                                        {t('auth.login.password')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-navarra-gold/60 hover:text-navarra-gold"
                                        >
                                            {showPassword ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                    </div>

                                    {/* Password strength indicator */}
                                    {passwordStrength && (
                                        <div className="mt-2">
                                            <div className="flex gap-1 mb-1">
                                                <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'weak' ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                                                <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'medium' || passwordStrength.strength === 'strong' ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
                                                <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'strong' ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                                            </div>
                                            <p className="text-xs text-navarra-parchment/60">{passwordStrength.message}</p>
                                        </div>
                                    )}
                                </div>

                                {view === 'register' && (
                                    <div>
                                        <label className="block text-navarra-parchment text-sm mb-2">
                                            {t('auth.register.confirmPassword')}
                                        </label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-black/50 border border-navarra-gold/30 rounded text-navarra-parchment focus:outline-none focus:border-navarra-gold transition"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-navarra-gold to-yellow-600 text-black font-bold rounded hover:from-yellow-600 hover:to-navarra-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('common.loading') : (
                                view === 'login' ? t('auth.login.submit') :
                                    view === 'register' ? t('auth.register.submit') :
                                        t('auth.reset.submit')
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    {view !== 'reset' && (
                        <>
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-navarra-gold/30"></div>
                                <span className="px-4 text-navarra-parchment text-sm">{t('auth.login.orContinueWith')}</span>
                                <div className="flex-1 border-t border-navarra-gold/30"></div>
                            </div>

                            {/* Google Sign In */}
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full py-3 bg-white text-gray-800 font-semibold rounded flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-50"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                {t('auth.login.googleButton')}
                            </button>
                        </>
                    )}

                    {/* Footer Links */}
                    <div className="mt-6 text-center text-sm">
                        {view === 'login' && (
                            <>
                                <button
                                    onClick={() => setView('reset')}
                                    className="text-navarra-gold hover:underline block mb-3"
                                >
                                    {t('auth.login.forgotPassword')}
                                </button>
                                <p className="text-navarra-parchment">
                                    {t('auth.login.noAccount')}{' '}
                                    <button
                                        onClick={() => setView('register')}
                                        className="text-navarra-gold hover:underline font-semibold"
                                    >
                                        {t('auth.login.createAccount')}
                                    </button>
                                </p>
                            </>
                        )}

                        {view === 'register' && (
                            <p className="text-navarra-parchment">
                                {t('auth.register.hasAccount')}{' '}
                                <button
                                    onClick={() => setView('login')}
                                    className="text-navarra-gold hover:underline font-semibold"
                                >
                                    {t('auth.register.signIn')}
                                </button>
                            </p>
                        )}

                        {view === 'reset' && (
                            <button
                                onClick={() => setView('login')}
                                className="text-navarra-gold hover:underline"
                            >
                                {t('auth.reset.backToLogin')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
