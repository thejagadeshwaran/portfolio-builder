// frontend/src/utils/validators.js
export const validators = {
  isValidEmail: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidPhone: (phone) => {
    return /^\+?[\d\s-]{8,15}$/.test(phone);
  },

  required: (value) => {
    return value && value.trim().length > 0;
  }
};