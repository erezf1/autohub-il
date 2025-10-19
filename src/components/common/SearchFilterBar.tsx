import { SearchBar } from "./SearchBar";
import { FilterButton } from "./FilterButton";
import { GradientBorderContainer } from "@/components/ui/gradient-border-container";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filterCount: number;
  onFilterClick: () => void;
}

export const SearchFilterBar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filterCount,
  onFilterClick,
}: SearchFilterBarProps) => {
  return (
    <div className="flex gap-2">
      <GradientBorderContainer className="rounded-md flex-1">
        <SearchBar
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          className="flex-1"
        />
      </GradientBorderContainer>
      <GradientBorderContainer className="rounded-md">
        <FilterButton
          activeCount={filterCount}
          onClick={onFilterClick}
        />
      </GradientBorderContainer>
    </div>
  );
};
