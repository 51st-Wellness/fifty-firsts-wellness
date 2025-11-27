import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

interface NumberInputProps
  extends Omit<TextFieldProps, "onChange" | "value" | "type"> {
  value: number;
  onChange: (value: number) => void;
  allowDecimals?: boolean;
  max?: number;
  min?: number;
  decimalPlaces?: number;
}

// Reusable number input component that allows proper decimal typing experience
const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  allowDecimals = true,
  max,
  min = 0,
  decimalPlaces,
  onBlur,
  ...textFieldProps
}) => {
  const [displayValue, setDisplayValue] = React.useState<string>("");

  // Sync display value with prop value when it changes externally
  React.useEffect(() => {
    setDisplayValue(value === 0 ? "" : String(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // Allow empty string
    if (val === "") {
      setDisplayValue("");
      onChange(0);
      return;
    }

    // For decimals: allow digits, one dot, and intermediate states like ".", "25.", "0."
    if (allowDecimals) {
      // Allow: empty, digits, single dot, or digits with dot
      if (/^\.?\d*\.?\d*$/.test(val)) {
        // Don't allow multiple dots
        if ((val.match(/\./g) || []).length > 1) {
          return;
        }

        setDisplayValue(val);

        // Only update the actual value if it's a valid number
        const numVal = parseFloat(val);
        if (!isNaN(numVal)) {
          // Check max constraint
          if (max !== undefined && numVal > max) {
            return;
          }
          // Check min constraint during typing only if the value is complete
          if (min !== undefined && numVal < min && !val.endsWith(".")) {
            return;
          }
          onChange(numVal);
        } else if (val === "." || val === "0.") {
          // Allow intermediate states but keep value at 0
          onChange(0);
        }
      }
    } else {
      // For integers: only allow digits
      if (/^\d*$/.test(val)) {
        setDisplayValue(val);
        const numVal = parseInt(val, 10);
        if (!isNaN(numVal)) {
          // Check max constraint
          if (max !== undefined && numVal > max) {
            return;
          }
          // Check min constraint
          if (min !== undefined && numVal < min) {
            return;
          }
          onChange(numVal);
        }
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Clean up trailing dots and leading dots on blur
    let cleanValue = displayValue;

    if (cleanValue.endsWith(".")) {
      cleanValue = cleanValue.slice(0, -1);
    }

    if (cleanValue.startsWith(".")) {
      cleanValue = "0" + cleanValue;
    }

    // Apply decimal places limit if specified
    if (decimalPlaces !== undefined && cleanValue.includes(".")) {
      const numVal = parseFloat(cleanValue);
      if (!isNaN(numVal)) {
        cleanValue = numVal.toFixed(decimalPlaces);
      }
    }

    const finalValue = parseFloat(cleanValue) || 0;

    // Apply min/max constraints
    let constrainedValue = finalValue;
    if (min !== undefined) {
      constrainedValue = Math.max(min, constrainedValue);
    }
    if (max !== undefined) {
      constrainedValue = Math.min(max, constrainedValue);
    }

    setDisplayValue(constrainedValue === 0 ? "" : String(constrainedValue));
    onChange(constrainedValue);

    // Call original onBlur if provided
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <TextField
      {...textFieldProps}
      type="text"
      inputProps={{
        inputMode: allowDecimals ? "decimal" : "numeric",
        ...textFieldProps.inputProps,
      }}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default NumberInput;
