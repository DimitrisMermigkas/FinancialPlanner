import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Switch,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Balance, Fund, Transaction } from '../../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import useBalanceHandlers from 'apps/frontend/src/handlers/Balance.handlers';
import { format } from 'date-fns';

interface BalanceChartProps {
  open: boolean;
  onClose: () => void;
  monthlyBalances: Balance[];
  funds: Fund[];
  futureTransactions: Transaction[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({
  open,
  onClose,
  monthlyBalances,
  funds,
  futureTransactions,
}) => {
  const {
    getMonthlyBalanceData,
    calculateMonthlyFunds,
    calculateMonthlyFutureTransactions,
    addFundsToMonthlyBalance,
    dataset,
    showProjected,
    setShowProjected,
    myIncome,
    setMyIncome,
    projectedData,
    setProjectedData,
    monthsAhead,
    setMonthsAhead,
    forecastMonthlyData,
  } = useBalanceHandlers(monthlyBalances);

  const monthlyData = getMonthlyBalanceData(monthlyBalances);
  const monthlyFunds = calculateMonthlyFunds(funds);
  const monthlyFutureTransactions =
    calculateMonthlyFutureTransactions(futureTransactions);
  // Pre-compute the fullMonthlyBalance outside of the useEffect dependency
  const fullMonthlyBalance = addFundsToMonthlyBalance(
    monthlyData,
    monthlyFunds
  );

  const handleMonthsChange = (event: SelectChangeEvent<number>) => {
    setMonthsAhead(event.target.value as number);
  };

  useEffect(() => {
    // Set the projected data only when necessary dependencies change
    const updatedProjectedData = forecastMonthlyData(
      fullMonthlyBalance,
      monthlyFutureTransactions,
      myIncome,
      monthsAhead
    );
    setProjectedData(updatedProjectedData);
  }, [myIncome, monthsAhead]); // Only trigger when myIncome or monthsAhead change

  // Split projectedData based on the current date "Nov 24"
  const currentDate = format(new Date(), 'MMM yy'); // Define the current date
  const splitIndex = projectedData.findIndex(
    (data) => data.date === currentDate
  );

  // Map over the projectedData to create a new array with amountA and amountB
  const updatedProjectedData = projectedData.map((data, index) => ({
    date: data.date,
    amountA: index <= splitIndex ? data.amount : null, // amountA is the amount if index is less than or equal to splitIndex
    amountB: index >= splitIndex ? data.amount : null, // amountB is the amount if index is greater than splitIndex
  }));

  // updatedProjectedData now contains both amountA and amountB keys

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Balance History</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={showProjected}
              onChange={() => setShowProjected(!showProjected)}
            />
          }
          label="Show Projected Balance"
        />
        {showProjected && (
          <>
            <Typography variant="h6">Select Months to Forecast:</Typography>
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
          </>
        )}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            height={200}
            data={showProjected ? updatedProjectedData : dataset}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {!showProjected ? (
              <Line
                data={dataset}
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                connectNulls
              />
            ) : (
              <>
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
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </DialogContent>
      <Button
        onClick={onClose}
        color="primary"
        variant="contained"
        style={{ margin: '20px' }}
      >
        Close
      </Button>
    </Dialog>
  );
};

export default BalanceChart;
