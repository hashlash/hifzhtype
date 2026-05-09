import Ayah from './Ayah';
import { AyahData } from '../types/surah';

export type AyahDisplayProps = {
  ayahs: AyahData[];
};

export default function AyahDisplay({ ayahs }: AyahDisplayProps) {
  const ayahsDOM = ayahs.map((ayah, index) => (
    <Ayah
      key={index}
      words={ayah.words}
      translation={ayah.translation}
      number={ayah.number}
    ></Ayah>
  ));
  return <div>{ayahsDOM}</div>;
}
