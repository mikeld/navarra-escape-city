/**
 * Admin Utility Functions
 * Provides admin access verification
 */

const ADMIN_EMAIL = 'mikeldiaz0@gmail.com';

/**
 * Check if a user email has admin privileges
 */
export const isAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

/**
 * Get admin email (for reference)
 */
export const getAdminEmail = (): string => {
    return ADMIN_EMAIL;
};
