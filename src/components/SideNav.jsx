import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Book as BookIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const SideNav = ({ open, onToggle }) => {
  const [coursesOpen, setCoursesOpen] = useState(false);

  const handleCoursesToggle = () => {
    setCoursesOpen(!coursesOpen);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
    },
    {
      text: 'Kurslar',
      icon: <SchoolIcon />,
      path: '/courses',
      hasSubItems: true,
      subItems: [
        { text: 'İngilizce', icon: <BookIcon />, path: '/courses/english' },
        { text: 'Almanca', icon: <BookIcon />, path: '/courses/german' },
        { text: 'Fransızca', icon: <BookIcon />, path: '/courses/french' },
      ],
    },
    {
      text: 'Pratik',
      icon: <PlayArrowIcon />,
      path: '/practice',
    },
    {
      text: 'Quiz',
      icon: <QuizIcon />,
      path: '/quiz',
    },
    {
      text: 'Ayarlar',
      icon: <SettingsIcon />,
      path: '/settings',
    },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Kelime Uygulaması
        </Typography>
        <IconButton onClick={onToggle} sx={{ color: 'text.secondary' }}>
          <MenuIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <div key={item.text}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.hasSubItems ? handleCoursesToggle : undefined}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ color: 'text.primary' }}
                />
                {item.hasSubItems && (
                  coursesOpen ? <ExpandLess /> : <ExpandMore />
                )}
              </ListItemButton>
            </ListItem>
            
            {item.hasSubItems && (
              <Collapse in={coursesOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.text} disablePadding>
                      <ListItemButton
                        sx={{
                          pl: 4,
                          mx: 1,
                          mb: 0.5,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(96, 165, 250, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'text.secondary', minWidth: 30 }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={subItem.text}
                          sx={{ color: 'text.secondary' }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNav;