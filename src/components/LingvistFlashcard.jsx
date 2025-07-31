
import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,

  TextField,
  LinearProgress,
  IconButton,
  Paper,
  Fade,
  Button,
} from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const LingvistFlashcard = () => {
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(17); // 17/25
  const [targetGoal, setTargetGoal] = useState(25); // Hedef ayarlanabilir
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcardData, setFlashcardData] = useState([]);

  // Varsayılan veri
  const defaultData = [
    {
      sentence: "I went to lunch with some of my",
      missingWord: "friends",
      translation: "Ben arkadaşlarımdan bazıları ile öğle yemeğine gittim.",
      translationWithUnderline: "Ben <u>arkadaşlarımdan</u> bazıları ile öğle yemeğine gittim.",
    },
    {
      sentence: "She is studying for her",
      missingWord: "exam",
      translation: "O sınavı için çalışıyor.",
      translationWithUnderline: "O <u>sınavı</u> için çalışıyor.",
    },
    {
      sentence: "We need to buy some",
      missingWord: "groceries",
      translation: "Biraz market alışverişi yapmamız gerekiyor.",
      translationWithUnderline: "Biraz <u>market alışverişi</u> yapmamız gerekiyor.",
    },
  ];

  // Component mount olduğunda localStorage'dan veri yükle
  useEffect(() => {
    const savedData = localStorage.getItem('flashcardData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.length > 0) {
          setFlashcardData(parsedData);
        } else {
          setFlashcardData(defaultData);
        }
      } catch (error) {
        console.error('localStorage veri okuma hatası:', error);
        setFlashcardData(defaultData);
      }
    } else {
      setFlashcardData(defaultData);
    }
  }, []);

  const cardData = useMemo(() => {
    const currentCard = flashcardData.length > 0 ? flashcardData[currentCardIndex] : {};

    // HATA AYIKLAMA: Mevcut kart verisini incelemek için konsola yazdır.
    console.log("Mevcut kart verisi:", currentCard);

    let sentenceStart = 'Veri yükleniyor...';
    let sentenceEnd = '';

    // Cümlenin var olup olmadığını ve bir metin olup olmadığını kontrol et
    if (currentCard && typeof currentCard.sentence === 'string') {
      const parts = currentCard.sentence.split('___');
      sentenceStart = parts[0];
      if (parts.length > 1) {
        sentenceEnd = parts[1];
      } else {
        // Bu durum, cümlede '___' bulunmadığında gerçekleşir.
        console.warn("Uyarı: Cümlede '___' bulunamadı:", currentCard.sentence);
      }
    } else if (flashcardData.length > 0) {
      console.error("Hata: currentCard.sentence bir metin değil veya eksik.", currentCard);
    }

    return {
      ...currentCard,
      sentenceStart,
      sentenceEnd,
      progress: { current: currentProgress, total: targetGoal },
      audioUrl: null
    };
  }, [flashcardData, currentCardIndex, currentProgress, targetGoal]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setUserInput(value);
    
    // Otomatik kontrol - kullanıcı doğru kelimeyi yazarsa
    if (value.toLowerCase().trim() === cardData.missingWord.toLowerCase()) {
      setIsCorrect(true);
      setShowFeedback(true);
      // 2 saniye sonra sonraki soruya geç
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkAnswer();
    }
  };

  const checkAnswer = () => {
    const correct = userInput.toLowerCase().trim() === cardData.missingWord.toLowerCase();
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setTimeout(() => {
        handleNextQuestion();
      }, 2000);
    }
  };

  const handleNextQuestion = () => {
    setUserInput('');
    setIsCorrect(null);
    setShowFeedback(false);
    setCurrentProgress(prev => prev + 1);
    
    // Sonraki karta geç
    if (flashcardData.length > 0) {
      setCurrentCardIndex(prev => (prev + 1) % flashcardData.length);
    }
  };

  const handleSkip = () => {
    setUserInput(cardData.missingWord);
    setIsCorrect(false);
    setShowFeedback(true);
    setTimeout(() => {
      handleNextQuestion();
    }, 3000);
  };

  const handleGoalChange = () => {
    const newGoal = prompt('Günlük hedef sayısını giriniz:', targetGoal);
    if (newGoal && !isNaN(newGoal) && parseInt(newGoal) > 0) {
      setTargetGoal(parseInt(newGoal));
    }
  };

  const playAudio = () => {
    // Ses çalma fonksiyonu
    console.log('Playing audio...');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Üst İlerleme Çubuğu */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          p: 3,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', mr: 'auto', fontWeight: 'bold' }}>
            {cardData.progress.current}/{cardData.progress.total}
          </Typography>
          <Button
            onClick={handleGoalChange}
            size="small"
            startIcon={<SettingsIcon />}
            sx={{ 
              color: 'primary.main',
              mr: 2,
              '&:hover': {
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
              },
            }}
          >
            Hedef Belirle
          </Button>
          <IconButton
            onClick={handleSkip}
            size="small"
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <LinearProgress
          variant="determinate"
          value={(cardData.progress.current / cardData.progress.total) * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'secondary.main',
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Ana İçerik Alanı */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          px: 4,
          py: 4,
          mt: 12, // Üst bar için space
        }}
      >
        {/* Container */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            p: 4,
            mb: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: 800,
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Cümle */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: 'primary.main',
                fontWeight: 400,
                fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                lineHeight: 1.4,
                mb: 3,
              }}
            >
              {cardData.sentenceStart}
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  minWidth: '120px',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                  mx: 1,
                  position: 'relative',
                }}
              >
                {userInput && (
                  <Typography
                    component="span"
                    sx={{
                      color: showFeedback
                        ? isCorrect
                          ? 'secondary.main'
                          : 'error.main'
                        : 'primary.main',
                      fontWeight: 500,
                    }}
                  >
                    {userInput}
                  </Typography>
                )}
              </Box>
              {cardData.sentenceEnd}
            </Typography>
          </Box>
        </Box>

        {/* Türkçe Çeviri Container */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            p: 3,
            mb: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: 600,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              fontSize: '1.1rem',
              lineHeight: 1.6,
              '& u': {
                textDecoration: 'underline',
                textDecorationColor: 'primary.main',
                textDecorationThickness: '2px',
                textUnderlineOffset: '3px',
                color: 'primary.main',
                fontWeight: 'medium',
              },
            }}
            dangerouslySetInnerHTML={{ __html: cardData.translationWithUnderline }}
          />
        </Box>

        {/* Giriş Alanı Container */}
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 3,
            p: 3,
            mb: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            maxWidth: 500,
            mx: 'auto',
            width: '100%',
          }}
        >
          <TextField
            fullWidth
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Kelimeyi yazın..."
            variant="outlined"
            disabled={showFeedback && isCorrect}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                fontSize: '1.1rem',
                '& fieldset': {
                  borderColor: showFeedback
                    ? isCorrect
                      ? 'secondary.main'
                      : 'error.main'
                    : 'rgba(255, 255, 255, 0.3)',
                  borderWidth: 2,
                },
                '&:hover fieldset': {
                  borderColor: showFeedback
                    ? isCorrect
                      ? 'secondary.main'
                      : 'error.main'
                    : 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiOutlinedInput-input': {
                textAlign: 'center',
                py: 2,
                color: 'text.primary',
              },
            }}
            autoFocus
          />
        </Box>

        {/* Geri Bildirim Container */}
        {showFeedback && (
          <Fade in={showFeedback} timeout={500}>
            <Box
              sx={{
                backgroundColor: 'background.paper',
                borderRadius: 3,
                p: 4,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                maxWidth: 600,
                mx: 'auto',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {isCorrect ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <CheckIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 32 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: 'secondary.main', fontWeight: 500 }}
                  >
                    Doğru!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: 'error.main', fontWeight: 500, mb: 1 }}
                  >
                    Doğru cevap: {cardData.missingWord}
                  </Typography>
                </Box>
              )}
              
              {/* Çeviri */}
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  mt: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                >
                  {cardData.translation}
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default LingvistFlashcard;