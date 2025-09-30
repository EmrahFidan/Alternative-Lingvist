import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const CompletionScreen = ({ targetGoal, allCardsMastered, onReset, onNavigateToSettings }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 150px)', // Yüksekliği ayarla
        textAlign: 'center',
        p: 3,
      }}
    >
      <Paper
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          backgroundColor: 'background.paper',
          maxWidth: 500,
          width: '100%',
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1, fontWeight: 'bold' }}>
          {allCardsMastered ? '🎉 Tebrikler! 🎉' : 'Harika iş!'}
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          {allCardsMastered
            ? 'Bu kelime setindeki tüm kelimeleri tamamladınız!'
            : `Bugünkü ${targetGoal} kelimelik hedefini tamamladın.`}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={onReset} size="large">
            Tekrar Başla
          </Button>
          <Button variant="outlined" color="secondary" onClick={onNavigateToSettings} size="large">
            {allCardsMastered ? 'Ayarlara Git' : 'Yeni Hedef Belirle'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CompletionScreen;
