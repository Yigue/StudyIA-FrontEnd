import React from "react";
import { cn } from "../../utils/cn";
import { Search } from "lucide-react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  placeholder = "Buscar...",
  onSearch,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch((e.target as HTMLInputElement).value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-gray-400" />
      </div>
      <input
        type="text"
        className={cn(
          "block w-full p-2 pl-10 pr-3 text-sm border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 placeholder-gray-400 text-gray-700 dark:text-white focus:ring-primary-500 focus:border-primary-500",
          className
        )}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
};

export default SearchBar; 