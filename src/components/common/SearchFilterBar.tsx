import { SearchBar } from "./SearchBar";
import { FilterButton } from "./FilterButton";

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
      <SearchBar
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={onSearchChange}
        className="flex-1"
      />
      <FilterButton
        activeCount={filterCount}
        onClick={onFilterClick}
      />
    </div>
  );
};
