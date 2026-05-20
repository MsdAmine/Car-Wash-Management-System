import { Image } from "lucide-react";

type AspectRatio = "square" | "video" | "wide" | "auto";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
  aspectRatio?: AspectRatio;
}

const aspectMap: Record<AspectRatio, string> = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[16/5]",
  auto: "",
};

export function ImagePlaceholder({ label, className = "", aspectRatio = "auto" }: ImagePlaceholderProps) {
  const aspectClass = aspectMap[aspectRatio];

  return (
    <div
      className={`bg-gray-100 flex flex-col items-center justify-center text-gray-400 text-xs text-center rounded-lg p-2 ${aspectClass} ${className}`}
    >
      <Image className="w-5 h-5 mb-1" />
      {label}
    </div>
  );
}
