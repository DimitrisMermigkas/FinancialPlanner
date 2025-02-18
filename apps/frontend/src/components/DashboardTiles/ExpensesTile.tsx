import React from 'react';
import { useTransactions } from '../../api/apiHooks';
import StatCard from '../common/StatCard';

const ExpensesTile: React.FC = () => {
  const [timeFrame, setTimeFrame] = React.useState<
    'This Month' | 'Last Month' | 'This Year'
  >('This Month');
  const { data: transactions = [] } = useTransactions();

  const calculateExpenses = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeFrame) {
      case 'Last Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        break;
      case 'This Year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // This Month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredTransactions = transactions.filter(
      (t) => t.type === 'expense' && new Date(t.completedAt) >= startDate
    );

    return Math.abs(filteredTransactions.reduce((sum, t) => sum + t.amount, 0));
  };

  const calculatePercentageChange = () => {
    // Example: comparing with previous period
    const currentExpenses = calculateExpenses();
    // You would implement logic here to compare with previous period
    return -14; // Example return showing 14% decrease
  };

  return (
    <StatCard
      title="Expenses"
      amount={calculateExpenses()}
      percentageChange={calculatePercentageChange()}
      timeFrame={timeFrame}
      onTimeFrameChange={setTimeFrame}
      gradientColors={['#2A3A4D', '#151D27']} // You can adjust these colors
    />
  );
};

export default ExpensesTile;
