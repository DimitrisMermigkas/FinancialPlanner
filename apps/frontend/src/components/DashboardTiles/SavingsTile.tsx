import React from 'react';
import { useTransactions } from '../../api/apiHooks';
import StatCard from '../common/StatCard';
import { Range } from 'react-date-range';

interface SavingsTileProps {
  title: string;
  fullHeight?: boolean;
  dateRange?: Range;
  onDateRangeChange?: (range: Range) => void;
}

const SavingsTile: React.FC<SavingsTileProps> = ({
  title,
  fullHeight,
  dateRange,
  onDateRangeChange,
}) => {
  const { data: transactions = [] } = useTransactions();
  const [internalRange, setInternalRange] = React.useState<Range | undefined>();

  const currentDateRange = dateRange || internalRange;

  const calculateSavings = React.useMemo(() => {
    const now = new Date();
    const startDate = currentDateRange?.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = currentDateRange?.endDate || now;

    const filteredTransactions = transactions.filter(
      (t) => t.type === 'fund' && 
      new Date(t.completedAt) >= startDate &&
      new Date(t.completedAt) <= endDate
    );

    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, currentDateRange?.startDate, currentDateRange?.endDate]);

  const calculatePercentageChange = () => {
    // Calculate percentage change compared to previous period
    // Implementation depends on your requirements
    return 3.8; // Example return
  };

  return (
    <StatCard
      title={title}
      amount={calculateSavings}
      percentageChange={calculatePercentageChange()}
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      onInternalDateRangeChange={setInternalRange}
      gradientColors={['#2A3A4D', '#151D27']}
    />
  );
};

export default SavingsTile;
