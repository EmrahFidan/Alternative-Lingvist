import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import useSettingsStore from '../store/useSettingsStore';

const SettingsPage = () => {
  const {
    targetGoal,
    setTargetGoal
  } = useSettingsStore();
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const newGoal = event.target.elements.goal.value;
    setTargetGoal(newGoal);
    alert('Hedef güncellendi!');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
        Ayarlar
      </Typography>
      <Paper sx={{ p: 4, backgroundColor: 'background.paper', borderRadius: 3 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            Günlük Kelime Hedefi
          </Typography>
          <TextField
            fullWidth
            type="number"
            name="goal"
            defaultValue={targetGoal}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            Kaydet
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
