import React from 'react';
import { useTransactions } from '../../api/apiHooks';
import StatCard from '../common/StatCard';
import { Range } from 'react-date-range';

interface ExpensesTileProps {
  dateRange?: Range;
  onDateRangeChange?: (range: Range) => void;
}

const ExpensesTile: React.FC<ExpensesTileProps> = ({ dateRange, onDateRangeChange }) => {
  const { data: transactions = [] } = useTransactions();
  const [internalRange, setInternalRange] = React.useState<Range | undefined>();

  const currentDateRange = dateRange || internalRange;

  const calculateExpenses = React.useMemo(() => {
    const now = new Date();
    const startDate = currentDateRange?.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = currentDateRange?.endDate || now;

    const filteredTransactions = transactions.filter(
      (t) => t.type === 'expense' && 
      new Date(t.completedAt) >= startDate &&
      new Date(t.completedAt) <= endDate
    );

    return Math.abs(filteredTransactions.reduce((sum, t) => sum + t.amount, 0));
  }, [transactions, currentDateRange?.startDate, currentDateRange?.endDate]);

  const calculatePercentageChange = () => {
    // Example: comparing with previous period
    // You would implement logic here to compare with previous period
    return -14; // Example return showing 14% decrease
  };

  return (
    <StatCard
      title="Expenses"
      amount={calculateExpenses}
      percentageChange={calculatePercentageChange()}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      onInternalDateRangeChange={setInternalRange}
      gradientColors={['#2A3A4D', '#151D27']}
    />
  );
};

export default ExpensesTile;
