import { useState, useEffect, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  Chip,
  TablePagination,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const ManageDataPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [gameFlashcards, setGameFlashcards] = useState([]);
  const [selected, setSelected] = useState([]);
  const [revealedIndex, setRevealedIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0); // 0: Practice, 1: Game

  useEffect(() => {
    // Practice data yükle
    const savedData = localStorage.getItem('flashcardData');
    if (savedData) {
      try {
        setFlashcards(JSON.parse(savedData));
      } catch (error) {
        console.error('localStorage practice veri okuma hatası:', error);
        setFlashcards([]);
      }
    }

    // Game data yükle
    const savedGameData = localStorage.getItem('gameFlashcardData');
    if (savedGameData) {
      try {
        setGameFlashcards(JSON.parse(savedGameData));
      } catch (error) {
        console.error('localStorage game veri okuma hatası:', error);
        setGameFlashcards([]);
      }
    }
  }, []);

  // Aktif veri setini belirle
  const currentData = tabValue === 0 ? flashcards : gameFlashcards;
  const currentStorageKey = tabValue === 0 ? 'flashcardData' : 'gameFlashcardData';

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = currentData.map((n, index) => index);
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
    const dataTypeName = tabValue === 0 ? 'Practice' : 'Game';
    const isConfirmed = window.confirm(`${selected.length} adet ${dataTypeName} verisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`);
    if (isConfirmed) {
      const remaining = currentData.filter((_, index) => !selected.includes(index));

      if (tabValue === 0) {
        setFlashcards(remaining);
      } else {
        setGameFlashcards(remaining);
      }

      localStorage.setItem(currentStorageKey, JSON.stringify(remaining));
      setSelected([]);
    }
  };

  // Filtrelenmiş veriler
  const filteredFlashcards = useMemo(() => {
    if (!searchTerm) return currentData;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return currentData.filter(card => {
      // Practice data format için
      if (tabValue === 0) {
        return card.sentence?.toLowerCase().includes(lowercaseSearch) ||
               card.missingWord?.toLowerCase().includes(lowercaseSearch) ||
               card.translation?.toLowerCase().includes(lowercaseSearch);
      }
      // Game data format için
      else {
        return card.sentence?.toLowerCase().includes(lowercaseSearch) ||
               card.word?.toLowerCase().includes(lowercaseSearch) ||
               card.word_mean?.toLowerCase().includes(lowercaseSearch);
      }
    });
  }, [currentData, searchTerm, tabValue]);

  // Sayfalama için veriler
  const paginatedFlashcards = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredFlashcards.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredFlashcards, page, rowsPerPage]);

  const isSelected = (index) => selected.indexOf(index) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Arama yapıldığında ilk sayfaya dön
  };

  const clearSearch = () => {
    setSearchTerm('');
    setPage(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelected([]);
    setSearchTerm('');
    setPage(0);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      {/* Başlık */}
      <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Veri Yönetimi
      </Typography>

      {/* Tab Sistemi */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                📚 Practice Data ({flashcards.length})
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🎮 Game Data ({gameFlashcards.length})
              </Box>
            }
          />
        </Tabs>
      </Box>

      {/* Başlık ve İstatistikler */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                label={`Toplam: ${currentData.length}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              {searchTerm && (
                <Chip
                  label={`Filtrelenen: ${filteredFlashcards.length}`}
                  color="secondary" 
                  variant="outlined" 
                  size="small"
                />
              )}
              {selected.length > 0 && (
                <Chip 
                  label={`Seçili: ${selected.length}`} 
                  color="warning" 
                  variant="outlined" 
                  size="small"
                />
              )}
            </Box>
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

        {/* Arama Çubuğu */}
        <TextField
          fullWidth
          placeholder="Cümle, kelime veya çeviride ara..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  onClick={clearSearch}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 400,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>İngilizce Cümle</TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {tabValue === 0 ? 'Aranan Kelime' : 'Kelime'}
              </TableCell>
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {tabValue === 0 ? 'Türkçe Çeviri' : 'Kelime Anlamı'}
              </TableCell>
              <TableCell padding="checkbox" align="right">
                <Checkbox
                  color="primary"
                  indeterminate={selected.length > 0 && selected.length < currentData.length}
                  checked={currentData.length > 0 && selected.length === currentData.length}
                  onChange={handleSelectAllClick}
                  inputProps={{ 'aria-label': 'tüm öğeleri seç' }}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedFlashcards.map((card, index) => {
              const globalIndex = page * rowsPerPage + index; // Gerçek index'i hesapla
              const isItemSelected = isSelected(globalIndex);
              const labelId = `enhanced-table-checkbox-${globalIndex}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, globalIndex)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={globalIndex}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {searchTerm ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: card.sentence?.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<mark style="background: rgba(59, 130, 246, 0.3); padding: 2px 4px; border-radius: 4px;">$1</mark>'
                          )
                        }}
                      />
                    ) : (
                      card.sentence
                    )}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      color: 'primary.main', 
                      fontWeight: 'bold',
                      filter: revealedIndex === globalIndex ? 'none' : 'blur(5px)',
                      transition: 'filter 0.2s ease-in-out',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={() => setRevealedIndex(globalIndex)}
                    onMouseLeave={() => setRevealedIndex(null)}
                  >
                    {searchTerm ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: (tabValue === 0 ? card.missingWord : card.word)?.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<mark style="background: rgba(59, 130, 246, 0.3); padding: 2px 4px; border-radius: 4px;">$1</mark>'
                          )
                        }}
                      />
                    ) : (
                      tabValue === 0 ? card.missingWord : card.word
                    )}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>
                    {searchTerm ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: (tabValue === 0 ? card.translation : card.word_mean)?.replace(
                            new RegExp(`(${searchTerm})`, 'gi'),
                            '<mark style="background: rgba(59, 130, 246, 0.3); padding: 2px 4px; border-radius: 4px;">$1</mark>'
                          )
                        }}
                      />
                    ) : (
                      tabValue === 0 ? card.translation : card.word_mean
                    )}
                  </TableCell>
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
            {filteredFlashcards.length === 0 && flashcards.length > 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', p: 4 }}>
                  Arama kriterinize uygun veri bulunamadı. Farklı terimlerle arama yapın.
                </TableCell>
              </TableRow>
            )}
            {flashcards.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic', p: 4 }}>
                  Görüntülenecek veri bulunamadı. Lütfen 'Veri Ekleme' sayfasından CSV dosyası yükleyin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Sayfalama */}
        {filteredFlashcards.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredFlashcards.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Sayfa başına:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} / ${count !== -1 ? count : `${to}'dan fazla`}`
            }
            sx={{
              borderTop: '1px solid rgba(148, 163, 184, 0.12)',
              '& .MuiTablePagination-toolbar': {
                color: 'text.secondary',
              },
              '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                color: 'text.secondary',
              },
            }}
          />
        )}
      </TableContainer>
    </Box>
  );
};

export default ManageDataPage;