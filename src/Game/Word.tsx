export type WordProps = {
  text: string;
  translation?: string;
};

export default function Word({ text, translation }: WordProps) {
  return (
    <span title={translation}>
      {text}
    </span>
  );
}
