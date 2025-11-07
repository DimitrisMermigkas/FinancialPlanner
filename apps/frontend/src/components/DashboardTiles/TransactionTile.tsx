import React, { useState, useMemo } from 'react';
import { Typography, Box, Stack, Button, useTheme } from '@mui/material';
import { Transaction } from '@my-workspace/common';
import CardComponent from '../common/CardComponent';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { format } from 'date-fns';
import { useTransactions } from '../../api/apiHooks';
import PriorityHighRoundedIcon from '@mui/icons-material/PriorityHighRounded';
import {
  Dialog,
  DialogContent,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { startOfYear } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './DashboardTiles.css';

const TransactionTile: React.FC = () => {
  const { data: transactions = [] } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: startOfYear(new Date()),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [showFutureTransactions, setShowFutureTransactions] = useState(false);

  const theme = useTheme();
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.completedAt);
      const isFutureTransaction = transactionDate > new Date();

      if (!showFutureTransactions && isFutureTransaction) {
        return false;
      }
      if (showFutureTransactions && isFutureTransaction) {
        return true;
      }

      if (!dateRange[0].startDate || !dateRange[0].endDate) return true;

      return (
        transactionDate >= dateRange[0].startDate &&
        transactionDate <= dateRange[0].endDate
      );
    });
  }, [transactions, dateRange, showFutureTransactions]);

  const formatDateRangeText = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      return 'Select date range';
    }

    const startDate = dateRange[0].startDate;
    const endDate = dateRange[0].endDate;

    if (endDate > new Date()) {
      return `${format(startDate, 'dd MMM yy')} - now`;
    }

    const sameYear = startDate.getFullYear() === endDate.getFullYear();
    const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

    if (sameMonth) {
      // Same month and year: "20 - 23 March 24"
      return `${format(startDate, 'dd')} - ${format(endDate, 'dd MMM yy')}`;
    } else if (sameYear) {
      // Same year: "20 Jan - 23 March 24"
      return `${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM yy')}`;
    } else {
      // Different years: "20 Dec 24 - 24 March 25"
      return `${format(startDate, 'dd MMM yy')} - ${format(
        endDate,
        'dd MMM yy'
      )}`;
    }
  };

  const buttonElement = (
    <Button
      variant="text"
      onClick={() => setIsDialogOpen(true)}
      sx={{ textTransform: 'none', color: theme.palette.text.secondary }}
    >
      <Typography variant="body1">{formatDateRangeText()}</Typography>
    </Button>
  );

  return (
    <CardComponent
      title="Your Transactions"
      cardStyle={{ height: '100%' }}
      cardContentStyle={{ height: '100%' }}
      buttonComponent={buttonElement}
      onClick={() => setIsDialogOpen(true)}
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
        {Object.entries(groupTransactions(filteredTransactions)).map(
          ([group, transactions]) => (
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
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
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
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {format(
                              new Date(transaction.completedAt),
                              'PPPppp'
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
          )
        )}
      </Box>

      <Dialog
        maxWidth="sm"
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#151D27',
            color: 'white',
            borderRadius: '20px',
            padding: '16px',
          },
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <DateRange
            className="calendar-container"
            onChange={(item) =>
              setDateRange([
                item.selection as {
                  startDate: Date;
                  endDate: Date;
                  key: string;
                },
              ])
            }
            direction="horizontal"
            moveRangeOnFirstSelection={false}
            ranges={dateRange}
            color="#6293b3"
            rangeColors={['#6293b3']}
            months={2}
            maxDate={new Date()}
            showDateDisplay={false}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showFutureTransactions}
                onChange={(e) => setShowFutureTransactions(e.target.checked)}
                sx={{
                  color: 'white',
                  '&.Mui-checked': {
                    color: 'white',
                  },
                }}
              />
            }
            label="Show future transactions"
            sx={{ color: 'white', mt: 2 }}
          />
        </DialogContent>
      </Dialog>
    </CardComponent>
  );
};

export default TransactionTile;
