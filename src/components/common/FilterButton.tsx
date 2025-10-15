import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterButtonProps {
  activeCount: number;
  onClick: () => void;
}

export const FilterButton = ({ activeCount, onClick }: FilterButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={onClick}
      className="relative"
    >
      <Filter className="h-4 w-4" />
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
