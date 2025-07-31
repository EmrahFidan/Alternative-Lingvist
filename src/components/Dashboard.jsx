import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Button,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  // Statik veriler
  const progressData = {
    english: { completed: 75, total: 100, level: 'Orta Seviye' },
    german: { completed: 45, total: 80, level: 'Başlangıç' },
    french: { completed: 20, total: 60, level: 'Başlangıç' },
  };

  const stats = [
    {
      title: 'Toplam Kelime',
      value: '1,247',
      icon: <SchoolIcon />,
      color: '#60a5fa',
    },
    {
      title: 'Günlük Hedef',
      value: '15/20',
      icon: <TrophyIcon />,
      color: '#34d399',
    },
    {
      title: 'Çalışma Süresi',
      value: '2s 45dk',
      icon: <TimerIcon />,
      color: '#f59e0b',
    },
    {
      title: 'Başarı Oranı',
      value: '%87',
      icon: <TrendingUpIcon />,
      color: '#ef4444',
    },
  ];

  const recentCourses = [
    { name: 'İngilizce', lastStudied: '2 saat önce', progress: 75 },
    { name: 'Almanca', lastStudied: '1 gün önce', progress: 45 },
    { name: 'Fransızca', lastStudied: '3 gün önce', progress: 20 },
  ];

  return (
    <Box sx={{ 
      p: 4, 
      maxWidth: 1200, 
      mx: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Başlık */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Öğrenme yolculuğunuza genel bakış
        </Typography>
      </Box>

      {/* İstatistik Kartları */}
      <Box sx={{ width: '100%', maxWidth: 1000, mb: 6 }}>
        <Grid container spacing={3} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: stat.color,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* İlerleme Grafiği */}
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Card
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mx: 'auto',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
              Kurs İlerlemesi
            </Typography>
            
            {Object.entries(progressData).map(([course, data]) => (
              <Box key={course} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '1.1rem', fontWeight: 'medium' }}>
                    {course === 'english' ? 'İngilizce' : 
                     course === 'german' ? 'Almanca' : 'Fransızca'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip 
                      label={data.level} 
                      size="small" 
                      sx={{ 
                        backgroundColor: 'rgba(96, 165, 250, 0.2)',
                        color: 'primary.main',
                        border: '1px solid rgba(96, 165, 250, 0.3)'
                      }}
                    />
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                      {data.completed}/{data.total}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(data.completed / data.total) * 100}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;