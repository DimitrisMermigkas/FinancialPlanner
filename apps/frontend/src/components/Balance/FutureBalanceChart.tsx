import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useFutureBalanceHandlers from '../../handlers/FutureBalance.handlers';
import { useEffect } from 'react';
import { format } from 'date-fns';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CardComponent from '../common/CardComponent';
import { History, Funds, Transaction } from '@my-workspace/common';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';

interface FutureBalanceChartProps {
  balances: History[];
  funds: Funds[];
  futureTransactions: Transaction[];
}

const FutureBalanceChart: React.FC<FutureBalanceChartProps> = ({
  balances,
  funds,
  futureTransactions,
}) => {
  const { getMonthlyBalances } = useDashboardHandlers();
  const monthlyBalances = getMonthlyBalances(balances);
  const { monthsAhead, setMonthsAhead, chartData } = useFutureBalanceHandlers({
    funds,
    monthlyBalances,
    futureTransactions,
  });

  const handleMonthsChange = (event: SelectChangeEvent<number>) => {
    setMonthsAhead(event.target.value as number);
  };

  return (
    <CardComponent>
      <Select
        value={monthsAhead} // Use monthsAhead for value
        onChange={handleMonthsChange}
      >
        {[1, 2, 3, 4, 5, 6].map((month) => (
          <MenuItem key={month} value={month}>
            {month} {month === 1 ? 'Month' : 'Months'}
          </MenuItem>
        ))}
      </Select>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          height={200}
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="amountA"
            stroke="#8884d8"
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="amountB"
            stroke="#8884d8"
            connectNulls
            strokeDasharray="3 3" // Dashed line for the rest
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardComponent>
  );
};

export default FutureBalanceChart;
