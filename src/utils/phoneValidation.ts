/**
 * Phone Validation Utilities for Israeli Phone Numbers
 * Format: 10 digits starting with 05 (e.g., 0501234567)
 */

/**
 * Validate Israeli phone number (10 digits, starts with 05)
 */
export const isValidIsraeliPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return /^05\d{8}$/.test(cleaned);
};

/**
 * Clean phone number (remove all non-digits)
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

/**
 * Format phone for display (050-123-4567)
 */
export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  if (cleaned.length !== 10) return phone;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Convert phone to email format for Supabase auth
 */
export const phoneToEmail = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  return `${cleaned}@autohub.local`;
};

/**
 * Extract phone from email format
 */
export const emailToPhone = (email: string): string => {
  return email.replace('@autohub.local', '');
};
