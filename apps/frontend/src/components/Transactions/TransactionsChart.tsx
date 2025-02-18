import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import CardComponent from '../common/CardComponent';
import { History } from '@my-workspace/common';

interface TransactionsChartProps {
  monthlyBalances: History[] | undefined;
}

const TransactionsChart: React.FC<TransactionsChartProps> = ({
  monthlyBalances = [],
}) => {
  const calculateBalanceDataSet = (balances: History[]) => {
    const sortedData = balances.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order
    });

    // Define the date range and initialize arrays
    const endDate = new Date();
    const startDate = subDays(endDate, 33);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Use a map to track the most recent balance for each date
    const balanceMap: Record<string, number | null> = {};

    sortedData.forEach((item) => {
      if (!item.createdAt) return;
      const dateString = format(new Date(item.createdAt), 'yyyy-MM-dd');
      // Store the first occurrence (most recent due to sorted order)
      if (!(dateString in balanceMap)) {
        balanceMap[dateString] = item.amount;
      }
    });

    // Map over the date range to construct the dataset
    const dataset = dateRange.map((date) => {
      const dateString = format(date, 'yyyy-MM-dd');
      return {
        date: format(date, 'MMM-dd'),
        amount: balanceMap[dateString] || null,
      };
    });

    return dataset;
  };

  return (
    <CardComponent cardStyle={{ height: '100%' }} title="Balance Overview">
      {monthlyBalances && (
        <ResponsiveContainer height={350}>
          <AreaChart
            height={200}
            data={calculateBalanceDataSet(monthlyBalances)}
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#91BAD2" stopOpacity={1} />
                <stop offset="100%" stopColor="#0075FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255, 255, 255, 0.3)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1F2E',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#91BAD2"
              strokeWidth={2}
              fill="url(#colorBalance)"
              fillOpacity={1}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </CardComponent>
  );
};

export default TransactionsChart;
