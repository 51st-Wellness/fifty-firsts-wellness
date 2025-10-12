import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSubmit,
  placeholder = "Search...",
  className = "",
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-xl mx-auto flex items-center bg-white border rounded-full shadow-sm overflow-hidden ${className}`}
    >
      <div className="pl-4 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="flex-1 px-3 py-2 text-sm sm:text-base focus:outline-none"
      />
      <button
        type="submit"
        className="px-4 sm:px-6 py-2 bg-brand-green text-white text-sm sm:text-base font-medium hover:bg-brand-green-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green/50"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
