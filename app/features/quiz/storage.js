const STORAGE_KEY = 'socialtech_quiz_result';

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const saveResult = (result) =>
  canUseStorage() && localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

export const loadResult = () => {
  if (!canUseStorage()) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearResult = () =>
  canUseStorage() && localStorage.removeItem(STORAGE_KEY);

export const hasResult = () =>
  canUseStorage() && localStorage.getItem(STORAGE_KEY) !== null;