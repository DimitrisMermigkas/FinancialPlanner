import React from 'react';
import TransactionsCard from '../../components/Transactions/TransactionCard';
import BalanceDisplay from '../../components/Balance/BalanceDisplay';
import BalanceChart from '../../components/Balance/BalanceChart';
import { PageLayout } from '@my-workspace/react-components';
import { useCurrentBalance, useHistory } from '../../api/apiHooks';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';

const Dashboard: React.FC = () => {
  const { data: balanceHistory } = useHistory();
  const { getMonthlyBalances } = useDashboardHandlers();
  const monthlyBalances = getMonthlyBalances(balanceHistory);

  const { data: currectBalance } = useCurrentBalance();
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
        <BalanceDisplay balance={currectBalance[0]} />
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
