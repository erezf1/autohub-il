import { Button } from "@/components/ui/button";

interface AdminActiveFiltersDisplayProps {
  filterCount: number;
  onClearAll: () => void;
}

export const AdminActiveFiltersDisplay = ({ filterCount, onClearAll }: AdminActiveFiltersDisplayProps) => {
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
        className="hebrew-text"
      >
        נקה הכל
      </Button>
    </div>
  );
};
