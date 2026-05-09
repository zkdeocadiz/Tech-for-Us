export const STORAGE_KEY = 'socialtech_quiz_result';
const LEGACY_PREFIX = 'quiz-';

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const isValidResult = (value) => {
  if (!value || typeof value !== 'object') return false;
  if (typeof value.code !== 'string' || value.code.length === 0) return false;
  if (!value.scores || typeof value.scores !== 'object') return false;
  return true;
};

const parseStoredResult = (rawValue) => {
  if (!rawValue) return null;
  try {
    const parsed = JSON.parse(rawValue);
    return isValidResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const collectLegacyKeys = () => {
  const keys = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LEGACY_PREFIX)) {
      keys.push(key);
    }
  }
  return keys;
};

const migrateLegacyResultIfPresent = () => {
  if (!canUseStorage()) return null;

  const legacyKeys = collectLegacyKeys();
  if (legacyKeys.length === 0) return null;

  let migratedResult = null;

  for (const key of legacyKeys) {
    const rawValue = localStorage.getItem(key);
    const parsed = parseStoredResult(rawValue);
    if (!migratedResult && parsed) {
      migratedResult = parsed;
    }
    localStorage.removeItem(key);
  }

  if (migratedResult) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedResult));
  }

  return migratedResult;
};

export const saveResult = (result) =>
  canUseStorage() && localStorage.setItem(STORAGE_KEY, JSON.stringify(result));

export const loadResult = () => {
  if (!canUseStorage()) return null;

  const parsedCurrent = parseStoredResult(localStorage.getItem(STORAGE_KEY));
  if (parsedCurrent) {
    // Clean stale legacy values if they still exist after migration rollout.
    const legacyKeys = collectLegacyKeys();
    legacyKeys.forEach((key) => localStorage.removeItem(key));
    return parsedCurrent;
  }

  if (localStorage.getItem(STORAGE_KEY) != null) {
    // Clean up invalid/corrupt canonical data so future page loads are stable.
    localStorage.removeItem(STORAGE_KEY);
  }

  return migrateLegacyResultIfPresent();
};

export const clearResult = () =>
  canUseStorage() && localStorage.removeItem(STORAGE_KEY);

export const hasResult = () =>
  !!loadResult();