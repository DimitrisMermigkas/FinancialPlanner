import React, { useEffect, useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import TransactionsCard from './TransactionCard';
import BalanceDisplay from './BalanceDisplay';
import FundsCard from './FundsCard';
import {
  fetchBalanceHistory,
  fetchCurrentBalance,
  fetchFunds,
  fetchReasons,
  fetchTransactions,
} from '../../services/api';
import BalanceChart from './BalanceChart';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [funds, setFunds] = useState<any[]>([]);
  const [reasons, setReasons] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [showChart, setShowChart] = useState(false);

  const { getBalanceHistory, monthlyBalances, balanceHistory } =
    useDashboardHandlers();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        const fundsData = await fetchFunds();
        const balanceData = await fetchCurrentBalance();
        const reasonsList = await fetchReasons();
        setTransactions(transactionsData);
        setFunds(fundsData);
        setBalance(balanceData.amount);
        setReasons(reasonsList);
        getBalanceHistory();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <BalanceDisplay balance={balance} />
      {/* Button to show the chart */}
      <div style={{}}>
        <Button variant="contained" onClick={() => setShowChart(true)}>
          Show Balance History
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          height: 'calc(100% - 204px)',
        }}
      >
        <TransactionsCard
          transactions={transactions}
          setTransactions={setTransactions}
          setBalance={setBalance}
        />
        <FundsCard
          funds={funds}
          reasons={reasons}
          setReasons={setReasons}
          setBalance={setBalance}
        />
      </div>

      {/* Render chart only when showChart is true */}
      {showChart && monthlyBalances && (
        <BalanceChart
          open={showChart}
          data={monthlyBalances}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
