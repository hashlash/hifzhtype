import AyahDisplay from "./AyahDisplay";
import Input from "./Input";
import { fatihah } from "../data/surah/1";

export default function Game() {
  const ayahs = fatihah.ayahs;
  return (
    <div dir="rtl" lang="ar">
      <h1>
        {fatihah.number}. {fatihah.transliteration} ({fatihah.name})
      </h1>
      <AyahDisplay ayahs={ayahs}></AyahDisplay>
      <br />
      <Input></Input>
    </div>
  );
}
