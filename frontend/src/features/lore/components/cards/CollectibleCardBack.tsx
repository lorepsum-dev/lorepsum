import { cn } from "@/lib/utils";
import { useEntityBackImage } from "../../hooks/useEntityImage";
import type { CollectibleCardSize } from "./CollectibleCard";

interface CollectibleCardBackProps {
  size?: CollectibleCardSize;
  className?: string;
  alt?: string;
}

const SIZE_CLASSES: Record<CollectibleCardSize, string> = {
  sm: "w-52 h-[20rem]",
  lg: "w-[20rem] h-[35rem]",
};

function CollectibleCardBack({
  size = "lg",
  className,
  alt = "Lorepsum card back",
}: CollectibleCardBackProps) {
  const { imageSrc, onImageError } = useEntityBackImage();

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] border border-primary-light/15",
        "shadow-[0_30px_60px_-30px_hsl(var(--primary-light)/0.45),0_0_30px_-10px_hsl(var(--primary-glow)/0.25),inset_0_1px_0_hsl(var(--primary-light)/0.08)]",
        SIZE_CLASSES[size],
        className,
      )}
      style={{ background: "var(--gradient-card)" }}
    >
      <img
        src={imageSrc}
        alt={alt}
        onError={onImageError}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

export default CollectibleCardBack;
