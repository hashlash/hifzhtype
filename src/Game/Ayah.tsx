import { ReactNode } from 'react';
import Word from './Word';
import { WordProps } from './Word';

export type AyahProps = {
  words: WordProps[];
  translation?: string;
  number?: number;
};

export default function Ayah({ words, translation, number }: AyahProps) {
  const wordsDOM = words
    .map<ReactNode>((word, index) => (
      <Word key={index} text={word.text} translation={word.translation}></Word>
    ))
    .reduce((accu, curr) => (accu === null ? [curr] : [accu, ' ', curr]), null);
  return (
    <div title={translation}>
      {wordsDOM} {number && <span>({number})</span>}
    </div>
  );
}
