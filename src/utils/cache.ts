// src/utils/cache.ts

const CACHE_PREFIX = 'bm_cache_v1_';
const MAX_CACHE_ITEMS = 20; // মেমোরি বাঁচানোর জন্য সর্বোচ্চ ২০টি রেজাল্ট সেভ থাকবে

interface CacheContext {
  docType: string;
  tone?: string;
  style?: string;
}

interface CacheEntry {
  timestamp: number;
  data: any;
}

/**
 * টেক্সট থেকে একটি ইউনিক হ্যাশ তৈরি করে (Cache Key)
 */
const generateHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

/**
 * ইনপুট টেক্সট এবং সেটিংসের উপর ভিত্তি করে কী তৈরি করে
 * (যাতে টোন বা স্টাইল বদলালে নতুন করে চেক হয়)
 */
export const getCacheKey = (text: string, context: CacheContext): string => {
  const cleanText = text.trim();
  // কনটেক্সট স্ট্রিং: যেমন "academic|polite|sadhu"
  const contextStr = `${context.docType}|${context.tone || ''}|${context.style || ''}`;
  const combined = `${cleanText}::${contextStr}`;
  return `${CACHE_PREFIX}${generateHash(combined)}`;
};

/**
 * ক্যাশ থেকে ডাটা আনা
 */
export const getCachedData = (key: string): any | null => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const entry: CacheEntry = JSON.parse(item);
    
    // ২৪ ঘন্টার পুরনো ক্যাশ ফেলে দিন
    if (Date.now() - entry.timestamp > 86400000) {
      localStorage.removeItem(key);
      return null;
    }

    console.log(`🚀 Cache Hit: ${key}`);
    return entry.data;
  } catch (e) {
    console.error('Cache read error', e);
    return null;
  }
};

/**
 * ক্যাশে ডাটা সেভ করা
 */
export const setCachedData = (key: string, data: any) => {
  try {
    manageCacheSize(); // সাইজ চেক করা

    const entry: CacheEntry = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (e) {
    console.error('Cache write error', e);
    // স্টোরেজ ফুল হলে সব ক্যাশ ক্লিয়ার করে জায়গা খালি করুন
    clearCache();
  }
};

/**
 * মেমোরি ম্যানেজমেন্ট: বেশি ফাইল জমলে পুরনো ডিলিট করা
 */
const manageCacheSize = () => {
  let cacheKeys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      cacheKeys.push(key);
    }
  }

  // যদি লিমিট পার হয়, প্রথম ৫টি পুরনো ডিলিট করে দিন
  if (cacheKeys.length >= MAX_CACHE_ITEMS) {
    cacheKeys.slice(0, 5).forEach(k => localStorage.removeItem(k));
  }
};

/**
 * সব ক্যাশ মুছে ফেলা
 */
export const clearCache = () => {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
};