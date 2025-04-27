import React from 'react';
import { Box, LinearProgress, Typography, Tooltip } from '@mui/material';
import { 
  CheckCircle, Error, Warning, 
  Star 
} from '@mui/icons-material';
import '../Styles/confidenceIndicator.css';

const ConfidenceIndicator = ({ level, score, size = 'medium' }) => {
  let icon;
  let colorClass;
  
  switch (level) {
    case 'عالية جدًا':
      icon = <Star />;
      colorClass = 'confidence-high';
      break;
    case 'عالية':
      icon = <CheckCircle />;
      colorClass = 'confidence-good';
      break;
    case 'متوسطة':
      icon = <Warning />;
      colorClass = 'confidence-medium';
      break;
    default:
      icon = <Error />;
      colorClass = 'confidence-low';
  }
  
  return (
    <Tooltip title={`الثقة: ${Math.round(score * 100)}%`}>
      <Box className={`confidence-container confidence-${size}`}>
        <Box sx={{ color: colorClass.replace('confidence-', '') }}>
          {React.cloneElement(icon, { fontSize: size })}
        </Box>
        <Box sx={{ width: '100%' }}>
          <Typography className={`confidence-text ${colorClass}`}>
            {level}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={score * 100} 
            className="confidence-progress"
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: colorClass.replace('confidence-', ''),
                borderRadius: 'inherit'
              }
            }}
          />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default ConfidenceIndicator;