import React from 'react';
import { Grid2, Box } from '@mui/material';
import { PageLayout } from '@my-workspace/react-components';
import { useCurrentBalance, useHistory } from '../../api/apiHooks';
import BalanceDisplay from '../../components/Balance/BalanceDisplay';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import ExpensesTile from '../../components/DashboardTiles/ExpensesTile';
import IncomeTile from '../../components/DashboardTiles/IncomeTile';
import BalanceChart from '../../components/Balance/BalanceChart';
import GoalsTile from '../../components/DashboardTiles/GoalsTile';
import TransactionTile from '../../components/DashboardTiles/TransactionTile';
import SavingsTile from '../../components/DashboardTiles/SavingsTile';
import { Range } from 'react-date-range';

const Dashboard: React.FC = () => {
  const { data: balanceHistory } = useHistory();
  const { getYearlyBalances, calculateMonthlyExpenses } = useDashboardHandlers();
  const yearlyBalances = getYearlyBalances(balanceHistory);
  const { data: currentBalance } = useCurrentBalance();

  // Initialize date range to current month
  const [dateRange, setDateRange] = React.useState<Range>(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: startOfMonth,
      endDate: today,
      key: 'selection'
    };
  });

  return (
    <PageLayout contentStyle={{ overflow: 'hidden' }}>
      <Grid2
        container
        spacing={2}
        columns={12}
        style={{ width: '100%', margin: 0, height: '100vh' }}
      >
        {/* Left Section - 7 columns */}
        <Grid2 container size={{ xs: 12, md: 7 }} sx={{ height: '100%' }}>
          <Grid2
            container
            spacing={2}
            columns={7}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            {/* First Row - 20% */}
            <Grid2
              size={{ xs: 12, md: 7 }}
              sx={{
                height: '20%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Grid2 size={{ xs: 12, md: 3.5 }} sx={{ flex: 1 }}>
                <BalanceDisplay balance={currentBalance?.[0]} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3.5 }} sx={{ flex: 1 }}>
                <ExpensesTile dateRange={dateRange} onDateRangeChange={setDateRange} />
              </Grid2>
            </Grid2>

            {/* Second Row - 20% */}
            <Grid2
              size={{ xs: 12, md: 7 }}
              sx={{
                height: '20%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Grid2 size={{ xs: 12, md: 3.5 }} sx={{ flex: 1 }}>
                <SavingsTile title="Savings" dateRange={dateRange} onDateRangeChange={setDateRange} />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3.5 }} sx={{ flex: 1 }}>
                <IncomeTile dateRange={dateRange} onDateRangeChange={setDateRange} />
              </Grid2>
            </Grid2>

            {/* Third Row - 50% */}
            <Grid2 size={{ xs: 12, md: 7 }} sx={{ height: '50%' }}>
              {/* Balance Overview Chart */}
              <BalanceChart yearlyBalances={yearlyBalances} />
            </Grid2>
          </Grid2>
        </Grid2>
        {/* Right Section - 5 columns */}
        <Grid2
          size={{ xs: 12, md: 5 }}
          container
          spacing={2}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Grid2
            size={{ xs: 12, md: 12 }}
            sx={{
              gap: '16px',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* First Row - 50% */}
            <Grid2 size={{ xs: 12, md: 12 }} sx={{ height: '41.3%' }}>
              {/* Goals Component */}
              <GoalsTile />
            </Grid2>

            {/* Second Row - 50% */}
            <Grid2 size={{ xs: 12, md: 12 }} sx={{ height: '50.5%' }}>
              {/* Transactions List */}
              <TransactionTile />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </PageLayout>
  );
};

export default Dashboard;
