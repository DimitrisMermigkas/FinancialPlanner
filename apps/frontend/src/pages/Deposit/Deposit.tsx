import { PageLayout } from '@my-workspace/react-components';
import SavingsTile from '../../components/DashboardTiles/SavingsTile';
import SavingsGrowth from '../../components/Savings/SavingsGrowth';
import SavingsPieChart from '../../components/Savings/SavingsPieChart';
import SavingsTableCard from '../../components/Savings/SavingsTableCard';

const DepositAndFunds: React.FC = () => {
  return (
    <PageLayout
      style={{
        display: 'flex',
        height: '100%',
      }}
      contentStyle={{ flexDirection: 'column', gap: '16px', rowGap: '16px' }}
    >
      <div
        style={{
          display: 'flex',
          gap: '16px',
          height: '100%',
        }}
      >
        <div style={{ flex: '0 0 35%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
            }}
          >
            <div style={{ height: '40%' }}>
              <SavingsTile title="Total Savings" />
            </div>
            <div style={{ height: '60%' }}>
              <SavingsPieChart />
            </div>
          </div>
        </div>
        <div style={{ flex: '1 0 55%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
            }}
          >
            <div style={{ height: '40%' }}>
              <SavingsGrowth />
            </div>
            <div style={{ height: '60%' }}>
              <SavingsTableCard />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DepositAndFunds;
