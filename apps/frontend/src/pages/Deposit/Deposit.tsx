import { PageLayout } from '@my-workspace/react-components';
import FundsCard from '../../components/Funds/FundsCard';
import { useFunds, useReasons } from '../../api/apiHooks';

const DepositAndFunds: React.FC = () => {
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
      <FundsCard />
    </PageLayout>
  );
};
export default DepositAndFunds;
