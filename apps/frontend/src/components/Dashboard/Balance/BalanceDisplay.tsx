import React from 'react';
import { Box, Button } from '@mui/material';

interface BalanceDisplayProps {
  balance: number;
  setShowChart: React.Dispatch<React.SetStateAction<boolean>>;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  setShowChart,
}) => {
  return (
    <Box mb={3}>
      <Button
        style={{ fontSize: '48px' }}
        variant="text"
        onClick={() => {
          setShowChart(true);
        }}
      >
        €{balance.toFixed(2)}
      </Button>
    </Box>
  );
};

export default BalanceDisplay;
