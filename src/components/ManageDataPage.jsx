
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
  Checkbox,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const ManageDataPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [revealedIndex, setRevealedIndex] = useState(null);

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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = flashcards.map((n, index) => index);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, index) => {
    const selectedIndex = selected.indexOf(index);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleDeleteSelected = () => {
    const isConfirmed = window.confirm(`${selected.length} adet veriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`);
    if (isConfirmed) {
      const updatedFlashcards = flashcards.filter((_, index) => !selected.includes(index));
      setFlashcards(updatedFlashcards);
      localStorage.setItem('flashcardData', JSON.stringify(updatedFlashcards));
      setSelected([]);
    }
  };

  const isSelected = (index) => selected.indexOf(index) !== -1;

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
        {selected.length > 0 && (
          <Tooltip title="Seçili olan tüm verileri kalıcı olarak sil.">
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSelected}
            >
              {selected.length} Öğeyi Sil
            </Button>
          </Tooltip>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>İngilizce Cümle</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Aranan Kelime</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Türkçe Çeviri</TableCell>
              <TableCell padding="checkbox" align="right">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < flashcards.length}
                  checked={flashcards.length > 0 && selected.length === flashcards.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'tüm öğeleri seç' }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flashcards.map((card, index) => {
              const isItemSelected = isSelected(index);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, index)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={index}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ color: 'text.secondary' }}>{card.sentence}</TableCell>
                  <TableCell 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      filter: revealedIndex === index ? 'none' : 'blur(5px)',
                      transition: 'filter 0.2s ease-in-out',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setRevealedIndex(index)}
                    onMouseLeave={() => setRevealedIndex(null)}
                  >
                    {card.missingWord}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{card.translation}</TableCell>
                  <TableCell padding="checkbox" align="right">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
