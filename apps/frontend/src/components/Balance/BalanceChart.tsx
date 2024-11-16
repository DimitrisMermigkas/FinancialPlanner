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
import { Balance } from '@my-workspace/common';

interface BalanceChartProps {
  monthlyBalances: Balance[] | undefined;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ monthlyBalances }) => {
  const calculateBalanceDataSet = (balances: Balance[]) => {
    // Sort data by date, ensuring `updatedAt` is defined
    const sortedData = balances.sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateA - dateB;
    });

    // Define the date range and initialize arrays
    const endDate = new Date();
    const startDate = subDays(endDate, 33);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Map sortedData amounts to corresponding dates or set to `null` if no data exists for that date
    const dataset = dateRange.map((date) => {
      const dateString = format(date, 'yyyy-MM-dd');

      // Find the record safely checking for `updatedAt`
      const record = sortedData.find((item) => {
        if (!item.updatedAt) return false; // Skip items with undefined `updatedAt`
        return format(new Date(item.updatedAt), 'yyyy-MM-dd') === dateString;
      });

      return {
        date: format(date, 'MMM-dd'),
        amount: record ? record.amount : null,
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
