import { History } from '@my-workspace/common';

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

  return {
    getMonthlyBalances,
  };
};

export default useDashboardHandlers;
