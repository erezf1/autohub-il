import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { SuperArrowsIcon } from "./SuperArrowsIcon";

interface PageHeaderProps {
  title: string | ReactNode;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export const PageHeader = ({ title, onBack, rightAction }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-14">
      <div className="flex items-center gap-2">
        {onBack && (
            <div 
            onClick={onBack}
            className="h-6 w-6 cursor-pointer flex items-center justify-center transition-all duration-200"
            >
            <SuperArrowsIcon className="h-full w-full hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200" />
            </div>
        )}
        <h1 className="text-2xl font-bold text-foreground hebrew-text flex items-center">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
};
