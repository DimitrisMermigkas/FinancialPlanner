import { useState } from "react";
import { Balance, fetchBalanceHistory } from "../services/api";

const useDashboardHandlers = () => {
  const [balanceHistory, setBalanceHistory] = useState<Balance[]>();
  const [monthlyBalances, setMonthlyBalances] = useState<Balance[]>();
  const getBalanceHistory = async () => {
    try {
      const balanceData = await fetchBalanceHistory();
      setBalanceHistory(balanceData);

      // Group by day and keep only the last entry of each day
      const groupedByDay = balanceData.reduce(
        (acc: Record<string, Balance>, entry) => {
          const date = new Date(entry.updatedAt); // Convert to Date object
          const dateKey = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD format

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
      console.error("Error fetching balance history:", error);
    }
  };

  return {
    balanceHistory,
    monthlyBalances,
    getBalanceHistory,
  };
};

export default useDashboardHandlers;
