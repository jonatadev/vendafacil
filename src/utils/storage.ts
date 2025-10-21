export const loadJson = (key: string): unknown | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('loadJson error', e);
    return null;
  }
};

export const saveJson = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('saveJson error', e);
  }
};

export const removeKey = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('removeKey error', e);
  }
};
