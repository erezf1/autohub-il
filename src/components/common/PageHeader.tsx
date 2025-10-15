import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: ReactNode;
}

export const PageHeader = ({ title, onBack, rightAction }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-14">
      <div className="flex items-center gap-2">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl font-bold text-foreground hebrew-text">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
};
