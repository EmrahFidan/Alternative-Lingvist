import { useState, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import LingvistFlashcard from './components/LingvistFlashcard';
import MinimalSideNav from './components/MinimalSideNav';
import AddDataPage from './components/AddDataPage';
import ManageDataPage from './components/ManageDataPage';
import SettingsPage from './components/SettingsPage';
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

  return (
    <Layout>
      <MinimalSideNav
        open={sideNavOpen}
        onToggle={handleSideNavToggle}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      

      {/* Ana İçerik - Bileşenlerin durumunu korumak için hepsi render ediliyor, sadece aktif olan gösteriliyor */}
      <Box sx={{ ml: sideNavOpen ? '60px' : '0px', transition: 'margin-left 0.3s ease' }}>
        <Box sx={{ display: currentView === 'practice' ? 'block' : 'none' }}><LingvistFlashcard onViewChange={handleViewChange} /></Box>
        <Box sx={{ display: currentView === 'addData' ? 'block' : 'none' }}><AddDataPage /></Box>
        <Box sx={{ display: currentView === 'manageData' ? 'block' : 'none' }}><ManageDataPage /></Box>
        <Box sx={{ display: currentView === 'settings' ? 'block' : 'none' }}><SettingsPage /></Box>
      </Box>
    </Layout>
  );
}

export default App;
