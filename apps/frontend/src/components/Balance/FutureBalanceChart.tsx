import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Grid,
  Paper,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import useFutureBalanceHandlers from '../../handlers/FutureBalance.handlers';
import { useEffect, useState } from 'react';
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
import {
  History,
  Funds,
  Transaction,
  Subscription,
} from '@my-workspace/common';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import { Box, Typography } from '@mui/material';
import { ScenarioDialog, ScenarioParams } from './ScenarioDialog';

interface FutureBalanceChartProps {
  balances: History[];
  funds: Funds[];
  futureTransactions: Transaction[];
  subscriptions: Subscription[];
  transactions: Transaction[];
}

interface AnalyticsData {
  averageMonthlyExpenses: number;
  averageBalanceGrowth: number;
  bestIncomeMonth: {
    month: string;
    amount: number;
  };
  worstIncomeMonth: {
    month: string;
    amount: number;
  };
}

const calculateAnalytics = (
  chartData: any[],
  transactions: Transaction[]
): AnalyticsData => {
  if (!chartData || chartData.length === 0) {
    return {
      averageMonthlyExpenses: 0,
      averageBalanceGrowth: 0,
      bestIncomeMonth: { month: 'No data', amount: 0 },
      worstIncomeMonth: { month: 'No data', amount: 0 },
    };
  }

  // Get only completed months (where curBalance exists)
  const completedMonths = chartData.filter((data) => data.curBalance !== null);

  // Calculate monthly changes for growth
  const monthlyChanges = completedMonths.reduce(
    (acc: { [key: string]: number }, data, index, array) => {
      if (index === 0) return acc;

      const prevMonth = array[index - 1].curBalance;
      const change = data.curBalance - prevMonth;
      acc[data.date] = change;

      return acc;
    },
    {}
  );

  // Group transactions by month and calculate total expenses
  const monthlyExpenses = transactions.reduce(
    (acc: { [key: string]: number }, transaction) => {
      if (transaction.type === 'expense') {
        const date = new Date(transaction.completedAt);
        const monthKey = format(date, 'MMM yy');

        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] += transaction.amount;
      }
      return acc;
    },
    {}
  );

  // Calculate average monthly expenses from transactions
  const expenseValues = Object.values(monthlyExpenses);
  const averageMonthlyExpenses =
    expenseValues.length > 0
      ? expenseValues.reduce((sum, exp) => sum + exp, 0) / expenseValues.length
      : 0;

  // Calculate average balance growth (positive changes)
  const growthChanges = Object.values(monthlyChanges).filter(
    (change) => change > 0
  );
  const averageBalanceGrowth =
    growthChanges.length > 0
      ? growthChanges.reduce((sum, growth) => sum + growth, 0) /
        growthChanges.length
      : 0;

  // Find best and worst months
  const monthlyChangeEntries = Object.entries(monthlyChanges);
  const defaultMonth = { month: 'No data', amount: 0 };

  const bestIncomeMonth =
    monthlyChangeEntries.length > 0
      ? monthlyChangeEntries.reduce(
          (best, [month, change]) =>
            change > best.amount ? { month, amount: change } : best,
          {
            month: monthlyChangeEntries[0][0],
            amount: monthlyChangeEntries[0][1],
          }
        )
      : defaultMonth;

  const worstIncomeMonth =
    monthlyChangeEntries.length > 0
      ? monthlyChangeEntries.reduce(
          (worst, [month, change]) =>
            change < worst.amount ? { month, amount: change } : worst,
          {
            month: monthlyChangeEntries[0][0],
            amount: monthlyChangeEntries[0][1],
          }
        )
      : defaultMonth;

  return {
    averageMonthlyExpenses,
    averageBalanceGrowth,
    bestIncomeMonth,
    worstIncomeMonth,
  };
};

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
  transactions,
}) => {
  const { getMonthlyBalances } = useDashboardHandlers();
  const monthlyBalances = getMonthlyBalances(balances);
  const { monthsAhead, setMonthsAhead, chartData } = useFutureBalanceHandlers({
    funds,
    monthlyBalances,
    futureTransactions,
    subscriptions,
  });

  const analytics = calculateAnalytics(chartData, transactions);

  const [scenarioDialogOpen, setScenarioDialogOpen] = useState(false);
  const [showScenario, setShowScenario] = useState(false);
  const [scenarioData, setScenarioData] = useState<any[]>([]);

  const calculateScenario = (params: ScenarioParams) => {
    const newChartData = chartData.map((point) => {
      if (!point.projBalance) return point;

      const currentDate = format(new Date(), 'MMM yy'); // Define the current date
      const splitIndex = chartData.findIndex(
        (data) => data.date === currentDate
      );

      const monthsFromNow = chartData.indexOf(point) - splitIndex;
      if (monthsFromNow <= 0) return point;

      // Calculate cumulative effect
      const expenseMultiplier = Math.pow(
        1 + params.expenseChange / 100,
        monthsFromNow
      );
      const incomeMultiplier = Math.pow(
        1 + params.incomeChange / 100,
        monthsFromNow
      );

      // Adjust the projected balance based on the scenario
      const adjustedBalance =
        point.projBalance * (incomeMultiplier - expenseMultiplier + 1);

      return {
        ...point,
        scenarioBalance: adjustedBalance,
      };
    });

    setScenarioData(newChartData);
    setShowScenario(true);
  };

  const handleScenarioOpen = () => setScenarioDialogOpen(true);
  const handleScenarioClose = () => setScenarioDialogOpen(false);
  const handleScenarioConfirm = (params: ScenarioParams) => {
    calculateScenario(params);
    handleScenarioClose();
  };

  const handleMonthsChange = (event: SelectChangeEvent<number>) => {
    setMonthsAhead(event.target.value as number);
  };

  return (
    <CardComponent
      title="Balance Forecast"
      buttonComponent={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={handleScenarioOpen}
            variant="contained"
            size="small"
            sx={{ borderRadius: '10px' }}
            color="primary"
          >
            Create Scenario
          </Button>
          {scenarioData.length > 0 && (
            <FormControlLabel
              control={
                <Switch
                  checked={showScenario}
                  onChange={(e) => setShowScenario(e.target.checked)}
                  size="small"
                />
              }
              label="Show Scenario"
            />
          )}
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
      }
      cardStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Analytics Section */}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 1,
                background: `linear-gradient(165deg, #2A3A4DCC 0%, #0B0D1B5E 100%)`,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
                Monthly Averages
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption" color="rgba(255,255,255,0.5)">
                    Expenses
                  </Typography>
                  <Typography variant="h6" color="#ff4842">
                    -€{analytics.averageMonthlyExpenses.toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="caption" color="rgba(255,255,255,0.5)">
                    Growth
                  </Typography>
                  <Typography variant="h6" color="#22c55e">
                    +€{analytics.averageBalanceGrowth.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 1,
                background: `linear-gradient(165deg, #2A3A4DCC 0%, #0B0D1B5E 100%)`,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
                Best Income Month
              </Typography>
              <Typography variant="h6">
                €{analytics.bestIncomeMonth.amount.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.5)">
                {analytics.bestIncomeMonth.month}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper
              sx={{
                p: 1,
                background: `linear-gradient(165deg, #2A3A4DCC 0%, #0B0D1B5E 100%)`,
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle2" color="rgba(255,255,255,0.7)">
                Worst Income Month
              </Typography>
              <Typography variant="h6">
                €{analytics.worstIncomeMonth.amount.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="rgba(255,255,255,0.5)">
                {analytics.worstIncomeMonth.month}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, p: 2 }}>
        <ResponsiveContainer width="100%" height={550}>
          <AreaChart
            data={showScenario ? scenarioData : chartData}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#91BAD2" stopOpacity={1} />
                <stop offset="100%" stopColor="#0075FF" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={5} />
            <YAxis
              tickMargin={20}
              // width={80}
              tickFormatter={(value) => `€${value}`}
            />
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
            {showScenario && (
              <Area
                name="Scenario Balance"
                type="monotone"
                dataKey="scenarioBalance"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
                strokeDasharray="3 3"
                connectNulls
                isAnimationActive={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      <ScenarioDialog
        open={scenarioDialogOpen}
        onClose={handleScenarioClose}
        onConfirm={handleScenarioConfirm}
      />
    </CardComponent>
  );
};

export default FutureBalanceChart;
