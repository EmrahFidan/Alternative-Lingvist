import { Box, Typography, Slider, Button, Paper } from '@mui/material';
import useSettingsStore from '../stores/useSettingsStore';
import { useState, useEffect } from 'react';

const SettingsPage = () => {
  const {
    targetGoal,
    setTargetGoal
  } = useSettingsStore();
  
  const [sliderValue, setSliderValue] = useState(targetGoal);
  const [maxWords, setMaxWords] = useState(10);

  // Kelime listesindeki toplam kelime sayısını al
  useEffect(() => {
    const savedData = localStorage.getItem('flashcardData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setMaxWords(parsedData.length || 10);
      } catch (error) {
        console.error('localStorage veri okuma hatası:', error);
        setMaxWords(3); // Varsayılan veri sayısı
      }
    } else {
      setMaxWords(3); // Varsayılan veri sayısı
    }
  }, []);
  
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSave = () => {
    setTargetGoal(sliderValue);
    alert('Hedef güncellendi!');
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', mb: 3 }}>
        Ayarlar
      </Typography>
      <Paper sx={{ p: 4, backgroundColor: 'background.paper', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          Günlük Kelime Hedefi
        </Typography>
        
        {/* Hedef Değeri Gösterimi */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {sliderValue}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            kelime / gün
          </Typography>
        </Box>

        {/* Slider */}
        <Box sx={{ px: 3, mb: 4 }}>
          <Slider
            value={sliderValue}
            onChange={handleSliderChange}
            min={1}
            max={maxWords}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{
              color: 'secondary.main',
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: 'secondary.main',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(96, 165, 250, 0.16)',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: 'secondary.main',
                border: 'none',
                height: 8,
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                height: 8,
              },
              '& .MuiSlider-mark': {
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                width: 3,
                height: 3,
              },
              '& .MuiSlider-markActive': {
                backgroundColor: 'secondary.main',
              },
            }}
          />
        </Box>

        {/* Min-Max Gösterimi */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Min: 1
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Max: {maxWords}
          </Typography>
        </Box>

        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          fullWidth
          sx={{ py: 1.5 }}
        >
          Kaydet
        </Button>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
