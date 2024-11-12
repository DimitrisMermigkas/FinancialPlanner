import { useEffect, useState } from 'react';
import {
  fetchBalanceHistory,
  fetchCurrentBalance,
  fetchFunds,
  fetchGoals,
  fetchReasons,
  fetchTransactions,
} from '../services/api';
import {
  Balance,
  Funds,
  Goals,
  Reason,
  Transaction,
} from '@my-workspace/common';

const useDashboardHandlers = () => {
  const [balanceHistory, setBalanceHistory] = useState<Balance[]>();
  const [monthlyBalances, setMonthlyBalances] = useState<Balance[]>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [funds, setFunds] = useState<Funds[]>([]);
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [goals, setGoals] = useState<Goals[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions();
        const fundsData = await fetchFunds();
        const balanceData = await fetchCurrentBalance();
        const reasonsList = await fetchReasons();
        const goalsList = await fetchGoals();
        setTransactions(transactionsData);
        setFunds(fundsData);
        setBalance(balanceData.amount);
        setReasons(reasonsList);
        setGoals(goalsList);
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
          const date = entry.updatedAt ? new Date(entry.updatedAt) : null; // Check for undefined
          if (!date) return acc; // Skip if `updatedAt` is undefined

          const dateKey = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD format

          // Only keep the entry if it's the latest for the day
          if (
            !acc[dateKey] ||
            (entry.updatedAt &&
              acc[dateKey].updatedAt &&
              new Date(entry.updatedAt) > new Date(acc[dateKey].updatedAt))
          ) {
            acc[dateKey] = entry;
          }

          return acc;
        },
        {}
      );

      // Convert grouped object to an array and sort by updatedAt date
      const result = Object.values(groupedByDay).sort(
        (a, b) =>
          (a.updatedAt ? new Date(a.updatedAt).getTime() : 0) -
          (b.updatedAt ? new Date(b.updatedAt).getTime() : 0)
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
    goals,
    showChart,
    setTransactions,
    setFunds,
    setReasons,
    setBalance,
    setGoals,
    setShowChart,
  };
};

export default useDashboardHandlers;
