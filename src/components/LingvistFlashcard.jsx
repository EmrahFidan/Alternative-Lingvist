import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Levenshtein from 'fast-levenshtein';
import CompletionScreen from './CompletionScreen';
import useSettingsStore from '../store/useSettingsStore';
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

// --- Yardımcı Fonksiyonlar (Bileşen Dışında) ---
const editDistance = (s1, s2) => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
};

const calculateSimilarity = (s1, s2) => {
  let longer = s1;
  let shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  const longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

const LingvistFlashcard = () => {
  const navigate = useNavigate();
  const {
    targetGoal,
    currentProgress,
    incrementProgress,
    resetProgress,
  } = useSettingsStore();

  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flashcardData, setFlashcardData] = useState([]);
  const inputRef = useRef(null);

  // Bileşen yüklendiğinde ilerlemeyi sıfırla
  useEffect(() => {
    resetProgress();
  }, [resetProgress]);

  // Her yeni kart yüklendiğinde input alanına odaklan
  useEffect(() => {
    if (!showFeedback && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentCardIndex, showFeedback]);

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

    console.log("Mevcut kart verisi:", currentCard);

    let sentenceStart = 'Veri yükleniyor...';
    let sentenceEnd = '';

    if (currentCard && typeof currentCard.sentence === 'string') {
      let sentenceToProcess = currentCard.sentence;
      const missingWord = currentCard.missingWord;

      if (missingWord && sentenceToProcess.includes(missingWord)) {
        sentenceToProcess = sentenceToProcess.replace(missingWord, '___');
      }

      let parts;
      if (sentenceToProcess.includes('______')) {
        parts = sentenceToProcess.split('______');
      } else if (sentenceToProcess.includes('___')) {
        parts = sentenceToProcess.split('___');
      } else {
        parts = [sentenceToProcess, ''];
      }
      
      sentenceStart = parts[0].trim();
      sentenceEnd = parts.length > 1 ? parts[1].trim() : '';
      
      console.log("Parsed sentence - Start:", sentenceStart, "End:", sentenceEnd);
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

  const [feedbackColor, setFeedbackColor] = useState('default');
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !showFeedback) {
      checkAnswer();
    }
  };

  // Küresel klavye kısayolları
  useEffect(() => {
    const handleGlobalKeyPress = (event) => {
      if (document.activeElement !== inputRef.current) {
        switch (event.key.toLowerCase()) {
          case 'escape':
            if (userInput) {
              setUserInput('');
              event.preventDefault();
            }
            break;
          case 'tab':
            handleShowAnswer();
            event.preventDefault();
            break;
          case ' ':
            if (showFeedback && isCorrect) {
              handleNextQuestion();
              event.preventDefault();
            }
            break;

        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyPress);
    return () => document.removeEventListener('keydown', handleGlobalKeyPress);
  }, [userInput, showFeedback, isCorrect]);

  const checkAnswer = () => {
    const userAnswer = userInput.toLowerCase().trim();
    const correctAnswer = cardData.missingWord.toLowerCase();

    setShowFeedback(true);
    setIsAnswerRevealed(false);

    if (userAnswer === correctAnswer) {
      setIsCorrect(true);
      setFeedbackColor('success');
      setTimeout(() => {
        handleNextQuestion();
      }, 1000);
    } else {
      setIsCorrect(false);
      
      const distance = Levenshtein.get(userAnswer, correctAnswer);
      const similarity = 1 - distance / Math.max(userAnswer.length, correctAnswer.length);

      if (similarity > 0.4) {
        setFeedbackColor('warning');
        setTimeout(() => {
          setShowFeedback(false);
          setUserInput('');
        }, 1500);
      } else {
        setFeedbackColor('error');
        // Yanlış cevap için doğru cevabı göster ve 2 saniye sonra sonraki karta geç
        setUserInput(cardData.missingWord);
        setIsAnswerRevealed(true);
        setTimeout(() => {
          handleNextQuestion();
        }, 2000);
      }
    }
  };

  const handleNextQuestion = () => {
    setUserInput('');
    setIsCorrect(null);
    setShowFeedback(false);
    incrementProgress();
    
    if (flashcardData.length > 0) {
      setCurrentCardIndex(prev => (prev + 1) % flashcardData.length);
    }
  };



  const handleShowAnswer = () => {
    setUserInput(cardData.missingWord);
    setShowFeedback(true);
    setFeedbackColor('info');
    if(inputRef.current) {
      inputRef.current.focus();
    }
  };

  const playAudio = () => {
    console.log('Playing audio...');
  };

  if (currentProgress >= targetGoal) {
    return (
      <CompletionScreen 
        targetGoal={targetGoal}
        onReset={() => {
          resetProgress();
          setCurrentCardIndex(0);
        }}
        onNavigateToSettings={handleNavigateToSettings}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        p: 4,
      }}
    >
      {/* Progress Bar Container */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 3,
          p: 3,
          mb: 3,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={(currentProgress / targetGoal) * 100}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'secondary.main',
              borderRadius: 6,
            },
            mb: 2,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            {currentProgress}/{targetGoal}
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main', fontWeight: 'bold' }}>
            %{Math.round((currentProgress / targetGoal) * 100)}
          </Typography>
        </Box>
      </Box>

      {/* İngilizce Cümle Container */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 3,
          p: 2,
          mb: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 1200,
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
                verticalAlign: 'baseline',
                lineHeight: 1,
                mx: 1.5,
              }}
            >
              {userInput ? (
                <Typography
                  component="span"
                  sx={{
                    fontFamily: 'Roboto Mono, monospace',
                    color: showFeedback
                      ? feedbackColor === 'success'
                        ? 'secondary.main'
                        : feedbackColor === 'error'
                          ? 'error.main'
                          : feedbackColor === 'warning'
                            ? '#ffa726'
                            : feedbackColor === 'info'
                              ? '#29b6f6'
                              : 'primary.main'
                      : 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.9em',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.7)',
                    paddingBottom: '2px',
                    lineHeight: 'inherit',
                  }}
                >
                  {userInput}
                </Typography>
              ) : (
                <Box component="span" sx={{ display: 'inline-flex', gap: '0.8ch', alignItems: 'center' }}>
                  {cardData.missingWord &&
                    cardData.missingWord.split(' ').map((word, index) => (
                      <span
                        key={index}
                        style={{
                          width: `${word.length}ch`,
                          display: 'inline-block',
                          backgroundImage:
                            'linear-gradient(to right, rgba(255, 255, 255, 0.5) 70%, transparent 30%)',
                          backgroundSize: '1ch 2px',
                          backgroundRepeat: 'repeat-x',
                          backgroundPosition: '0 100%',
                          height: '1.2em',
                          paddingBottom: '2px',
                        }}
                      />
                    ))}
                </Box>
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
          p: 2,
          mb: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: '1.2rem',
            lineHeight: 1.6,
            '& u': {
              textDecoration: 'none',
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
          p: 2,
          mb: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 800,
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
          inputRef={inputRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              fontSize: '1.1rem',
              transition: 'border-color 0.3s ease-in-out',
              '& fieldset': {
                borderWidth: 2,
                borderColor: showFeedback 
                  ? feedbackColor === 'success' 
                    ? '#4caf50'
                    : feedbackColor === 'error' 
                      ? '#f44336'
                      : feedbackColor === 'warning' 
                        ? '#ffa726'
                        : 'rgba(255, 255, 255, 0.3)'
                  : 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: showFeedback ? (feedbackColor === 'success' ? '#4caf50' : feedbackColor === 'error' ? '#f44336' : feedbackColor === 'warning' ? '#ffa726' : 'primary.main') : 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: showFeedback ? (feedbackColor === 'success' ? '#4caf50' : feedbackColor === 'error' ? '#f44336' : feedbackColor === 'warning' ? '#ffa726' : 'primary.main') : 'primary.main',
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

      {/* Butonlar */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={handleShowAnswer}
          disabled={showFeedback && isCorrect}
        >
          Cevabı Göster (Tab)
        </Button>
      </Box>

      {/* Klavye Yardım Paneli */}
      <Box 
        sx={{ 
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 200,
          fontSize: '0.75rem',
          zIndex: 1000
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1, fontWeight: 'bold' }}>
          Klavye Kısayolları:
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Enter: Kontrol Et
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Tab: Cevabı Göster
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Esc: Temizle
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Space: Sonraki (doğru ise)
        </Typography>
      </Box>
    </Box>
  );
};

export default LingvistFlashcard;