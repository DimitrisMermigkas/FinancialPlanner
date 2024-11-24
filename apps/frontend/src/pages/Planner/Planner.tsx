import React from 'react';
import PlannedTransactions from '../../components/Transactions/PlannedTransactions';
import Goals from '../../components/Goals/GoalsCard';
import { PageLayout } from '@my-workspace/react-components';
import FutureBalanceChart from '../../components/Balance/FutureBalanceChart';
import { useBalances, useFunds, useTransactions } from '../../api/apiHooks';

const Planner: React.FC = () => {
  const today = new Date();
  const { data: balances } = useBalances();
  const { data: funds } = useFunds();

  const { data: transactions } = useTransactions();

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
        />
        <Goals />
      </div>

      <FutureBalanceChart
        balances={balances}
        funds={funds}
        futureTransactions={futureTransactions}
      />
    </PageLayout>
  );
};

export default Planner;
