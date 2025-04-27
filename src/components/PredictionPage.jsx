import React, { useState } from 'react';
import { 
  Box, Button, Card, CardContent, Chip, Divider, 
  FormControl, Grid, InputLabel, LinearProgress, 
  MenuItem, Select, TextField, Typography, Tooltip 
} from '@mui/material';
import { SportsSoccer, Info, Star } from '@mui/icons-material';
import axios from 'axios';
import ConfidenceIndicator from '../components/ConfidenceIndicator';

const PredictionPage = () => {
  const [keyword, setKeyword] = useState('');
  const [sport, setSport] = useState('');
  const [predictionType, setPredictionType] = useState('trend');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sportsList, setSportsList] = useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:8000/api/sports')
      .then(response => {
        setSportsList(response.data.sports);
        if (response.data.sports.length > 0) {
          setSport(response.data.sports[0]);
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:8000/api/predict', {
        keyword,
        prediction_type: predictionType,
        sport: predictionType === 'trend' ? sport : undefined
      });
      
      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('حدث خطأ أثناء التوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        نظام توقع الاتجاهات الرياضية
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel>نوع التوقع</InputLabel>
              <Select
                value={predictionType}
                onChange={(e) => setPredictionType(e.target.value)}
                label="نوع التوقع"
              >
                <MenuItem value="trend">توقع اتجاهات</MenuItem>
                <MenuItem value="match">توقع مباراة</MenuItem>
              </Select>
            </FormControl>
            
            {predictionType === 'trend' && (
              <FormControl fullWidth margin="normal">
                <InputLabel>الرياضة</InputLabel>
                <Select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  label="الرياضة"
                >
                  {sportsList.map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            <TextField
              fullWidth
              margin="normal"
              label={predictionType === 'trend' ? "كلمة مفتاحية (اختياري)" : "أسماء الفرق/اللاعبين"}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required={predictionType === 'match'}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'جاري التوقع...' : 'توقع'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {prediction && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography variant="h6">
                نتائج التوقع
              </Typography>
              <ConfidenceIndicator 
                level={prediction.confidence.confidence_level}
                score={prediction.confidence.composite_confidence}
                size="large"
              />
            </Box>
            
            <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    مقاييس الثقة:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" display="block">
                        التناسق الداخلي
                      </Typography>
                      <ConfidenceIndicator 
                        level={prediction.confidence.confidence_level}
                        score={prediction.confidence.self_consistency}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block">
                        المصداقية
                      </Typography>
                      <ConfidenceIndicator 
                        level={prediction.confidence.confidence_level}
                        score={prediction.confidence.plausibility}
                        size="small"
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" display="block">
                        الارتباط بالموضوع
                      </Typography>
                      <ConfidenceIndicator 
                        level={prediction.confidence.confidence_level}
                        score={prediction.confidence.domain_relevance}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    تفسير المقاييس:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>التناسق الداخلي:</strong> مدى تشابه التوقعات المتعددة لنفس المدخلات
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>المصداقية:</strong> وجود عناصر متوقعة في التحليل الرياضي
                  </Typography>
                  <Typography variant="body2">
                    <strong>الارتباط بالموضوع:</strong> تركيز التوقع على الرياضة المطلوبة
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            
            <Typography variant="subtitle1" gutterBottom>
              التوقع:
            </Typography>
            <Box sx={{ 
              p: 2,
              borderLeft: '4px solid',
              borderColor: 
                prediction.confidence.confidence_level === 'عالية جدًا' ? 'success.main' :
                prediction.confidence.confidence_level === 'عالية' ? 'success.light' :
                prediction.confidence.confidence_level === 'متوسطة' ? 'warning.main' : 'error.main',
              backgroundColor: 
                prediction.confidence.confidence_level === 'عالية جدًا' ? 'rgba(76, 175, 80, 0.05)' :
                prediction.confidence.confidence_level === 'عالية' ? 'rgba(129, 199, 132, 0.05)' :
                prediction.confidence.confidence_level === 'متوسطة' ? 'rgba(255, 183, 77, 0.05)' : 'rgba(229, 115, 115, 0.05)'
            }}>
              <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line' }}>
                {prediction.prediction}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label={`نوع: ${prediction.type === 'trend' ? 'اتجاهات' : 'مباراة'}`} 
                color="primary" 
                size="small" 
              />
              {prediction.sport && (
                <Chip label={prediction.sport} color="secondary" size="small" />
              )}
              <Chip 
                label={new Date(prediction.timestamp).toLocaleString('ar-EG')} 
                size="small" 
              />
              <Chip 
                icon={<Info />}
                label={`الثقة: ${Math.round(prediction.confidence.composite_confidence * 100)}%`} 
                size="small" 
                sx={{
                  backgroundColor: 
                    prediction.confidence.confidence_level === 'عالية جدًا' ? '#4caf50' :
                    prediction.confidence.confidence_level === 'عالية' ? '#81c784' :
                    prediction.confidence.confidence_level === 'متوسطة' ? '#ffb74d' : '#e57373',
                  color: 'white'
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PredictionPage;