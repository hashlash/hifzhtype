export interface WordData {
  text: string;
  translation: string;
}

export interface AyahData {
  number: number;
  words: WordData[];
  translation: string;
}

export interface SurahData {
  number: number;
  name: string;
  transliteration: string;
  translation: string;
  ayahs: AyahData[];
}
