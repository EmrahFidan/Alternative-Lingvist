import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LingvistFlashcard from './components/LingvistFlashcard';
import MinimalSideNav from './components/MinimalSideNav';
import AddDataPage from './components/AddDataPage';
import ManageDataPage from './components/ManageDataPage';
import SettingsPage from './components/SettingsPage';
import { Box, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(window.innerWidth > 768);

  const handleSideNavToggle = () => {
    setSideNavOpen(!sideNavOpen);
  };


  return (
    <Layout>
      <MinimalSideNav
        open={sideNavOpen}
        onToggle={handleSideNavToggle}
      />
      
      {/* Menu Toggle Button - Always Visible */}
      {!sideNavOpen && (
        <IconButton
          onClick={handleSideNavToggle}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: 'background.paper',
            color: 'primary.main',
            boxShadow: 2,
            '&:hover': {
              backgroundColor: 'rgba(96, 165, 250, 0.1)',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      
      {/* Ana İçerik */}
      <Box 
        component="main"
        sx={{ 
          ml: sideNavOpen ? '240px' : '0px',
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          '@media (max-width: 768px)': {
            ml: 0,
          }
        }}
      >
        <Routes>
          <Route path="/" element={<LingvistFlashcard />} />
          <Route path="/add-data" element={<AddDataPage />} />
          <Route path="/manage-data" element={<ManageDataPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </Layout>
  );
}

export default App;