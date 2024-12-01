import React from 'react';
import PlannedTransactions from '../../components/Transactions/PlannedTransactions';
import Goals from '../../components/Goals/GoalsCard';
import { Loading, PageLayout } from '@my-workspace/react-components';
import FutureBalanceChart from '../../components/Balance/FutureBalanceChart';
import { useHistory, useFunds, useTransactions } from '../../api/apiHooks';

const Planner: React.FC = () => {
  const today = new Date();
  const { data: balanceHistory, isBalancesLoading } = useHistory();
  const { data: funds, loading: isFundsLoading } = useFunds();

  const { data: transactions, loading: isTransactionsLoading } =
    useTransactions();

  const futureTransactions = transactions.filter(
    (transaction) => new Date(transaction.completedAt) > today
  );
  const loadingData =
    isBalancesLoading || isFundsLoading || isTransactionsLoading;
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
      <Loading
        isLoading={loadingData}
        style={{ width: '100%', height: '100%' }}
      >
        {!loadingData && (
          <FutureBalanceChart
            balances={balanceHistory}
            funds={funds}
            futureTransactions={futureTransactions}
          />
        )}
      </Loading>
    </PageLayout>
  );
};

export default Planner;
