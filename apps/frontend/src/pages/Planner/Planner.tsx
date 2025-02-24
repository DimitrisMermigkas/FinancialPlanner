import React from 'react';
import { Loading, PageLayout } from '@my-workspace/react-components';
import { useHistory, useFunds, useTransactions } from '../../api/apiHooks';
import FutureBalanceChart from '../../components/Balance/FutureBalanceChart';
import ExpensesTile from '../../components/DashboardTiles/ExpensesTile';
import IncomeTile from '../../components/DashboardTiles/IncomeTile';
import { Box } from '@mui/material';
import TransactionsCard from '../../components/Transactions/TransactionCard';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';

const Planner: React.FC = () => {
  const today = new Date();
  const { data: balanceHistory, isBalancesLoading } = useHistory();
  const { data: funds, loading: isFundsLoading } = useFunds();
  const { data: transactions, loading: isTransactionsLoading } =
    useTransactions();

  const futureTransactions = transactions.filter(
    (transaction) => new Date(transaction.completedAt) > today
  );
  const { calculateMonthlyExpenses } = useDashboardHandlers();
  const loadingData =
    isBalancesLoading || isFundsLoading || isTransactionsLoading;

    
  return (
    <PageLayout
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <div
        style={{ display: 'flex', gap: '16px', height: '100%', width: '100%' }}
      >
        {/* Left Column - 40% */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: '1 0 40%',
          }}
        >
          {/* Top Tiles */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              height: '40%',
              width: '100%',
            }}
          >
            <ExpensesTile />
            <IncomeTile />
          </Box>

          {/* Transactions Grid */}
          <div
            style={{
              height: '70%',
              flex: '1 0 40%',
              width: '100%',
              overflow: 'auto',
            }}
          >
            <TransactionsCard
              calculateMonthlyExpenses={calculateMonthlyExpenses}
            />
          </div>
        </div>

        {/* Right Column - 60% */}
        <div style={{ flex: '1 0 55%', height: '100%' }}>
          <Loading isLoading={loadingData}>
            {!loadingData && (
              <FutureBalanceChart
                balances={balanceHistory}
                funds={funds}
                futureTransactions={futureTransactions}
              />
            )}
          </Loading>
        </div>
      </div>
    </PageLayout>
  );
};

export default Planner;
