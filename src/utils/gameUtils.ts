import { GameConfig, DEFAULT_CONFIG } from '../types/game';

export const compareArabic = (a: string, b: string): boolean => {
  return a.localeCompare(b, 'ar', { sensitivity: 'base' }) === 0;
};

// Returns true if 'partial' is a prefix of 'full' (ignoring diacritics)
export const isArabicPrefix = (partial: string, full: string): boolean => {
  if (partial === '') return true;
  if (partial.length > full.length) return false;

  // Since localeCompare doesn't easily do "startsWith" with sensitivity: base,
  // we can try comparing the substring of full that matches partial's length.
  // Note: diacritics in 'full' make length comparison tricky.

  const normalizedPartial = normalizeArabic(partial);
  const normalizedFull = normalizeArabic(full);

  return normalizedFull.startsWith(normalizedPartial);
};

export const normalizeArabic = (text: string): string => {
  // Use localeCompare-compatible normalization or regex to strip diacritics
  // The user suggested localeCompare, but for startsWith we might need manual stripping
  // OR we can use the fact that localeCompare with 'base' sensitivity ignores them.
  // Actually, let's use the regex for normalization to be safe for prefix matching.
  return text.replace(/[\u064B-\u065F\u0670\u06E4]/g, '');
};

const CONFIG_KEY = 'hifzhtype_config';

export const saveConfig = (config: GameConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
};

export const loadConfig = (): GameConfig => {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) return DEFAULT_CONFIG;
  try {
    return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
  } catch (e) {
    return DEFAULT_CONFIG;
  }
};
