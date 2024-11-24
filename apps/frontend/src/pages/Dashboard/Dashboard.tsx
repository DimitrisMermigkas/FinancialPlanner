import React from 'react';
import TransactionsCard from '../../components/Transactions/TransactionCard';
import BalanceDisplay from '../../components/Balance/BalanceDisplay';
import BalanceChart from '../../components/Balance/BalanceChart';
import { PageLayout } from '@my-workspace/react-components';
import { useBalances } from '../../api/apiHooks';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';

const Dashboard: React.FC = () => {
  const { data: balances } = useBalances();
  const { getMonthlyBalances } = useDashboardHandlers();
  const monthlyBalances = getMonthlyBalances(balances);

  const currectBalance = balances.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  })[0];
  return (
    <PageLayout
      title="Current Balance"
      style={{
        color: '#f2f4f7ff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        <BalanceDisplay balance={currectBalance} />
        <div
          style={{
            display: 'flex',
            columnGap: '2%',
            height: '100%',
          }}
        >
          <TransactionsCard />
          <BalanceChart monthlyBalances={monthlyBalances} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
