import Ayah from "./Ayah";
import { AyahProps } from "./Ayah";

export type AyahDisplayProps = {
  ayahs: AyahProps[];
};

export default function AyahDisplay({ ayahs }: AyahDisplayProps) {
  const ayahsDOM = ayahs.map((ayah, index) => (
    <Ayah key={index} words={ayah.words}></Ayah>
  ));
  return <div>{ayahsDOM}</div>;
}
