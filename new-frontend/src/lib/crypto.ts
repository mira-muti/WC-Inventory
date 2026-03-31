import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-fallback-key';
export const cryptoUtils = {
  encrypt: (text: string): string => {
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  },

  decrypt: (ciphertext: string): string => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
};