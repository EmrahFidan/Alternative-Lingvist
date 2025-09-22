import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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




// Function to generate word variations (plural/singular forms)
const generateWordVariations = (word) => {
  const variations = [];
  const lowerWord = word.toLowerCase();

  // Add the original word
  variations.push(word);

  // Handle common plural rules
  if (lowerWord.endsWith('s')) {
    // If word ends with 's', try removing it (plural -> singular)
    const singular = lowerWord.slice(0, -1);
    variations.push(singular);
    variations.push(singular.charAt(0).toUpperCase() + singular.slice(1));
  } else {
    // If word doesn't end with 's', try adding 's' (singular -> plural)
    const plural = lowerWord + 's';
    variations.push(plural);
    variations.push(plural.charAt(0).toUpperCase() + plural.slice(1));
  }

  // Handle words ending with 'es' (e.g., boxes, wishes)
  if (lowerWord.endsWith('es')) {
    const withoutEs = lowerWord.slice(0, -2);
    variations.push(withoutEs);
    variations.push(withoutEs.charAt(0).toUpperCase() + withoutEs.slice(1));
  } else if (!lowerWord.endsWith('s')) {
    const withEs = lowerWord + 'es';
    variations.push(withEs);
    variations.push(withEs.charAt(0).toUpperCase() + withEs.slice(1));
  }

  // Handle words ending with 'y' -> 'ies' (e.g., city -> cities)
  if (lowerWord.endsWith('ies')) {
    const withY = lowerWord.slice(0, -3) + 'y';
    variations.push(withY);
    variations.push(withY.charAt(0).toUpperCase() + withY.slice(1));
  } else if (lowerWord.endsWith('y') && lowerWord.length > 1) {
    const withIes = lowerWord.slice(0, -1) + 'ies';
    variations.push(withIes);
    variations.push(withIes.charAt(0).toUpperCase() + withIes.slice(1));
  }

  // Handle some irregular plurals
  const irregulars = {
    'child': 'children',
    'children': 'child',
    'man': 'men',
    'men': 'man',
    'woman': 'women',
    'women': 'woman',
    'person': 'people',
    'people': 'person',
    'foot': 'feet',
    'feet': 'foot',
    'tooth': 'teeth',
    'teeth': 'tooth',
    'mouse': 'mice',
    'mice': 'mouse',
    'goose': 'geese',
    'geese': 'goose'
  };

  if (irregulars[lowerWord]) {
    const irregular = irregulars[lowerWord];
    variations.push(irregular);
    variations.push(irregular.charAt(0).toUpperCase() + irregular.slice(1));
  }

  // Add capitalized versions of all variations
  variations.forEach(variation => {
    if (variation !== variation.charAt(0).toUpperCase() + variation.slice(1)) {
      variations.push(variation.charAt(0).toUpperCase() + variation.slice(1));
    }
  });

  // Remove duplicates and return
  return [...new Set(variations)];
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

  // Varsayılan veri - Her kelime için tekrar sayısı eklendi
  const defaultData = useMemo(() => [
    {
      sentence: "Friends are very important in life",
      missingWord: "friends",
      translation: "Arkadaşlar hayatta çok önemlidir.",
      translationWithUnderline: "<u>Arkadaşlar</u> hayatta çok önemlidir.",
      repeatCount: 0, // 0-2 arası, 3'te sonraki kelimeye geç
    },
    {
      sentence: "She is studying for her",
      missingWord: "exam",
      translation: "O sınavı için çalışıyor.",
      translationWithUnderline: "O <u>sınavı</u> için çalışıyor.",
      repeatCount: 0,
    },
    {
      sentence: "We need to buy some",
      missingWord: "groceries",
      translation: "Biraz market alışverişi yapmamız gerekiyor.",
      translationWithUnderline: "Biraz <u>market alışverişi</u> yapmamız gerekiyor.",
      repeatCount: 0,
    },
  ], []);

  // Component mount olduğunda localStorage'dan veri yükle
  useEffect(() => {
    const savedData = localStorage.getItem('flashcardData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.length > 0) {
          // Eski veriyi yeni format ile uyumlu hale getir
          const updatedData = parsedData.map(card => ({
            ...card,
            repeatCount: card.repeatCount || 0
          }));
          setFlashcardData(updatedData);
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
  }, [defaultData]);



  const cardData = useMemo(() => {
    const currentCard = flashcardData.length > 0 ? flashcardData[currentCardIndex] : {};

    console.log("Mevcut kart verisi:", currentCard);

    let sentenceStart = 'Veri yükleniyor...';
    let sentenceEnd = '';

    if (currentCard && typeof currentCard.sentence === 'string') {
      let sentenceToProcess = currentCard.sentence;
      const missingWord = currentCard.missingWord;

      if (missingWord) {
        // Gelişmiş kelime eşleştirme - tekil/çoğul varyasyonları da dahil
        const escapedWord = missingWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Önce exact match dene
        let wordRegex = new RegExp(`\\b${escapedWord}\\b`, 'gi');

        if (wordRegex.test(sentenceToProcess)) {
          sentenceToProcess = sentenceToProcess.replace(wordRegex, '___');
        } else {
          // Exact match bulunamazsa, varyasyonları dene
          const variations = generateWordVariations(missingWord);
          console.log(`"${missingWord}" için üretilen varyasyonlar:`, variations);

          for (const variation of variations) {
            const escapedVariation = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const variationRegex = new RegExp(`\\b${escapedVariation}\\b`, 'gi');

            if (variationRegex.test(sentenceToProcess)) {
              console.log(`Eşleşme bulundu: "${variation}" kelimesi "${sentenceToProcess}" içinde bulundu`);
              sentenceToProcess = sentenceToProcess.replace(variationRegex, '___');
              break;
            }
          }
        }
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

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !showFeedback) {
      checkAnswer();
    }
  };

  // useCallback fonksiyonlarını useEffect'ten önce tanımla
  const handleNextQuestion = useCallback(() => {
    // // Mevcut kelimenin tekrar sayısını artır
    // const updatedData = flashcardData.map((card, index) => {
    //   if (index === currentCardIndex) {
    //     const newRepeatCount = card.repeatCount + 1;
    //     return { ...card, repeatCount: newRepeatCount };
    //   }
    //   return card;
    // });

    // setFlashcardData(updatedData);
    // localStorage.setItem('flashcardData', JSON.stringify(updatedData));

    // // Eğer kelime 5 kez tekrarlandıysa sonraki kelimeye geç
    // const currentCard = flashcardData[currentCardIndex];
    // if (currentCard.repeatCount >= 4) { // 0,1,2,3,4 = 5 tekrar
    //   setCurrentCardIndex(prev => (prev + 1) % flashcardData.length);
    //   incrementProgress();
    // }

    // Her seferinde sonraki karta geç
    setCurrentCardIndex(prev => (prev + 1) % flashcardData.length);
    incrementProgress();

    setUserInput('');
    setIsCorrect(null);
    setShowFeedback(false);
  }, [flashcardData.length, incrementProgress]);

  const handleShowAnswer = useCallback(() => {
    setUserInput(cardData.missingWord);
    setShowFeedback(true);
    setFeedbackColor('info');
    if(inputRef.current) {
      inputRef.current.focus();
    }
  }, [cardData.missingWord]);

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyPress = (event) => {
      // ESC - Input temizleme (her zaman çalışır)
      if (event.key === 'Escape') {
        if (userInput) {
          setUserInput('');
          event.preventDefault();
        }
        return;
      }

      // TAB - Cevabı göster (sadece feedback gösterilmiyorsa)
      if (event.key === 'Tab' && !showFeedback) {
        handleShowAnswer();
        event.preventDefault();
        return;
      }

      // Input alanına odaklanmış değilse diğer kısayolları kontrol et
      if (document.activeElement !== inputRef.current) {
        // Input alanına otomatik odaklan
        if (inputRef.current && !showFeedback) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [userInput, showFeedback, handleShowAnswer]);

  const checkAnswer = () => {
    const userAnswer = userInput.toLowerCase().trim();
    const correctAnswer = cardData.missingWord.toLowerCase();

    setShowFeedback(true);

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
        setTimeout(() => {
          handleNextQuestion();
        }, 2000);
      }
    }
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
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      {/* Ana Container - Tüm içerik tek alanda */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 3,
          p: 4,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: 900,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Kelime Tekrar Progress'i - Üst Orta */}
        {/*
        <Box sx={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[0, 1, 2, 3, 4].map(step => (
              <Box
                key={step}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: step < wordProgress 
                    ? 'secondary.main' 
                    : 'rgba(255, 255, 255, 0.2)',
                  transition: 'background-color 0.3s ease',
                }}
              />
            ))}
          </Box>
        </Box>
        */}

        {/* İngilizce Cümle */}
        <Box sx={{ textAlign: 'center', mb: 4, pb: 3, mt: 3 }}>
          <Typography
            variant="h5"
            sx={{
              color: 'primary.main',
              fontWeight: 400,
              fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
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
        
        {/* Divider Line */}
        <Box sx={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        {/* Türkçe Çeviri */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: '1rem',
            lineHeight: 1.6,
            mb: 4,
            pb: 3,
            '& u': {
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'medium',
            },
          }}
          dangerouslySetInnerHTML={{ __html: cardData.translationWithUnderline }}
        />
        
        {/* Divider Line */}
        <Box sx={{ width: '100%', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', mb: 4 }} />

        {/* Giriş Alanı */}
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
              fontSize: '1rem',
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
        
        {/* Progress Bar - En Alt */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold', minWidth: 'fit-content' }}>
            {currentProgress}/{targetGoal}
          </Typography>
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
              flexGrow: 1,
            }}
          />
        </Box>
      </Box>


    </Box>
  );
};

export default LingvistFlashcard;
