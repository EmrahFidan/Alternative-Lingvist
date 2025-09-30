// Tema renk paletleri
export const themes = {
  default: {
    name: 'Default',
    colors: {
      background: '#0f172a', // Mevcut koyu mavi
      paper: '#1e293b',
      sidebar: '#1e293b',
    }
  },
  midnight: {
    name: 'Midnight',
    colors: {
      background: '#0a0e1a', // Çok koyu mavi-siyah
      paper: '#151b2e',
      sidebar: '#151b2e',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      background: '#0d1b2a', // Derin okyanus mavisi
      paper: '#1b263b',
      sidebar: '#1b263b',
    }
  },
  forest: {
    name: 'Forest',
    colors: {
      background: '#1a1f1e', // Koyu yeşilimsi gri
      paper: '#252d2b',
      sidebar: '#252d2b',
    }
  },
  purple: {
    name: 'Purple Night',
    colors: {
      background: '#1a0f2e', // Koyu mor
      paper: '#2d1b4e',
      sidebar: '#1e1537',
    }
  }
};

// Temaya göre MUI theme oluştur
export const getThemeConfig = (themeName) => {
  const theme = themes[themeName] || themes.default;

  return {
    palette: {
      mode: 'dark',
      background: {
        default: theme.colors.background,
        paper: theme.colors.paper,
      },
      primary: {
        main: '#60a5fa',
      },
      secondary: {
        main: '#60a5fa',
      },
      text: {
        primary: '#ccc9dc',
        secondary: '#ccc9dc',
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: theme.colors.sidebar,
          }
        }
      }
    }
  };
};