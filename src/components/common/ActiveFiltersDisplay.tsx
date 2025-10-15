import { Button } from "@/components/ui/button";

interface ActiveFiltersDisplayProps {
  filterCount: number;
  onClearAll: () => void;
}

export const ActiveFiltersDisplay = ({ filterCount, onClearAll }: ActiveFiltersDisplayProps) => {
  if (filterCount === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground hebrew-text">
        {filterCount} פילטרים פעילים
      </span>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onClearAll}
      >
        נקה הכל
      </Button>
    </div>
  );
};
