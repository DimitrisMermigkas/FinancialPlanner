import React from 'react';
import { Box, Typography } from '@mui/material';
import { CurrentBalance } from '@my-workspace/common';

interface BalanceDisplayProps {
  balance: CurrentBalance;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <Box mb={3}>
      <Typography style={{ fontSize: '48px' }}>
        €{balance?.amount?.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default BalanceDisplay;
