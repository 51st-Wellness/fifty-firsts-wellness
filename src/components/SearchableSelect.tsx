import React, { useState, useEffect, useRef, useCallback } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

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
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  // Debounced search function with minimum 3 characters
  const debouncedSearch = useRef(
    debounce(async (searchQuery: string) => {
      if (!onSearch || searchQuery.length < 3) {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await onSearch(searchQuery);
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
    if (onSearch) {
      if (query.length >= 3) {
        setIsLoading(true);
        debouncedSearch(query);
      } else if (query.length === 0) {
        setOptions([]);
        setIsLoading(false);
      } else {
        // Less than 3 characters
        setOptions([]);
        setIsLoading(false);
      }
    } else {
      // Filter static options
      const filtered =
        query === ""
          ? staticOptions
          : staticOptions.filter((option) =>
              option.label.toLowerCase().includes(query.toLowerCase())
            );
      setOptions(filtered);
    }
  }, [query, onSearch, staticOptions, debouncedSearch]);

  // Reset options when static options change
  useEffect(() => {
    if (!onSearch) {
      setOptions(staticOptions);
    }
  }, [staticOptions, onSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSelection = (selectedValue: string | null) => {
    const finalValue = selectedValue || "";
    onChange(finalValue);
    setQuery("");
    setIsOpen(false);
  };

  const displayValue = () => {
    if (query && isOpen) {
      return query;
    }
    return selectedOption?.label || "";
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

      <Combobox value={value} onChange={handleSelection} disabled={disabled}>
        {({ open }) => {
          // Update isOpen state
          if (open !== isOpen) {
            setIsOpen(open);
            if (!open) {
              setQuery("");
            }
          }

          return (
            <div className="relative">
              <ComboboxInput
                className={`w-full py-3 pl-4 pr-10 text-sm leading-5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-700 ${
                  disabled ? "bg-gray-100 cursor-not-allowed" : ""
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
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
              </ComboboxButton>

              <ComboboxOptions className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto text-sm focus:outline-none">
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
                      value={option.value}
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4"
                    >
                      {({ selected, focus }) => (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: focus
                              ? "#00969b"
                              : selected
                              ? "rgba(0, 150, 155, 0.1)"
                              : "transparent",
                            color: focus
                              ? "white"
                              : selected
                              ? "#00969b"
                              : "#374151",
                          }}
                        >
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {option.label}
                          </span>
                          {selected && (
                            <span
                              className="absolute inset-y-0 left-0 flex items-center pl-3"
                              style={{ color: focus ? "white" : "#00969b" }}
                            >
                              <Check className="w-4 h-4" aria-hidden="true" />
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
