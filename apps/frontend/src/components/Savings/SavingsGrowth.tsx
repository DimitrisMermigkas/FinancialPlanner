import React, { useState } from 'react';
import { useTransactions } from '../../api/apiHooks';
import CardComponent from '../common/CardComponent';
import { Box, Typography } from '@mui/material';
import {
  Cell,
  Bar,
  BarChart,
  XAxis,
  Tooltip,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyDetail {
  month: string;
  details: Array<{
    reason: string;
    amount: number;
    date: Date;
  }>;
  total: number;
}

const SavingsGrowth: React.FC = () => {
  const [itemIndex, setItemIndex] = useState<number | null>(null);
  const { data: transactions = [] } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState<MonthlyDetail | null>(
    null
  );

  const getLastSixMonths = () => {
    const months: Date[] = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      months.push(new Date(today.getFullYear(), today.getMonth() - i, 1));
    }
    return months;
  };

  const monthlyData = React.useMemo(() => {
    const months = getLastSixMonths();

    return months.map((monthDate) => {
      const monthTransactions = transactions.filter(
        (t) =>
          t.type === 'fund' &&
          new Date(t.completedAt).getMonth() === monthDate.getMonth() &&
          new Date(t.completedAt).getFullYear() === monthDate.getFullYear()
      );

      const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);

      return {
        month: monthDate.toLocaleString('default', { month: 'short' }),
        details: monthTransactions.map((t) => ({
          reason: t.description || 'Unknown',
          amount: t.amount,
          date: new Date(t.completedAt),
        })),
        total,
      };
    });
  }, [transactions]);

  const handleBarClick = (event: unknown, itemIndex: number) => {
    setSelectedMonth(monthlyData[itemIndex]);
    setItemIndex(itemIndex);
  };

  return (
    <CardComponent
      title="Monthly Savings"
      cardStyle={{ height: '100%' }}
      cardContentStyle={{ height: '100%' }}
    >
      <Box sx={{ display: 'flex', gap: 2, height: '100%', overflow: 'auto' }}>
        <ResponsiveContainer width="70%" height="80%">
          <BarChart data={monthlyData} height={300} width={500}>
            <XAxis
              dataKey="month"
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={false}
              tickMargin={5}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={false}
              tickMargin={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1F2E',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Bar dataKey="total" onClick={handleBarClick}>
              {monthlyData.map((entry, index) => (
                <Cell
                  cursor="pointer"
                  fill={index === itemIndex ? '#82ca9d' : '#8884d8'}
                  key={`cell-${index}`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {selectedMonth && (
          <Box
            sx={{
              flex: '0 0 200px',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              paddingLeft: 2,
              overflowY: 'auto',
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
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {selectedMonth.month} Details
            </Typography>
            {selectedMonth.details.map((detail, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2" color="rgba(255,255,255,0.7)">
                  {detail.reason}
                </Typography>
                <Typography variant="body1">
                  €{detail.amount.toFixed(2)}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.5)">
                  {detail.date.toLocaleDateString()}
                </Typography>
              </Box>
            ))}
            <Box
              sx={{
                mt: 2,
                pt: 1,
                borderTop: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Typography variant="subtitle2">
                Total: €{selectedMonth.total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </CardComponent>
  );
};

export default SavingsGrowth;
