import { PageLayout } from '@my-workspace/react-components';
import FundsCard from '../../components/Funds/FundsCard';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';

const DepositAndFunds: React.FC = () => {
  const { funds, reasons, setReasons, setBalance } = useDashboardHandlers();

  return (
    <PageLayout
      title="Deposit and Funds"
      style={{
        color: '#f2f4f7ff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <FundsCard
        funds={funds}
        reasons={reasons}
        setReasons={setReasons}
        setBalance={setBalance}
      />
    </PageLayout>
  );
};
export default DepositAndFunds;
