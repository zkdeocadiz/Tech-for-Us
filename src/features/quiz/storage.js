const STORAGE_KEY = 'socialtech_quiz_result';

export const saveResult = (result) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

export const loadResult = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearResult = () =>
  localStorage.removeItem(STORAGE_KEY);

export const hasResult = () =>
  localStorage.getItem(STORAGE_KEY) !== null;