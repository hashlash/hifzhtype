import { ReactNode } from "react";
import Word from "./Word";
import { WordProps } from "./Word";

export type AyahProps = {
  words: WordProps[];
};

export default function Ayah({ words }: AyahProps) {
  const wordsDOM = words
    .map<ReactNode>((word, index) => <Word key={index} text={word.text}></Word>)
    .reduce((accu, curr) => [accu, " ", curr]);
  return <div>{wordsDOM}</div>;
}
