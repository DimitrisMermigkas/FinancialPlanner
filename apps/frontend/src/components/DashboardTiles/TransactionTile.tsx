import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import { Transaction } from '@my-workspace/common';
import CardComponent from '../common/CardComponent';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { format } from 'date-fns';
import { useTransactions } from '../../api/apiHooks';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';

const TransactionTile: React.FC = () => {
  const { data: transactions = [] } = useTransactions();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'expense':
        return (
          <ArrowDownwardIcon sx={{ color: '#ff4d4d', width: 13, height: 13 }} />
        );
      case 'income':
        return (
          <ArrowUpwardIcon sx={{ color: '#4CAF50', width: 13, height: 13 }} />
        );
      case 'fund':
        return (
          <ArrowUpwardIcon
            sx={{
              color: '#FFD700',
              width: 13,
              height: 13,
              transform: 'rotate(90deg)',
            }}
          />
        );
      default:
        return null;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'expense':
        return '#ff4d4d';
      case 'income':
        return '#4CAF50';
      case 'fund':
        return '#FFD700';
      default:
        return 'white';
    }
  };

  const groupTransactions = (transactions: Transaction[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Sort transactions by completedAt date in descending order (most recent first)
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    return sortedTransactions.reduce(
      (groups: Record<string, Transaction[]>, transaction) => {
        const transactionDate = new Date(transaction.completedAt);
        transactionDate.setHours(0, 0, 0, 0);

        if (transactionDate.getTime() === today.getTime()) {
          if (!groups['TODAY']) groups['TODAY'] = [];
          groups['TODAY'].push(transaction);
        } else if (transactionDate.getTime() === yesterday.getTime()) {
          if (!groups['YESTERDAY']) groups['YESTERDAY'] = [];
          groups['YESTERDAY'].push(transaction);
        } else {
          // Get month and year of the transaction
          const month = format(transactionDate, 'MMMM');
          const year = transactionDate.getFullYear();
          const currentMonth = today.getMonth();
          const currentYear = today.getFullYear();

          // Create group key based on whether it's current month or past months
          let groupKey;
          if (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          ) {
            groupKey = `OLDER IN ${month.toUpperCase()}`;
          } else {
            groupKey = month.toUpperCase();
          }

          if (!groups[groupKey]) groups[groupKey] = [];
          groups[groupKey].push(transaction);
        }

        return groups;
      },
      {}
    );
  };

  const groupedTransactions = groupTransactions(transactions);

  return (
    <CardComponent
      title="Your Transactions"
      cardStyle={{ height: '100%' }}
      cardContentStyle={{ height: '100%' }}
    >
      <Box
        sx={{
          overflow: 'auto',
          height: 'calc(100% - 40px)', // Subtract the header height
          paddingRight: 1,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
          },
        }}
      >
        {Object.entries(groupedTransactions).map(([group, transactions]) => (
          <Box key={group} sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                mb: 1,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
              }}
            >
              {group}
            </Typography>
            <Stack spacing={2}>
              {transactions.map((transaction) => {
                const isPending =
                  new Date(transaction.completedAt) > new Date();
                return (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {isPending ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: 35,
                            border: `1px solid #A0AEC0`,
                            borderRadius: 20,
                            height: 35,
                            justifyContent: 'center',
                          }}
                        >
                          <PriorityHighRoundedIcon
                            sx={{ color: '#A0AEC0', width: 13, height: 13 }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            width: 35,
                            border: `1px solid ${getTransactionColor(
                              transaction.type
                            )}`,
                            borderRadius: 20,
                            height: 35,
                            justifyContent: 'center',
                          }}
                        >
                          {getTransactionIcon(transaction.type)}
                        </Box>
                      )}
                      <Box>
                        <Typography variant="body1">
                          {transaction.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                        >
                          {format(
                            new Date(transaction.completedAt),
                            'dd MMMM yyyy, at HH:mm'
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: isPending
                          ? '#888'
                          : getTransactionColor(transaction.type),
                      }}
                    >
                      {isPending
                        ? 'Pending'
                        : `${
                            transaction.type === 'expense' ? '-' : '+'
                          }€${Math.abs(transaction.amount).toFixed(2)}`}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Box>
    </CardComponent>
  );
};

export default TransactionTile;
