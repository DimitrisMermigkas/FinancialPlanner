import React from 'react';
import { Box, Typography, Card, styled } from '@mui/material';
import { CurrentBalance } from '@my-workspace/common';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useTransactions } from '../../api/apiHooks';
import SavingsIcon from '@mui/icons-material/Savings';

const BalanceCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(129deg, #151D27 25%, #0b0d1b4d 80%)',
  backgroundPosition: '90% 30%', // This moves the gradient's center point
  backgroundSize: '100% 100%', // This allows the gradient to extend beyond the element
  borderRadius: '20px',
  padding: theme.spacing(1.5),
  color: theme.palette.common.white,
  height: '100%',
  boxSizing: 'border-box',
}));

const TransactionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

interface BalanceDisplayProps {
  balance: CurrentBalance;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance }) => {
  const { data: transactions } = useTransactions();
  const mostRecentTransaction = transactions?.[0];

  return (
    <BalanceCard>
      <Box
        style={{
          width: '100%',
          background:
            'linear-gradient(135deg,#6293b3 -25%,rgba(42, 58, 77, 0.7) 80%)',
          borderRadius: '14px',
          paddingBlock: '8px',
          paddingInline: '24px',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            top: 0,
            width: '150px',
            background: 'rgba(255, 255, 255, 0.05)',
            clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)',
            zIndex: 0,
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography style={{ fontSize: 12 }} color="rgba(255, 255, 255, 0.8)">
            Credit Balance
          </Typography>
          <MoreHorizIcon />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" fontWeight="bold" style={{ fontSize: 34 }}>
            €{balance?.amount?.toLocaleString()}
          </Typography>
          <ShowChartIcon />
        </Box>
      </Box>

      {mostRecentTransaction && (
        <>
          <Typography
            color="rgba(255, 255, 255, 0.7)"
            mt={2}
            style={{ fontSize: 10 }}
          >
            NEWEST
          </Typography>
          <TransactionItem>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  clipPath: 'ellipse(25px 20px)',
                  width: 50,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: '#ffffff14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SavingsIcon style={{ color: '#22c55e' }} />
              </Box>
              <Box>
                <Typography variant="subtitle1">
                  {mostRecentTransaction.description}
                </Typography>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                  Today,{' '}
                  {new Date(
                    mostRecentTransaction.completedAt
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="subtitle1"
              color={mostRecentTransaction.amount < 0 ? '#FF4842' : '#22C55E'}
            >
              {mostRecentTransaction.amount < 0 ? '-' : '+'}€
              {Math.abs(mostRecentTransaction.amount).toFixed(2)}
            </Typography>
          </TransactionItem>
        </>
      )}
    </BalanceCard>
  );
};

export default BalanceDisplay;
