import React, { useState, useEffect, useRef, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

const DEFAULT_OPTIONS: SelectOption[] = [];

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
  options: staticOptions = DEFAULT_OPTIONS,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Custom debounce implementation
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSearchRef = useRef<string>("");
  const onSearchRef = useRef(onSearch);

  // Keep onSearch ref updated
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // 1. Effect for Remote Search (depends on query, onSearch)
  useEffect(() => {
    // Only run if onSearch is provided
    if (!onSearch) return;

    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.length >= 3) {
      // Set loading immediately for better UX
      setIsLoading(true);

      // Debounce the actual search
      debounceTimeoutRef.current = setTimeout(async () => {
        const searchFn = onSearchRef.current;
        if (!searchFn || query.length < 3) {
          setOptions([]);
          setIsLoading(false);
          return;
        }

        // Store the current search query
        currentSearchRef.current = query;

        try {
          const results = await searchFn(query);

          // Only update if this is still the current search
          if (currentSearchRef.current === query) {
            setOptions(results);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Search error:", error);

          // Only update if this is still the current search
          if (currentSearchRef.current === query) {
            setOptions([]);
            setIsLoading(false);
          }
        }
      }, 300);
    } else if (query.length === 0) {
      setOptions([]);
      setIsLoading(false);
      currentSearchRef.current = "";
    } else {
      // Less than 3 characters
      setOptions([]);
      setIsLoading(false);
      currentSearchRef.current = "";
    }

    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [query, onSearch]); // Removed staticOptions from dependency

  // 2. Effect for Local Filtering (depends on query, staticOptions, onSearch absence)
  useEffect(() => {
    if (onSearch) return;

    const filtered =
      query === ""
        ? staticOptions
        : staticOptions.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
          );
    setOptions(filtered);
  }, [query, staticOptions, onSearch]);

  // Reset options when static options change and we are in local mode
  useEffect(() => {
    if (!onSearch) {
      setOptions(staticOptions);
    }
  }, [staticOptions, onSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Find the currently selected option
  const selectedOption = options.find((o) => o.value === value) || null;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelection = (item: SelectOption | null) => {
    if (item) {
      onChange(item.value);
      setQuery(""); // Clear query immediately when item is selected
    } else {
      onChange("");
      setQuery("");
    }
  };

  // Function to display the selected value in the input
  const displayValue = (item: SelectOption | null): string => {
    // When user is typing, show the query (this allows free-form typing)
    if (query) {
      return query;
    }
    // When an item is selected and no query, show its label
    return item?.label || "";
  };

  const showMinCharMessage = onSearch && query.length > 0 && query.length < 3;
  const showNoResults = !isLoading && options.length === 0 && query.length >= 3;
  const showEmptyState =
    !isLoading && options.length === 0 && query.length === 0 && onSearch;

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

      <Combobox
        value={selectedOption}
        onChange={handleSelection}
        disabled={disabled}
        nullable
      >
        {({ open }) => {
          // Track open state and clear query when closing without selection
          if (isOpen && !open && !selectedOption) {
            // Combobox just closed and no item is selected, clear query
            setQuery("");
          }
          setIsOpen(open);

          return (
            <div className="relative">
              <ComboboxInput
                className={`w-full py-3 pl-4 pr-10 text-sm leading-5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-700 ${
                  disabled
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:border-gray-400"
                }`}
                style={
                  {
                    fontFamily: '"League Spartan", sans-serif',
                    "--tw-ring-color": "#00969b",
                  } as React.CSSProperties
                }
                displayValue={displayValue}
                onChange={handleInputChange}
                placeholder={placeholder}
                autoComplete="off"
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-50 rounded-r-lg transition-colors">
                <ChevronsUpDown
                  className="w-4 h-4 text-gray-400"
                  aria-hidden="true"
                />
              </ComboboxButton>

              <ComboboxOptions className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto text-sm focus:outline-none divide-y divide-gray-100">
                {isLoading ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin"
                        style={{ borderTopColor: "#00969b" }}
                      ></div>
                      <span>Searching...</span>
                    </div>
                  </div>
                ) : showMinCharMessage ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    Type at least 3 characters to search
                  </div>
                ) : showEmptyState ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    Start typing to search for products
                  </div>
                ) : showNoResults ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    {emptyMessage}
                  </div>
                ) : options.length === 0 ? (
                  <div className="px-4 py-3 text-center text-gray-500">
                    No options available
                  </div>
                ) : (
                  options.map((option) => (
                    <ComboboxOption
                      key={option.value}
                      value={option}
                      className={({ focus, selected }) =>
                        `relative cursor-pointer select-none py-3 px-4 transition-colors ${
                          focus
                            ? "bg-[#00969b] text-white"
                            : selected
                            ? "bg-[rgba(0,150,155,0.08)] text-[#00969b] font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      {({ selected, focus }) => (
                        <div className="flex items-center justify-between w-full">
                          <span
                            className="block truncate flex-1"
                            style={{
                              fontFamily: '"League Spartan", sans-serif',
                            }}
                          >
                            {option.label}
                          </span>
                          {selected && (
                            <span
                              className="ml-2 flex-shrink-0"
                              style={{ color: focus ? "white" : "#00969b" }}
                            >
                              <Check className="w-5 h-5" aria-hidden="true" />
                            </span>
                          )}
                        </div>
                      )}
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </div>
          );
        }}
      </Combobox>
    </div>
  );
};
