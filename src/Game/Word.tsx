export type WordProps = {
  text: string;
};

export default function Word({ text }: WordProps) {
  return <span>{text}</span>;
}
