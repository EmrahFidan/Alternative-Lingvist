
import { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  Box,
  Typography,
  Button,

  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';

const AddDataPage = () => {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const fileInputRef = useRef(null);

  // Dosya yükleme işlemi
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.map((row, index) => ({
            id: index + 1,
            ...row,
          }));
          setCsvData(parsedData);
          setPreviewData(parsedData.slice(0, 5));
          setIsUploaded(true);
        },
      });
    } else {
      alert('Lütfen geçerli bir CSV dosyası seçin.');
    }
  };

  // Dosya seçici açma
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Verileri ana CSV'ye kaydetme (simülasyon)
  const handleSaveData = () => {
    // Gerçek uygulamada burada backend'e gönderilecek
    const existingData = JSON.parse(localStorage.getItem('flashcardData') || '[]');
    const updatedData = [...existingData, ...csvData];
    localStorage.setItem('flashcardData', JSON.stringify(updatedData));
    
    alert(`${csvData.length} adet veri başarıyla eklendi!`);
    
    // Temizle
    setCsvData([]);
    setPreviewData([]);
    setFileName('');
    setIsUploaded(false);
  };

  // Verileri temizleme
  const handleClearData = () => {
    setCsvData([]);
    setPreviewData([]);
    setFileName('');
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      {/* Başlık */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
          Veri Ekleme
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          CSV dosyası yükleyerek flashcard verilerinizi ekleyin
        </Typography>
      </Box>

      {/* CSV Format Bilgisi */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          border: '1px solid rgba(96, 165, 250, 0.3)',
        }}
      >
        <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 'bold' }}>
          CSV Format Örneği:
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace', mb: 2 }}>
          sentence,missingWord,translation,translationWithUnderline
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
          "I went to school with my","friends","Arkadaşlarımla okula gittim","&lt;u&gt;Arkadaşlarımla&lt;/u&gt; okula gittim"
        </Typography>
      </Paper>

      {/* Dosya Yükleme Alanı */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          textAlign: 'center',
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          backgroundColor: 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'rgba(96, 165, 250, 0.05)',
          },
        }}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        
        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
          CSV Dosyası Yükleyin
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Dosyanızı sürükleyip bırakın veya tıklayarak seçin
        </Typography>
        
        {fileName && (
          <Chip 
            label={fileName} 
            sx={{ 
              mt: 2,
              backgroundColor: 'rgba(96, 165, 250, 0.2)',
              color: 'primary.main',
            }} 
          />
        )}
      </Paper>

      {/* Yüklenen Veri Önizlemesi */}
      {isUploaded && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
              Veri Önizlemesi ({csvData.length} satır)
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleClearData}
                sx={{
                  borderColor: 'error.main',
                  color: 'error.main',
                  '&:hover': {
                    borderColor: 'error.main',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  },
                }}
              >
                Temizle
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveData}
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Verileri Kaydet
              </Button>
            </Box>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    İngilizce Cümle
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Aranan Kelime
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                    Türkçe Çeviri
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {row.sentence}
                    </TableCell>
                    <TableCell sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      {row.missingWord}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {row.translation}
                    </TableCell>
                  </TableRow>
                ))}
                {csvData.length > 5 && (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', color: 'text.secondary', fontStyle: 'italic' }}>
                      ... ve {csvData.length - 5} satır daha
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* Bilgi Mesajları */}
      {isUploaded && (
        <Alert 
          severity="success" 
          sx={{ 
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: 'text.primary',
            border: '1px solid rgba(76, 175, 80, 0.3)',
          }}
        >
          CSV dosyası başarıyla yüklendi! {csvData.length} adet flashcard verisi hazır.
        </Alert>
      )}
    </Box>
  );
};

export default AddDataPage;