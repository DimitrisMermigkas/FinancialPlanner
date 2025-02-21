import React from 'react';
import { useTransactions } from '../../api/apiHooks';
import StatCard from '../common/StatCard';

const SavingsTile: React.FC = () => {
  const [timeFrame, setTimeFrame] = React.useState<
    'This Month' | 'Last Month' | 'This Year'
  >('This Month');
  const { data: transactions = [] } = useTransactions();

  const calculateSavings = () => {
    const now = new Date();
    const startDate =
      timeFrame === 'This Month'
        ? new Date(now.getFullYear(), now.getMonth(), 1)
        : timeFrame === 'Last Month'
        ? new Date(now.getFullYear(), now.getMonth() - 1, 1)
        : new Date(now.getFullYear(), 0, 1);

    const filteredTransactions = transactions.filter(
      (t) => t.type === 'fund' && new Date(t.completedAt) >= startDate
    );

    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const calculatePercentageChange = () => {
    // Calculate percentage change compared to previous period
    // Implementation depends on your requirements
    return 3.8; // Example return
  };

  return (
    <StatCard
      title="Savings"
      amount={calculateSavings()}
      percentageChange={calculatePercentageChange()}
      timeFrame={timeFrame}
      onTimeFrameChange={setTimeFrame}
      gradientColors={['#2A3A4D', '#151D27']}
    />
  );
};

export default SavingsTile;
