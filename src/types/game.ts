export type TranslationDisplay = 'none' | 'word' | 'ayah' | 'both';
export type TranslationPosition = 'tooltip' | 'below';
export type RevealType = 'base' | 'vocalized';
export type LayoutMode = 'continuous' | 'blocked';

export interface GameConfig {
  realTimeFeedback: boolean;
  spoilerOnInactivity: boolean;
  spoilerOnErrors: boolean;
  spoilerOnExcessiveTyping: boolean;
  spoilerRevealType: RevealType;
  translationDisplay: TranslationDisplay;
  translationPosition: TranslationPosition;
  leadInWordCount: number;
  layoutMode: LayoutMode;
  autoRevealSpoiler: boolean;
}

export const DEFAULT_CONFIG: GameConfig = {
  realTimeFeedback: true,
  spoilerOnInactivity: true,
  spoilerOnErrors: true,
  spoilerOnExcessiveTyping: true,
  spoilerRevealType: 'vocalized',
  translationDisplay: 'word',
  translationPosition: 'tooltip',
  leadInWordCount: 2,
  layoutMode: 'continuous',
  autoRevealSpoiler: true,
};

export interface WordStatus {
  wordIndex: number;
  ayahIndex: number;
  status: 'pending' | 'typed' | 'correct' | 'incorrect' | 'revealed' | 'leadin';
  typedText: string;
}

export interface GameState {
  config: GameConfig;
  surah: number;
  startAyah: number;
  endAyah: number;
  currentAyahIndex: number; // Index in the selected range
  currentWordIndex: number; // Index in the current ayah
  wordStatuses: WordStatus[][]; // status for each word in each ayah in the range
}
