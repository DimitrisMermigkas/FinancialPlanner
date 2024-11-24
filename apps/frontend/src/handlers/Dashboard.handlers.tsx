import { Balance } from '@my-workspace/common';

const useDashboardHandlers = () => {
  const getMonthlyBalances = (balances: Balance[]) => {
    // Group by day and keep only the last entry of each day
    const groupedByDay = balances.reduce(
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

    return result;
  };

  return {
    getMonthlyBalances,
  };
};

export default useDashboardHandlers;
