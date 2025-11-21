import React, { useState, useEffect, useCallback, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { debounce } from "lodash";

export interface SelectOption {
  value: string;
  label: string;
  display?: any;
  stock?: number;
  preOrderEnabled?: boolean;
}

interface SearchableSelectProps {
  options?: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => Promise<SelectOption[]>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options: staticOptions = [],
  value,
  onChange,
  onSearch,
  label,
  placeholder = "Select an option...",
  required = false,
  disabled = false,
  className = "",
  emptyMessage = "No options found.",
}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<SelectOption[]>(staticOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onSearchRef = useRef(onSearch);

  // Keep ref updated
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const selectedOption = options.find((option) => option.value === value);

  // Debounced search function - use ref to avoid recreating on every render
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (!onSearchRef.current) return;

      setIsLoading(true);
      try {
        const results = await onSearchRef.current(searchQuery);
        setOptions(results);
      } catch (error) {
        console.error("Search error:", error);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // Handle query changes
  useEffect(() => {
    if (onSearch && query.trim()) {
      debouncedSearch(query);
    } else if (!onSearch) {
      // Filter static options
      const filtered =
        query === ""
          ? staticOptions
          : staticOptions.filter((option) =>
              option.label.toLowerCase().includes(query.toLowerCase())
            );
      setOptions(filtered);
    } else if (onSearch && !query.trim()) {
      // Clear options when query is empty and using onSearch
      setOptions([]);
    }
  }, [query, onSearch, staticOptions]);

  // Reset options when static options change
  useEffect(() => {
    if (!onSearch && !query) {
      setOptions(staticOptions);
    }
  }, [staticOptions, onSearch, query]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium mb-2"
          style={{
            fontFamily: '"League Spartan", sans-serif',
            color: "#344054",
          }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Input Field */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors ${
            disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
          }`}
          style={{ fontFamily: '"League Spartan", sans-serif' }}
        >
          <span className="block truncate text-gray-700">
            {selectedOption?.label || placeholder}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Options */}
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ fontFamily: '"League Spartan", sans-serif' }}
                />
              </div>

              {/* Options List */}
              <div className="overflow-y-auto max-h-48">
                {isLoading ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    Loading...
                  </div>
                ) : options.length === 0 ? (
                  <div className="px-4 py-3 text-center text-sm text-gray-500">
                    {query !== "" ? emptyMessage : "No options available"}
                  </div>
                ) : (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`w-full px-4 py-2 text-left hover:bg-brand-green/10 transition-colors ${
                        value === option.value ? "bg-brand-green/20" : ""
                      }`}
                      style={{ fontFamily: '"League Spartan", sans-serif' }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`block truncate ${
                            value === option.value
                              ? "font-semibold text-brand-green"
                              : "font-normal text-gray-700"
                          }`}
                        >
                          {option.label}
                        </span>
                        {value === option.value && (
                          <Check className="w-4 h-4 text-brand-green" />
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
