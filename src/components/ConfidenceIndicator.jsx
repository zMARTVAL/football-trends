import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';
import { 
  CheckCircle, Error, Warning, 
  Star 
} from '@mui/icons-material';

const ConfidenceIndicator = ({ level, score, size = 'medium' }) => {
  let icon;
  let color;
  
  switch (level) {
    case 'عالية جدًا':
      icon = <Star color="success" />;
      color = '#4caf50';
      break;
    case 'عالية':
      icon = <CheckCircle color="success" />;
      color = '#81c784';
      break;
    case 'متوسطة':
      icon = <Warning color="warning" />;
      color = '#ffb74d';
      break;
    default:
      icon = <Error color="error" />;
      color = '#e57373';
  }
  
  const getSize = () => {
    switch (size) {
      case 'small': return { icon: 'small', text: '0.75rem', bar: 4 };
      case 'large': return { icon: 'large', text: '1.25rem', bar: 10 };
      default: return { icon: 'medium', text: '1rem', bar: 6 };
    }
  };
  
  const sizes = getSize();

  return (
    <Tooltip title={`الثقة: ${Math.round(score * 100)}%`}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {React.cloneElement(icon, { fontSize: sizes.icon })}
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" color={color} fontSize={sizes.text}>
            {level}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={score * 100} 
            sx={{ 
              height: sizes.bar,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              }
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default ConfidenceIndicator;