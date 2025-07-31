import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ManageDataPage = () => {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem('flashcardData');
    if (savedData) {
      try {
        setFlashcards(JSON.parse(savedData));
      } catch (error) {
        console.error('localStorage veri okuma hatası:', error);
        setFlashcards([]);
      }
    }
  }, []);

  const handleDelete = (indexToDelete) => {
    const isConfirmed = window.confirm('Bu veriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.');
    if (isConfirmed) {
      const updatedFlashcards = flashcards.filter((_, index) => index !== indexToDelete);
      setFlashcards(updatedFlashcards);
      localStorage.setItem('flashcardData', JSON.stringify(updatedFlashcards));
    }
  };

  const handleDeleteAll = () => {
    const isConfirmed = window.confirm('TÜM verileri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.');
    if (isConfirmed) {
      setFlashcards([]);
      localStorage.removeItem('flashcardData');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
            Veri Setini Yönet
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Mevcut tüm flashcard verilerinizi buradan görüntüleyebilir ve silebilirsiniz.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteAll}
          disabled={flashcards.length === 0}
        >
          Tüm Verileri Sil
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>İngilizce Cümle</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Aranan Kelime</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Türkçe Çeviri</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', textAlign: 'center' }}>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flashcards.map((card, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: 'text.secondary' }}>{card.sentence}</TableCell>
                <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>{card.missingWord}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{card.translation}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton onClick={() => handleDelete(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {flashcards.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', p: 4 }}>
                  Görüntülenecek veri bulunamadı. Lütfen 'Veri Ekleme' sayfasından CSV dosyası yükleyin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageDataPage;