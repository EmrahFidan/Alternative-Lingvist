import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import LingvistFlashcard from './components/LingvistFlashcard';
import MinimalSideNav from './components/MinimalSideNav';
import AddDataPage from './components/AddDataPage';
import ManageDataPage from './components/ManageDataPage';
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

  return (
    <Layout>
      <MinimalSideNav
        open={sideNavOpen}
        onToggle={handleSideNavToggle}
        currentView={currentView}
        onViewChange={handleViewChange}
      />
      

      {/* Ana İçerik */}
      <Box sx={{ ml: sideNavOpen ? '60px' : '0px', transition: 'margin-left 0.3s ease' }}>
        {renderCurrentView()}
      </Box>
    </Layout>
  );
}

export default App;