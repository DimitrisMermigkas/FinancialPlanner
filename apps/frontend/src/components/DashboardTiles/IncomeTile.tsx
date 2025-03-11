import React from 'react';
import { useTransactions } from '../../api/apiHooks';
import StatCard from '../common/StatCard';
import { Range } from 'react-date-range';

interface IncomeTileProps {
  dateRange?: Range;
  onDateRangeChange?: (range: Range) => void;
}

const IncomeTile: React.FC<IncomeTileProps> = ({ dateRange, onDateRangeChange }) => {
  const { data: transactions = [] } = useTransactions();
  const [internalRange, setInternalRange] = React.useState<Range | undefined>();

  const currentDateRange = dateRange || internalRange;

  const calculateIncome = React.useMemo(() => {
    const now = new Date();
    const startDate = currentDateRange?.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = currentDateRange?.endDate || now;

    const filteredTransactions = transactions.filter(
      (t) => t.type === 'income' && 
      new Date(t.completedAt) >= startDate &&
      new Date(t.completedAt) <= endDate
    );

    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentDateRange?.startDate, currentDateRange?.endDate]);

  const calculatePercentageChange = () => {
    // Example: comparing with previous period
    // You would implement logic here to compare with previous period
    return 28; // Example return showing 28% increase
  };

  return (
    <StatCard
      title="Income"
      amount={calculateIncome}
      percentageChange={calculatePercentageChange()}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      onInternalDateRangeChange={setInternalRange}
      gradientColors={['#2A3A4D', '#151D27']}
    />
  );
};

export default IncomeTile; 