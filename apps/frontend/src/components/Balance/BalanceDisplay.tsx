import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <Box mb={3}>
      <Typography style={{ fontSize: '48px' }}>
        €{balance?.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default BalanceDisplay;
