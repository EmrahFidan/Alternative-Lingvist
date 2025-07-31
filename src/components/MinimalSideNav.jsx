import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Home as HomeIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const MinimalSideNav = ({ open, onToggle, currentView, onViewChange }) => {
  const menuItems = [
    {
      text: 'Pratik',
      icon: <PlayArrowIcon />,
      view: 'practice',
    },
    {
      text: 'Veri Ekle',
      icon: <SchoolIcon />,
      view: 'addData',
    },
    {
      text: 'Veri Yönetimi',
      icon: <StorageIcon />,
      view: 'manageData',
    },
    {
      text: 'Ayarlar',
      icon: <SettingsIcon />,
      view: 'settings',
    },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 60,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Menü Toggle Butonu */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
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
      <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <Tooltip title={item.text} placement="right">
              <ListItemButton
                onClick={() => onViewChange(item.view)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2,
                  backgroundColor: currentView === item.view ? 'rgba(96, 165, 250, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: currentView === item.view 
                      ? 'rgba(96, 165, 250, 0.3)' 
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: currentView === item.view ? 'primary.main' : 'text.secondary',
                    minWidth: 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MinimalSideNav;