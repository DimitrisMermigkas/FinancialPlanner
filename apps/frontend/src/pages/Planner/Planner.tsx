import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PlannedTransactions from '../../components/Transactions/PlannedTransactions';
import Goals from '../../components/Goals/Goals';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import { PageLayout } from '@my-workspace/react-components';
import FutureBalanceChart from '../../components/Balance/FutureBalanceChart';

const Planner: React.FC = () => {
  const { transactions, monthlyBalances, funds, setTransactions, setBalance } =
    useDashboardHandlers();

  const today = new Date();
  const futureTransactions = transactions.filter(
    (transaction) => new Date(transaction.completedAt) > today
  );

  return (
    <PageLayout
      title="Future Planning & Milestones"
      style={{
        color: '#f2f4f7ff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      contentStyle={{ columnGap: '2%' }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '35%',
          rowGap: '16px',
        }}
      >
        <PlannedTransactions
          transactions={transactions}
          futureTransactions={futureTransactions}
          setTransactions={setTransactions}
          setBalance={setBalance}
        />
        <Goals />
      </div>

      {monthlyBalances && (
        <FutureBalanceChart
          monthlyBalances={monthlyBalances}
          funds={funds}
          futureTransactions={futureTransactions}
        />
      )}
    </PageLayout>
  );
};

export default Planner;
