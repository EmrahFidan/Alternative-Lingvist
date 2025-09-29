import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  Typography,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Storage as StorageIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  SportsEsports as GameIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const MinimalSideNav = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    {
      text: 'Pratik',
      icon: <PlayArrowIcon />,
      path: '/',
    },
    {
      text: 'Game',
      icon: <GameIcon />,
      path: '/game',
    },
    {
      text: 'Veri Ekle',
      icon: <AddIcon />,
      path: '/add-data',
    },
    {
      text: 'Veri Yönetimi',
      icon: <StorageIcon />,
      path: '/manage-data',
    },
    {
      text: 'Ayarlar',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      onToggle(); // Mobilde tıklandıktan sonra menüyü kapat
    }
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={onToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          height: '100%',
        },
      }}
    >
      {/* Logo/Başlık Alanı */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 3,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 'bold',
            textAlign: 'center'
          }}
        >
          Alternative
          <br />
          <Typography component="span" variant="h6" sx={{ color: 'secondary.main' }}>
            Lingvist
          </Typography>
        </Typography>
        <IconButton
          onClick={onToggle}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      
      {/* Menü Öğeleri */}
      <List sx={{ flexGrow: 1, pt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  px: 2,
                  backgroundColor: isActive ? 'rgba(96, 165, 250, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? 'rgba(96, 165, 250, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 600 : 400,
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Klavye Kısayolları */}
      {location.pathname === '/' && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              display: 'block',
              mb: 1
            }}
          >
            ⌨️ Klavye Kısayolları:
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
            Enter → Kontrol Et
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
            Tab → Cevabı Göster
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontSize: '0.7rem' }}>
            Esc → Temizle
          </Typography>
        </Box>
      )}

      {/* Alt Bilgi */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            display: 'block'
          }}
        >
          v1.0.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default MinimalSideNav;