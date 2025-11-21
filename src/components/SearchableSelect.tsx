import React, { useState, useEffect, useRef, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
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
      const searchFn = onSearchRef.current;
      if (!searchFn || !searchQuery.trim()) {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchFn(searchQuery);
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
    const hasSearchFn = typeof onSearch === "function";

    if (hasSearchFn && query.trim()) {
      setIsLoading(true);
      debouncedSearch(query);
    } else if (!hasSearchFn) {
      // Filter static options
      const filtered =
        query === ""
          ? staticOptions
          : staticOptions.filter((option) =>
              option.label.toLowerCase().includes(query.toLowerCase())
            );
      setOptions(filtered);
    } else if (hasSearchFn && !query.trim()) {
      // Clear options when query is empty and using onSearch
      setOptions([]);
      setIsLoading(false);
    }
  }, [query, onSearch, staticOptions, debouncedSearch]);

  // Reset options when static options change
  useEffect(() => {
    if (typeof onSearch !== "function" && !query) {
      setOptions(staticOptions);
    }
  }, [staticOptions, onSearch, query]);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

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
        value={value}
        onChange={(newValue) => {
          const selectedValue = newValue || "";
          onChange(selectedValue);
        }}
        onClose={() => setQuery("")}
        disabled={disabled}
      >
        <div className="relative w-full">
          <div className="flex items-center w-full">
            <ComboboxInput
              className={`w-full py-3 pr-10 text-sm leading-5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors text-gray-700 ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              style={{ fontFamily: '"League Spartan", sans-serif' }}
              displayValue={() => selectedOption?.label || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <ComboboxButton className="absolute right-0 inset-y-0 flex items-center pr-3 pointer-events-none">
              <ChevronsUpDown className="w-4 h-4 text-gray-400 shrink-0" />
            </ComboboxButton>
          </div>
          <ComboboxOptions className="absolute z-50 bg-white shadow-lg mt-1 py-1 border border-gray-300 rounded-lg focus:outline-none w-full max-h-60 overflow-auto text-sm">
            {/* Search Input for HeadlessUI */}
            {onSearch && (
              <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
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
            )}

            {isLoading ? (
              <div className="relative px-4 py-2 text-gray-500 cursor-default select-none">
                Loading...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="relative px-4 py-2 text-gray-500 cursor-default select-none">
                {query !== "" ? emptyMessage : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <ComboboxOption
                  key={option.value}
                  value={option.value}
                  className={({ focus }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      focus
                        ? "bg-brand-green text-white"
                        : "text-gray-700 hover:bg-brand-green/10"
                    }`
                  }
                >
                  {({ selected, focus }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            focus ? "text-white" : "text-brand-green"
                          }`}
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
};
