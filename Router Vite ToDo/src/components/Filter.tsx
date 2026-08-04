import { FaSearch, FaTimes } from "react-icons/fa";
import TaskStatus from "../constants/TaskSTatus";
import {
  FilterContainer,
  FilterButtonGroup,
  FilterButton,
  FilterBadge,
  SearchWrapper,
  SearchIconWrapper,
  SearchInput,
  ClearButton,
} from "../styles/components/filter";

export interface StatusOption<T extends string = string> {
  label: string;
  value: T;
}

export interface FilterProps<T extends string = string> {
  filterStatus?: T;
  onFilterStatusChange?: (status: T) => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  statusOptions?: (StatusOption<T> | T)[];
  statusCounts?: Record<string, number>;
  placeholder?: string;
  showSearch?: boolean;
  className?: string;
}

export function Filter<T extends string = string>({
  filterStatus = TaskStatus.All as T,
  onFilterStatusChange,
  searchQuery = "",
  onSearchQueryChange,
  statusOptions,
  statusCounts,
  placeholder = "Search tasks...",
  showSearch = true,
  className,
}: FilterProps<T>) {
  // Normalize options list
  const options: StatusOption<T>[] = statusOptions
    ? statusOptions.map((opt) =>
        typeof opt === "string"
          ? { label: opt.charAt(0).toUpperCase() + opt.slice(1), value: opt as T }
          : opt
      )
    : (Object.values(TaskStatus) as T[]).map((status) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: status,
      }));

  return (
    <FilterContainer className={className}>
      <FilterButtonGroup role="tablist" aria-label="Task status filters">
        {options.map(({ label, value }) => {
          const isActive = filterStatus === value;
          const count = statusCounts ? statusCounts[value] : undefined;

          return (
            <FilterButton
              key={value}
              type="button"
              role="tab"
              aria-selected={isActive}
              $isActive={isActive}
              onClick={() => onFilterStatusChange?.(value)}
            >
              <span>{label}</span>
              {count !== undefined && (
                <FilterBadge $isActive={isActive}>{count}</FilterBadge>
              )}
            </FilterButton>
          );
        })}
      </FilterButtonGroup>

      {showSearch && onSearchQueryChange && (
        <SearchWrapper>
          <SearchIconWrapper>
            <FaSearch size={14} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={placeholder}
            maxLength={60}
            aria-label="Search tasks"
          />
          {searchQuery && (
            <ClearButton
              type="button"
              onClick={() => onSearchQueryChange("")}
              aria-label="Clear search query"
            >
              <FaTimes size={12} />
            </ClearButton>
          )}
        </SearchWrapper>
      )}
    </FilterContainer>
  );
}