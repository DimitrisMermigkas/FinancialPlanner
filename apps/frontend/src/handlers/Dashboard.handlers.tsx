import { History, Transaction } from '@my-workspace/common';

const useDashboardHandlers = () => {
  const getMonthlyBalances = (balances: History[]) => {
    // Group by day and keep only the last entry of each day
    const groupedByDay = balances.reduce(
      (acc: Record<string, History>, entry) => {
        const date = entry.createdAt ? new Date(entry.createdAt) : null; // Check for undefined
        if (!date) return acc; // Skip if `createdAt` is undefined

        const dateKey = date.toISOString().split('T')[0]; // Extract YYYY-MM-DD format

        // Only keep the entry if it's the latest for the day
        if (
          !acc[dateKey] ||
          (entry.createdAt &&
            acc[dateKey].createdAt &&
            new Date(entry.createdAt) > new Date(acc[dateKey].createdAt))
        ) {
          acc[dateKey] = entry;
        }

        return acc;
      },
      {}
    );

    // Convert grouped object to an array and sort by createdAt date
    const result = Object.values(groupedByDay).sort(
      (a, b) =>
        (a.createdAt ? new Date(a.createdAt).getTime() : 0) -
        (b.createdAt ? new Date(b.createdAt).getTime() : 0)
    );

    return result;
  };

  const calculateMonthlyExpenses = (transactions: Transaction[]) => {
    // Create a map to store monthly totals
    const monthlyExpenses: any = {};
    const today = new Date();
    const completedTransactions = transactions.filter(
      (transaction) => new Date(transaction.completedAt) <= today
    );
    completedTransactions.forEach((transaction) => {
      if (transaction.amount && transaction.type === 'expense') {
        const date = new Date(transaction.completedAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}`; // Format: YYYY-MM

        // Add the expense amount to the corresponding month
        if (!monthlyExpenses[monthKey]) {
          monthlyExpenses[monthKey] = 0;
        }
        monthlyExpenses[monthKey] += transaction.amount;
      }
    });

    return monthlyExpenses;
  };
  return {
    getMonthlyBalances,
    calculateMonthlyExpenses,
  };
};

export default useDashboardHandlers;
