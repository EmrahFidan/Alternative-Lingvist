<<<<<<< HEAD
import { useState, useMemo } from 'react';
=======
import { useState } from 'react';
>>>>>>> 6bab33a0f929548b673c8567c32455a24369fe9b
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import LingvistFlashcard from './components/LingvistFlashcard';
import MinimalSideNav from './components/MinimalSideNav';
import AddDataPage from './components/AddDataPage';
import ManageDataPage from './components/ManageDataPage';
<<<<<<< HEAD
import SettingsPage from './components/SettingsPage';
=======
>>>>>>> 6bab33a0f929548b673c8567c32455a24369fe9b
import { IconButton, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(true); // Hep açık
  const [currentView, setCurrentView] = useState('practice'); // practice, addData, settings

  const handleSideNavToggle = () => {
    // Menü artık kapanmayacak
    return;
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

<<<<<<< HEAD
=======
  const renderCurrentView = () => {
    switch (currentView) {
      case 'practice':
        return <LingvistFlashcard />;
      case 'addData':
        return <AddDataPage />;
      case 'manageData':
        return <ManageDataPage />;
      case 'settings':
        return <div style={{ padding: '2rem', color: '#f9fafb' }}>Ayarlar sayfası - Yakında gelecek</div>;
      default:
        return <LingvistFlashcard />;
    }
  };

>>>>>>> 6bab33a0f929548b673c8567c32455a24369fe9b
  return (
    <Layout>
      <MinimalSideNav
        open={sideNavOpen}
        onToggle={handleSideNavToggle}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      

<<<<<<< HEAD
      {/* Ana İçerik - Bileşenlerin durumunu korumak için hepsi render ediliyor, sadece aktif olan gösteriliyor */}
      <Box sx={{ ml: sideNavOpen ? '60px' : '0px', transition: 'margin-left 0.3s ease' }}>
        <Box sx={{ display: currentView === 'practice' ? 'block' : 'none' }}><LingvistFlashcard onViewChange={handleViewChange} /></Box>
        <Box sx={{ display: currentView === 'addData' ? 'block' : 'none' }}><AddDataPage /></Box>
        <Box sx={{ display: currentView === 'manageData' ? 'block' : 'none' }}><ManageDataPage /></Box>
        <Box sx={{ display: currentView === 'settings' ? 'block' : 'none' }}><SettingsPage /></Box>
=======
      {/* Ana İçerik */}
      <Box sx={{ ml: sideNavOpen ? '60px' : '0px', transition: 'margin-left 0.3s ease' }}>
        {renderCurrentView()}
>>>>>>> 6bab33a0f929548b673c8567c32455a24369fe9b
      </Box>
    </Layout>
  );
}

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 6bab33a0f929548b673c8567c32455a24369fe9b
