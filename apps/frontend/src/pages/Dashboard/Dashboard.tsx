import React from 'react';
import { Grid2, Box } from '@mui/material';
import { PageLayout } from '@my-workspace/react-components';
import { useCurrentBalance, useHistory } from '../../api/apiHooks';
import BalanceDisplay from '../../components/Balance/BalanceDisplay';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import FundsTile from '../../components/DashboardTiles/FundsTile';
import ExpensesTile from '../../components/DashboardTiles/ExpensesTile';
import IncomeTile from '../../components/DashboardTiles/IncomeTile';
import BalanceChart from '../../components/Balance/BalanceChart';
import GoalsTile from '../../components/DashboardTiles/GoalsTile';

const Dashboard: React.FC = () => {
  const { data: balanceHistory } = useHistory();
  const { getYearlyBalances, calculateMonthlyExpenses } =
    useDashboardHandlers();
  const yearlyBalances = getYearlyBalances(balanceHistory);
  const { data: currentBalance } = useCurrentBalance();

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
                <ExpensesTile />
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
                <FundsTile />
              </Grid2>
              <Grid2 size={{ xs: 12, md: 3.5 }} sx={{ flex: 1 }}>
                <IncomeTile />
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
          {/* First Row - 50% */}
          <Grid2 size={{ xs: 12, md: 12 }} sx={{ height: '50%' }}>
            {/* Goals Component */}
            <GoalsTile />
          </Grid2>

          {/* Second Row - 50% */}
          <Grid2 size={{ xs: 12, md: 12 }} sx={{ height: '50%' }}>
            <Box
              sx={{
                backgroundColor: '#1A1F2E',
                borderRadius: '20px',
                padding: '20px',
                height: '100%',
              }}
            >
              {/* Transactions List */}
            </Box>
          </Grid2>
        </Grid2>
      </Grid2>
    </PageLayout>
  );
};

export default Dashboard;
