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
        { text: "الرَّحِيمِ" }
      ]
    },
    {
      words: [
        { text: "مَٰلِكِ" },
        { text: "يَوْمِ" },
        { text: "الدِّينِ" }
      ]
    },
    {
      words: [
        { text: "إِيَّاكَ" },
        { text: "نَعْبُدُ" },
        { text: "وَإِيَّاكَ" },
        { text: "نَسْتَعِينُ" }
      ]
    },
    {
      words: [
        { text: "اهْدِنَا" },
        { text: "الصِّرَاطَ" },
        { text: "الْمُسْتَقِيمَ" }
      ]
    },
    {
      words: [
        { text: "صِرَاطَ" },
        { text: "الَّذِينَ" },
        { text: "أَنْعَمْتَ" },
        { text: "عَلَيْهِمْ" },
        { text: "غَيْرِ" },
        { text: "الْمَغْضُوبِ" },
        { text: "عَلَيْهِمْ" },
        { text: "وَلَا" },
        { text: "الضَّآلِّينَ" }
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
