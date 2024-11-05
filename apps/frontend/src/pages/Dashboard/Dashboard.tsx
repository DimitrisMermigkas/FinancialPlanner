import React from 'react';
import TransactionsCard from '../../components/Transactions/TransactionCard';
import BalanceDisplay from '../../components/Balance/BalanceDisplay';
import BalanceChart from '../../components/Balance/BalanceChart';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import { PageLayout } from '@my-workspace/react-components';

const Dashboard: React.FC = () => {
  const {
    getBalanceHistory,
    monthlyBalances,
    balanceHistory,
    transactions,
    balance,
    showChart,
    setTransactions,
    setBalance,
    setShowChart,
  } = useDashboardHandlers();

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
        <BalanceDisplay balance={balance} />
        <div
          style={{
            display: 'flex',
            columnGap: '2%',
            height: '100%',
          }}
        >
          <TransactionsCard
            transactions={transactions}
            setTransactions={setTransactions}
            setBalance={setBalance}
          />
          <BalanceChart monthlyBalances={monthlyBalances} />
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
