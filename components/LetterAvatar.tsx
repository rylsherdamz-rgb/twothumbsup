import Image from "next/image";

export default function LetterAvatar({
  name,
  src,
  size = 36,
}: {
  name: string;
  src?: string | null;
  size?: number;
}) {
  const initial = (name || "?")[0].toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className="object-cover shrink-0"
        style={{ width: size, height: size, borderRadius: "50%" }}
      />
    );
  }

  return (
    <div
      className="shrink-0 bg-[var(--text)] text-[var(--bg)] flex items-center justify-center font-bold"
      style={{ width: size, height: size, borderRadius: "50%", fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}