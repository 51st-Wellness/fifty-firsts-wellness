// Extract date part (YYYY-MM-DD) from ISO string for date input
export const toInputValue = (value?: string | Date | null) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Convert date string to ISO with start of day (00:00:00)
export const toStartOfDayISO = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

// Convert date string to ISO with end of day (23:59:59)
export const toEndOfDayISO = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

// Infer whether usage/benefits look like lists (multiple non-empty lines)
export const inferIsList = (raw?: string | null): boolean => {
  if (!raw) return false;
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length > 1;
};

