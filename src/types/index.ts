// src/types/index.ts
/* -------------------------------------------------------------------------- */
/*                                TYPES                                       */
/* -------------------------------------------------------------------------- */

export interface Correction {
  wrong: string;
  suggestions: string[];
  position?: number;
}

export interface ToneSuggestion {
  current: string;
  suggestion: string;
  reason: string;
  position?: number;
}

export interface StyleSuggestion {
  current: string;
  suggestion: string;
  type: string;
  position?: number;
}

export interface StyleMixingCorrection {
  current: string;
  suggestion: string;
  type: string;
  position?: number;
}

export interface StyleMixing {
  detected: boolean;
  recommendedStyle?: string;
  reason?: string;
  corrections?: StyleMixingCorrection[];
}

export interface PunctuationIssue {
  issue: string;
  currentSentence: string;
  correctedSentence: string;
  explanation: string;
  position?: number;
}

export interface EuphonyImprovement {
  current: string;
  suggestions: string[];
  reason: string;
  position?: number;
}

export interface ContentAnalysis {
  contentType: string;
  description?: string;
  missingElements?: string[];
  suggestions?: string[];
}

export type SectionKey =
  | 'spelling'
  | 'tone'
  | 'style'
  | 'mixing'
  | 'punctuation'
  | 'euphony'
  | 'content';

export type ViewFilter = 'all' | 'spelling' | 'punctuation';

// Updated: Added 'dictionary' to ModalType
export type ModalType = 
  | 'none' 
  | 'settings' 
  | 'instructions' 
  | 'tone' 
  | 'style' 
  | 'doctype' 
  | 'mainMenu' 
  | 'dictionary';

export interface DocTypeConfig {
  label: string;
  description: string;
  defaultTone: string;
  roleInstruction: string;
  checkFocus: string;
}

export interface Stats {
  totalWords: number;
  errorCount: number;
  accuracy: number;
}

export interface Message {
  text: string;
  type: 'success' | 'error';
}