import AyahDisplay from "./AyahDisplay";
import Input from "./Input";

export default function Game() {
  const ayahs = [
    {
      words: [
        { text: "بِسْمِ" },
        { text: "اللَّهِ" },
        { text: "الرَّحْمَٰنِ" },
        { text: "الرَّحِيمِ" }
      ]
    },
    {
      words: [
        { text: "الْحَمْدُ" },
        { text: "لِلَّهِ" },
        { text: "رَبِّ" },
        { text: "الْعَالَمِينَ" }
      ]
    },
    {
      words: [
        { text: "الرَّحْمَٰنِ" },
        { text: "الرَّحِيمِ" },
      ]
    }
  ];
  return (
    <div>
      <AyahDisplay ayahs={ayahs}></AyahDisplay>
      <br />
      <Input></Input>
    </div>
  );
}
