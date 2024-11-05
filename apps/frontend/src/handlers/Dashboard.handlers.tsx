import { useEffect, useState } from 'react';
import { Balance, fetchBalanceHistory, fetchCurrentBalance, fetchFunds, fetchReasons, fetchTransactions } from '../services/api';

const useDashboardHandlers = () => {
  const [balanceHistory, setBalanceHistory] = useState<Balance[]>();
  const [monthlyBalances, setMonthlyBalances] = useState<Balance[]>();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [funds, setFunds] = useState<any[]>([]);
  const [reasons, setReasons] = useState<any[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [showChart, setShowChart] = useState(false);

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

  const getBalanceHistory = async () => {
    try {
      const balanceData = await fetchBalanceHistory();
      setBalanceHistory(balanceData);

      // Group by day and keep only the last entry of each day
      const groupedByDay = balanceData.reduce(
        (acc: Record<string, Balance>, entry) => {
          const date = new Date(entry.updatedAt); // Convert to Date object
          const dateKey = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD format

          // Only keep the entry if it's the latest for the day
          if (
            !acc[dateKey] ||
            new Date(entry.updatedAt) > new Date(acc[dateKey].updatedAt)
          ) {
            acc[dateKey] = entry;
          }

          return acc;
        },
        {}
      );

      // Convert grouped object to an array
      const result = Object.values(groupedByDay).sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
      setMonthlyBalances(result);
    } catch (error) {
      console.error('Error fetching balance history:', error);
    }
  };

  return {
    balanceHistory,
    monthlyBalances,
    getBalanceHistory,
    transactions,
    funds,
    reasons,
    balance,
    showChart,
    setTransactions,
    setFunds,
    setReasons,
    setBalance,
    setShowChart,
  };
};

export default useDashboardHandlers;
