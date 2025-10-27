import { createTheme, ThemeOptions } from "@mui/material/styles";

// Custom Material-UI theme to match the site's branding
const muiTheme: ThemeOptions = {
  palette: {
    primary: {
      main: "#00969b", // brand-green
      light: "#00a8ae", // brand-green-light
      dark: "#007a7e", // brand-green-dark
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5f42e5", // brand-purple
      light: "#6b4ef0", // brand-purple-light
      dark: "#4a2dd1", // brand-purple-dark
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb", // gray-50
      paper: "#ffffff",
    },
    text: {
      primary: "#111827", // gray-900
      secondary: "#6b7280", // gray-500
    },
    divider: "#e5e7eb", // gray-200
    error: {
      main: "#ef4444",
      light: "#fecaca",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fef3c7",
      dark: "#d97706",
    },
    success: {
      main: "#10b981",
      light: "#d1fae5",
      dark: "#047857",
    },
    info: {
      main: "#3b82f6",
      light: "#dbeafe",
      dark: "#1d4ed8",
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "2rem",
      lineHeight: 1.25,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      textTransform: "none",
      letterSpacing: "0.02em",
    },
    caption: {
      fontFamily: '"Quicksand", sans-serif',
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
    overline: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 500,
      fontSize: "0.75rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: "0.9375rem",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.12)",
          },
        },
        contained: {
          "&.MuiButton-containedPrimary": {
            backgroundColor: "#00969b",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#007a7e",
            },
            "&:active": {
              backgroundColor: "#006b70",
            },
          },
          "&.MuiButton-containedSecondary": {
            backgroundColor: "#5f42e5",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#4a2dd1",
            },
          },
        },
        outlined: {
          "&.MuiButton-outlinedPrimary": {
            borderColor: "#00969b",
            color: "#00969b",
            "&:hover": {
              borderColor: "#007a7e",
              backgroundColor: "rgba(0, 150, 155, 0.04)",
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
          "&:hover": {
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00969b",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#00969b",
              borderWidth: 2,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#00969b",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: "0.8125rem",
        },
        colorPrimary: {
          backgroundColor: "#00969b",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#007a7e",
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.9375rem",
          fontFamily: '"Poppins", sans-serif',
          "&.Mui-selected": {
            color: "#00969b",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: "#00969b",
            height: 3,
            borderRadius: "3px 3px 0 0",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover": {
            backgroundColor: "rgba(0, 150, 155, 0.04)",
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-head": {
            backgroundColor: "#f9fafb",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#374151",
            fontFamily: '"Poppins", sans-serif',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 600,
          fontSize: "1.5rem",
        },
      },
    },
    // Override any potential serif fonts in other components
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
        },
        h1: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h2: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h3: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h4: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h5: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        h6: {
          fontFamily: '"Playfair Display", "Quicksand", "Roboto", "Helvetica", "Arial", sans-serif',
        },
      },
    },
  },
};

export const theme = createTheme(muiTheme);