import { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Fade,
  IconButton,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const Flashcard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Statik veri - daha sonra props olarak alınacak
  const cardData = {
    frontText: "I need to _____ my English skills before the exam.",
    backText: "I need to improve my English skills before the exam.",
    correctAnswer: "improve",
    translation: "Sınavdan önce İngilizce becerilerimi geliştirmem gerekiyor.",
    difficulty: "Orta",
    category: "Fiiller"
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(false);
    setFeedback(null);
  };

  const handleAnswerSubmit = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === cardData.correctAnswer.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setShowAnswer(true);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
    setFeedback(null);
  };

  const handleReset = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setFeedback(null);
    setIsFlipped(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && userAnswer.trim() && !showAnswer) {
      handleAnswerSubmit();
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      {/* Kart Bilgileri */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Kategori: {cardData.category}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Zorluk: {cardData.difficulty}
        </Typography>
      </Box>

      {/* Ana Flashcard */}
      <Card
        sx={{
          minHeight: 300,
          backgroundColor: 'background.paper',
          border: '2px solid',
          borderColor: isFlipped ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s ease',
          position: 'relative',
          mb: 3,
        }}
      >
        <CardActionArea 
          onClick={handleCardFlip}
          sx={{ height: '100%', minHeight: 300 }}
        >
          <CardContent sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            p: 4
          }}>
            <Fade in={!isFlipped} timeout={300}>
              <Box sx={{ display: !isFlipped ? 'block' : 'none' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.primary', 
                    mb: 3,
                    fontWeight: 'medium',
                    lineHeight: 1.6
                  }}
                >
                  {cardData.frontText}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Boşluğu doldurun
                </Typography>
              </Box>
            </Fade>

            <Fade in={isFlipped} timeout={300}>
              <Box sx={{ display: isFlipped ? 'block' : 'none' }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'text.primary', 
                    mb: 2,
                    fontWeight: 'medium',
                    lineHeight: 1.6
                  }}
                >
                  {cardData.backText}
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2, 
                    backgroundColor: 'rgba(96, 165, 250, 0.1)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    mt: 2
                  }}
                >
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {cardData.translation}
                  </Typography>
                </Paper>
              </Box>
            </Fade>
          </CardContent>
        </CardActionArea>

        {/* Flip İkonu */}
        <IconButton
          onClick={handleCardFlip}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Card>

      {/* Cevap Girişi */}
      {!isFlipped && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Cevabınızı yazın"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'text.secondary',
              },
            }}
            disabled={showAnswer}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleAnswerSubmit}
              disabled={!userAnswer.trim() || showAnswer}
              startIcon={<CheckIcon />}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Kontrol Et
            </Button>

            <Button
              variant="outlined"
              onClick={handleShowAnswer}
              disabled={showAnswer}
              startIcon={<VisibilityIcon />}
              sx={{
                borderColor: 'text.secondary',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'text.primary',
                  color: 'text.primary',
                },
              }}
            >
              Cevabı Göster
            </Button>

            <Button
              variant="outlined"
              onClick={handleReset}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: 'text.secondary',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'text.primary',
                  color: 'text.primary',
                },
              }}
            >
              Sıfırla
            </Button>
          </Box>
        </Box>
      )}

      {/* Geri Bildirim */}
      {feedback && (
        <Fade in={Boolean(feedback)} timeout={500}>
          <Paper
            sx={{
              p: 2,
              textAlign: 'center',
              backgroundColor: feedback === 'correct' 
                ? 'rgba(52, 211, 153, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${feedback === 'correct' 
                ? 'rgba(52, 211, 153, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              {feedback === 'correct' ? (
                <CheckIcon sx={{ color: '#34d399', mr: 1 }} />
              ) : (
                <CancelIcon sx={{ color: '#ef4444', mr: 1 }} />
              )}
              <Typography 
                variant="h6" 
                sx={{ 
                  color: feedback === 'correct' ? '#34d399' : '#ef4444',
                  fontWeight: 'bold'
                }}
              >
                {feedback === 'correct' ? 'Doğru!' : 'Yanlış!'}
              </Typography>
            </Box>
            
            {feedback === 'incorrect' && (
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                Doğru cevap: <strong>{cardData.correctAnswer}</strong>
              </Typography>
            )}
          </Paper>
        </Fade>
      )}
    </Box>
  );
};

export default Flashcard;