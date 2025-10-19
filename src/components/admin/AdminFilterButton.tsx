import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminFilterButtonProps {
  activeCount: number;
  onClick: () => void;
}

export const AdminFilterButton = ({ activeCount, onClick }: AdminFilterButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="default"
      onClick={onClick}
      className="relative hebrew-text"
    >
      <Filter className="h-4 w-4 ml-2" />
      סינון
      {activeCount > 0 && (
        <Badge 
          className="absolute -top-2 -left-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          variant="destructive"
        >
          {activeCount}
        </Badge>
      )}
    </Button>
  );
};
