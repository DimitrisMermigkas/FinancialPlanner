import React, { useEffect, useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import TransactionsCard from './Transactions/TransactionCard';
import BalanceDisplay from './Balance/BalanceDisplay';
import FundsCard from './Funds/FundsCard';
import {
  fetchBalanceHistory,
  fetchCurrentBalance,
  fetchFunds,
  fetchReasons,
  fetchTransactions,
} from '../../services/api';
import BalanceChart from './Balance/BalanceChart';
import useDashboardHandlers from '../../handlers/Dashboard.handlers';
import PlannedTransactions from './Transactions/PlannedTransactions';

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

  const today = new Date();
  const futureTransactions = transactions.filter(
    (transaction) => new Date(transaction.completedAt) > today
  );
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <BalanceDisplay balance={balance} setShowChart={setShowChart} />
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
        <PlannedTransactions
          transactions={transactions}
          futureTransactions={futureTransactions}
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
          monthlyBalances={monthlyBalances}
          funds={funds}
          futureTransactions={futureTransactions}
          onClose={() => setShowChart(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
