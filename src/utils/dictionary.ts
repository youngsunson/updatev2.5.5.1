// src/utils/dictionary.ts

const DICT_KEY = 'bhasha_mitra_user_dict';

/**
 * লোড করা ডিকশনারি (সেট আকারে যাতে দ্রুত খোঁজা যায়)
 */
export const loadDictionary = (): Set<string> => {
  try {
    const saved = localStorage.getItem(DICT_KEY);
    if (!saved) return new Set();
    const parsed = JSON.parse(saved);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch (e) {
    console.error('Dictionary load error:', e);
    return new Set();
  }
};

/**
 * ডিকশনারিতে শব্দ যোগ করা
 */
export const addToDictionary = (word: string): string[] => {
  const dict = loadDictionary();
  const normalized = word.trim(); // শব্দ নরমাল করা
  
  if (normalized) {
    dict.add(normalized);
    saveDictionary(dict);
  }
  
  return Array.from(dict);
};

/**
 * ডিকশনারি থেকে শব্দ মুছে ফেলা
 */
export const removeFromDictionary = (word: string): string[] => {
  const dict = loadDictionary();
  const normalized = word.trim();
  
  if (dict.has(normalized)) {
    dict.delete(normalized);
    saveDictionary(dict);
  }
  
  return Array.from(dict);
};

/**
 * শব্দ ডিকশনারিতে আছে কিনা চেক করা
 */
export const isInDictionary = (word: string, dict?: Set<string>): boolean => {
  const currentDict = dict || loadDictionary();
  return currentDict.has(word.trim());
};

/**
 * লোকাল স্টোরেজে সেভ করা (প্রাইভেট হেল্পার)
 */
const saveDictionary = (dict: Set<string>) => {
  try {
    const array = Array.from(dict);
    localStorage.setItem(DICT_KEY, JSON.stringify(array));
  } catch (e) {
    console.error('Dictionary save error:', e);
  }
};