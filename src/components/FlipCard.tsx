import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
}

export const FlipCard = ({ frontContent, backContent, className }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={cn("perspective-1000", className)}>
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}
      >
        <div className="absolute w-full h-full backface-hidden">
          <div onClick={() => setIsFlipped(true)}>
            {frontContent}
          </div>
        </div>
        <div className="absolute w-full h-full backface-hidden rotate-y-180">
          <div onClick={() => setIsFlipped(false)}>
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
};
