import React from "react";
import { Box, Typography } from "@mui/material";

interface BalanceDisplayProps {
  balance: number;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  return (
    <Box mb={3}>
      <Typography variant="h4">
        Current Balance: €{balance.toFixed(2)}
      </Typography>
    </Box>
  );
};

export default BalanceDisplay;
