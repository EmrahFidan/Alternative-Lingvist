import { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import MinimalSideNav from './MinimalSideNav';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // blue-400
    },
    secondary: {
      main: '#34d399', // emerald-400 for progress
    },
    background: {
      default: '#111827', // gray-900
      paper: '#1f2937', // gray-800
    },
    text: {
      primary: '#f9fafb', // gray-50
      secondary: '#9ca3af', // gray-400
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 400,
      fontSize: '1.8rem',
      color: '#60a5fa',
    },
  },
});

const Layout = ({ children }) => {
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