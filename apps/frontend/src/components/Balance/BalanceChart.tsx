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
import { format } from 'date-fns';
import CardComponent from '../common/CardComponent';
import { History } from '@my-workspace/common';

interface BalanceChartProps {
  yearlyBalances: History[] | undefined;
}

const BalanceChart: React.FC<BalanceChartProps> = ({ yearlyBalances = [] }) => {
  const calculateBalanceDataSet = (balances: History[]) => {
    const sortedData = balances.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB; // Ascending order for proper timeline
    });

    // Map the data to include formatted dates and amounts
    const dataset = sortedData.map((item) => {
      return {
        date: item.createdAt ? format(new Date(item.createdAt), 'MMM') : '',
        amount: item.amount || null,
      };
    });

    return dataset;
  };

  return (
    <CardComponent cardStyle={{ height: '100%' }} title="Balance Overview">
      {yearlyBalances && (
        <ResponsiveContainer height={350}>
          <AreaChart
            height={200}
            data={calculateBalanceDataSet(yearlyBalances)}
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
              tickMargin={20}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.7)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)' }}
              axisLine={false}
              tickMargin={20}
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

export default BalanceChart;
