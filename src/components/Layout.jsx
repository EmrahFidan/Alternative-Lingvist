import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import useSettingsStore from '../stores/useSettingsStore';
import { getThemeConfig } from '../theme/themes';

const Layout = ({ children }) => {
  const themeName = useSettingsStore((state) => state.theme);

  const theme = useMemo(() => {
    const themeConfig = getThemeConfig(themeName);

    return createTheme({
      ...themeConfig,
      palette: {
        ...themeConfig.palette,
        primary: {
          main: '#3b82f6',
          light: '#60a5fa',
          dark: '#1d4ed8',
        },
        secondary: {
          main: '#10b981',
          light: '#34d399',
          dark: '#047857',
        },
        error: {
          main: '#ef4444',
          light: '#f87171',
        },
        warning: {
          main: '#f59e0b',
          light: '#fbbf24',
        },
        info: {
          main: '#06b6d4',
          light: '#22d3ee',
        },
        success: {
          main: '#10b981',
          light: '#34d399',
        },
        divider: 'rgba(148, 163, 184, 0.12)',
      },
      typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
          fontWeight: 700,
          fontSize: '2.5rem',
          lineHeight: 1.2,
        },
        h2: {
          fontWeight: 600,
          fontSize: '2rem',
          lineHeight: 1.3,
        },
        h3: {
          fontWeight: 600,
          fontSize: '1.75rem',
          lineHeight: 1.3,
        },
        h4: {
          fontWeight: 600,
          fontSize: '1.5rem',
          lineHeight: 1.4,
        },
        h5: {
          fontWeight: 600,
          fontSize: '1.25rem',
          lineHeight: 1.4,
        },
        h6: {
          fontWeight: 600,
          fontSize: '1.125rem',
          lineHeight: 1.4,
        },
        body1: {
          fontSize: '1rem',
          lineHeight: 1.6,
        },
        body2: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
        button: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        ...themeConfig.components,
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
            },
            contained: {
              '&:hover': {
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              border: '1px solid rgba(148, 163, 184, 0.12)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              border: '1px solid rgba(148, 163, 184, 0.12)',
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
      },
    });
  }, [themeName]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;