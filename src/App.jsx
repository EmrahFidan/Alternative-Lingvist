import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LingvistFlashcard from './components/LingvistFlashcard';
import MinimalSideNav from './components/MinimalSideNav';
import AddDataPage from './components/AddDataPage';
import ManageDataPage from './components/ManageDataPage';
import SettingsPage from './components/SettingsPage';
import { Box } from '@mui/material';

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(window.innerWidth > 768);
  const location = useLocation();

  const handleSideNavToggle = () => {
    setSideNavOpen(!sideNavOpen);
  };

  // Sayfa başlıklarını belirle
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Pratik';
      case '/add-data': return 'Veri Ekleme';
      case '/manage-data': return 'Veri Yönetimi';
      case '/settings': return 'Ayarlar';
      default: return 'Alternative Lingvist';
    }
  };

  return (
    <Layout>
      <MinimalSideNav
        open={sideNavOpen}
        onToggle={handleSideNavToggle}
      />
      
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