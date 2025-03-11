import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useFutureBalanceHandlers from '../../handlers/FutureBalance.handlers';
import { useEffect } from 'react';
import { format } from 'date-fns';
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CardComponent from '../common/CardComponent';
import { History, Funds, Transaction, Subscription } from '@my-workspace/common';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import { Box, Typography } from '@mui/material';

interface FutureBalanceChartProps {
  balances: History[];
  funds: Funds[];
  futureTransactions: Transaction[];
  subscriptions: Subscription[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0) {
    // If both curBalance and projBalance exist, only show projBalance (Projected Balance)
    const value = payload[1]?.value ?? payload[0]?.value;
    const dataKey = payload[1]?.dataKey ?? payload[0]?.dataKey;

    return (
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 1,
          border: 1,
          borderColor: 'grey.300',
          borderRadius: 1,
        }}
      >
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {dataKey == 'projBalance' ? 'Projected Balance: ' : 'Balance: '}€
          {value?.toFixed(2)}
        </Typography>
      </Box>
    );
  }
  return null;
};

const FutureBalanceChart: React.FC<FutureBalanceChartProps> = ({
  balances,
  funds,
  futureTransactions,
  subscriptions,
}) => {
  const { getMonthlyBalances } = useDashboardHandlers();
  const monthlyBalances = getMonthlyBalances(balances);
  const { monthsAhead, setMonthsAhead, chartData } = useFutureBalanceHandlers({
    funds,
    monthlyBalances,
    futureTransactions,
    subscriptions,
  });

  const handleMonthsChange = (event: SelectChangeEvent<number>) => {
    setMonthsAhead(event.target.value as number);
  };

  return (
    <CardComponent
      cardStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" component="h2">
          Balance Forecast
        </Typography>
        <Select
          value={monthsAhead}
          onChange={handleMonthsChange}
          size="small"
          sx={{ width: 120 }}
        >
          {[1, 2, 3, 4, 5, 6].map((month) => (
            <MenuItem key={month} value={month}>
              {month} {month === 1 ? 'Month' : 'Months'}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height={650}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#91BAD2" stopOpacity={1} />
                <stop offset="100%" stopColor="#0075FF" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={5} />
            <YAxis tickMargin={20} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              name="Balance"
              type="monotone"
              dataKey="curBalance"
              stroke="#8884d8"
              fill="url(#colorBalance)"
              fillOpacity={1}
              connectNulls
              isAnimationActive={false}
            />
            <Area
              name="Projected Balance"
              type="monotone"
              dataKey="projBalance"
              stroke="#8884d8"
              fill="url(#colorBalance)"
              fillOpacity={0.5}
              strokeDasharray="3 3"
              connectNulls
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </CardComponent>
  );
};

export default FutureBalanceChart;
