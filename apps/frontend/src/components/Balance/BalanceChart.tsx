import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import CardComponent from '../CardComponent/CardComponent';
import { History } from '@my-workspace/common';

interface BalanceChartProps {
  monthlyBalances: History[] | undefined;
}

const BalanceChart: React.FC<BalanceChartProps> = ({
  monthlyBalances = [],
}) => {
  const calculateBalanceDataSet = (balances: History[]) => {
    // Define the date range and initialize arrays
    const endDate = new Date();
    const startDate = subDays(endDate, 33);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Use a map to track the most recent balance for each date
    const balanceMap: Record<string, number | null> = {};

    monthlyBalances.forEach((item) => {
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
    <CardComponent>
      {monthlyBalances && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            height={200}
            data={calculateBalanceDataSet(monthlyBalances)}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            <Line
              data={calculateBalanceDataSet(monthlyBalances)}
              type="monotone"
              dataKey="amount"
              stroke="#8884d8"
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </CardComponent>
  );
};

export default BalanceChart;
