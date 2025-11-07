import { useState } from 'react';
import { format, parse } from 'date-fns';
import {
  History,
  Funds,
  Transaction,
  Subscription,
} from '@my-workspace/common';

interface MonthlyData {
  date: string;
  amount: number;
}
interface FutureBalanceProps {
  funds: Funds[];
  monthlyBalances: History[];
  futureTransactions: Transaction[];
  subscriptions?: Subscription[];
}
const useFutureBalanceHandlers = ({
  funds,
  monthlyBalances,
  futureTransactions,
  subscriptions = [],
}: FutureBalanceProps) => {
  const [monthsAhead, setMonthsAhead] = useState(1); // Default months ahead to forecast
  const [myIncome, setMyIncome] = useState<number>(1450);

  // Function to get the latest entry for each month
  const getMonthlyBalanceData = (data: History[]) => {
    const currentDate = new Date();
    const currentMMMYY = format(currentDate, 'MMM yy');

    const latestEntriesByMonth = Object.entries(
      data.reduce((acc: { [key: string]: History }, entry: History) => {
        // Ensure that createdAt is defined before processing
        if (!entry.createdAt) return acc;

        const date = new Date(entry.createdAt);
        const monthKey = `${date.toLocaleString('default', {
          month: 'short',
        })} ${date.getFullYear().toString().slice(-2)}`; // e.g., "Oct 24"

        // Skip entries from current month if before 28th
        if (monthKey === currentMMMYY && date.getDate() < 28) {
          return acc;
        }

        // If no entry for the month or if this entry is more recent, update the record for the month
        if (
          !acc[monthKey] ||
          (acc[monthKey].createdAt &&
            new Date(entry.createdAt) > new Date(acc[monthKey].createdAt))
        ) {
          acc[monthKey] = entry;
        }

        return acc;
      }, {})
    );

    // Convert the latestEntriesByMonth object to an array of { month, amount } objects
    return latestEntriesByMonth.map(([date, entry]) => ({
      date,
      amount: entry.amount,
    }));
  };

  const calculateMonthlyFunds = (funds: Funds[]) => {
    const monthlyTotals: Record<string, number> = {};

    funds.forEach((fund) => {
      // Check if updatedAt is defined
      if (fund.updatedAt) {
        // Parse the updatedAt date to extract the month and year
        const date = new Date(fund.updatedAt);
        const monthKey = `${date.toLocaleString('default', {
          month: 'short',
        })} ${date.getFullYear().toString().slice(-2)}`; // e.g., "Oct 24"

        // Initialize the month's total if it doesn't exist
        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = 0;
        }

        // Add the fund amount to the month's total
        monthlyTotals[monthKey] += fund.amount;
      }
    });

    // Convert the totals into an array of objects
    return Object.entries(monthlyTotals).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  const calculateMonthlyFutureTransactions = (
    futureTransactions: Transaction[]
  ) => {
    const monthlyTotals: Record<string, number> = {};

    futureTransactions.forEach((future) => {
      // Check if completedAt is defined
      if (future.completedAt) {
        // Parse the completedAt date to extract the month and year
        const date = new Date(future.completedAt);
        const monthKey = `${date.toLocaleString('default', {
          month: 'short',
        })} ${date.getFullYear().toString().slice(-2)}`; // e.g., "Oct 24"

        // Initialize the month's total if it doesn't exist
        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = 0;
        }

        // Add the future transaction amount to the month's total
        monthlyTotals[monthKey] +=
          future.type === 'expense' ? -future.amount : future.amount;
      }
    });

    // Convert the totals into an array of objects
    return Object.entries(monthlyTotals).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  // Function to merge two arrays and sum amounts for matching months
  const addFundsToMonthlyBalance = (
    balance: MonthlyData[],
    funds?: MonthlyData[]
  ): MonthlyData[] => {
    const mergedData = [...balance];

    if (funds) {
      funds.forEach((fundItem) => {
        // Parse the fund date
        const fundDate = parse(fundItem.date, 'MMM yy', new Date());

        // Find the index where this fund should be applied
        const index = mergedData.findIndex((balanceItem) => {
          const balanceDate = parse(balanceItem.date, 'MMM yy', new Date());
          return balanceDate >= fundDate;
        });

        // If we found a valid index, apply the fund amount to all subsequent months
        if (index !== -1) {
          for (let i = index; i < mergedData.length; i++) {
            mergedData[i].amount += fundItem.amount;
          }
        }
      });
    }

    return mergedData;
  };

  // Add this new function to calculate subscription payments
  const calculateMonthlySubscriptions = (subscriptions: Subscription[]) => {
    const monthlyTotals: Record<string, number> = {};
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + monthsAhead + 1);

    subscriptions.forEach((sub) => {
      if (!sub.active) return; // Skip inactive subscriptions

      const currentDate = new Date(sub.startDate);

      // Move to the next occurrence if the start date is in the past
      while (currentDate < today) {
        switch (sub.frequency) {
          case 'MONTHLY':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'WEEKLY':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'YEARLY':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }

      // Add future occurrences until the forecast end date
      while (currentDate <= endDate) {
        const monthKey = format(currentDate, 'MMM yy');

        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = 0;
        }

        // Add the subscription amount (negative for expenses)
        monthlyTotals[monthKey] +=
          sub.type === 'expense' ? -sub.amount : sub.amount;

        // Move to next occurrence
        switch (sub.frequency) {
          case 'MONTHLY':
            currentDate.setMonth(currentDate.getMonth() + 1);
            break;
          case 'WEEKLY':
            currentDate.setDate(currentDate.getDate() + 7);
            break;
          case 'YEARLY':
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            break;
        }
      }
    });

    return Object.entries(monthlyTotals).map(([date, amount]) => ({
      date,
      amount,
    }));
  };

  // Function to forecast the next few months
  const forecastMonthlyData = (
    currentData: MonthlyData[],
    futureTransactions: MonthlyData[],
    income: number,
    monthsAhead: number,
    subscriptionData: MonthlyData[]
  ): MonthlyData[] => {
    const forecastData = [...currentData];

    // add the future Transactions to update the forecastData
    if (futureTransactions) {
      futureTransactions.forEach((item) => {
        const index = forecastData.findIndex(
          (dataItem) => dataItem.date === item.date
        );

        // If the date exists in forecastData
        if (index !== -1) {
          forecastData[index].amount += item.amount;
        } else {
          // If the date doesn't exist, add a new entry
          forecastData.push(item);
        }
      });
    }

    // Calculate the average expense between past months
    const monthlyDifferences = [];

    const currentDate = format(new Date(), 'MMM yy');

    for (let i = 1; i < currentData.length; i++) {
      // const previousDateObj = new Date(
      //   currentData[i - 1].date + ' 20' + currentData[i - 1].date.split(' ')[1]
      // );
      const currentEntry = currentData[i];
      const currentEntryDate = new Date(
        currentEntry.date + ' 20' + currentEntry.date.split(' ')[1]
      );

      // Format the current entry's month and year to match the current date format
      const currentEntryMonthYear = format(currentEntryDate, 'MMM yy');

      // Check if this is the current month and the day is less than 29; if so, skip it
      if (
        currentEntryMonthYear === currentDate &&
        currentEntryDate.getDate() < 29
      ) {
        continue;
      }

      // Calculate the difference and add to monthlyDifferences
      const difference = Math.abs(
        currentData[i - 1].amount - currentEntry.amount
      );
      monthlyDifferences.push(difference);
    }

    const averageExpense =
      monthlyDifferences.reduce(
        (sum, difference) => sum + (myIncome - difference),
        0
      ) / (monthlyDifferences.length || 1); // Handle division by zero if no expenses
    // Get the last known month and amount

    const lastDate = parse(
      currentData[currentData.length - 1].date,
      'MMM yy',
      new Date()
    );
    const currentMMMYY = format(new Date(), 'MMM yy');

    let lastAmount = currentData[currentData.length - 1].amount;
    if (!lastAmount) {
      lastAmount = forecastData[forecastData.length - 1]?.amount;
    }

    // Iterate to add future months
    for (let i = 0; i <= monthsAhead; i++) {
      // Increment the month
      lastDate.setMonth(lastDate.getMonth() + 1);
      const monthString = lastDate.toLocaleString('default', {
        month: 'short',
      });
      const yearString = lastDate.getFullYear().toString().slice(-2);
      const monthKey = `${monthString} ${yearString}`;

      // Get subscription amount for this month (negative for expenses, positive for income)
      const subscriptionForMonth = subscriptionData.find(
        (sub) => sub.date === monthKey
      );
      const subscriptionAmount = subscriptionForMonth
        ? subscriptionForMonth.amount
        : 0;

      // Calculate the new amount: income - averageExpense - subscription expenses
      // subscriptionAmount is already negative for expenses, so we add it directly
      lastAmount += income - averageExpense + subscriptionAmount;

      const newMonth = {
        date: monthKey,
        amount: parseFloat(lastAmount.toFixed(2)),
      };

      // Find the index of the existing object with the same date
      const index = forecastData.findIndex(
        (item) => item.date === newMonth.date
      );

      // If the date exists, update the amount
      if (index !== -1) {
        forecastData[index].amount += newMonth.amount; // Sum the amounts

        //update the lastAmount after adding or removing amount due to future expense
        lastAmount = forecastData[index].amount;
      } else {
        // If the date does not exist, you can choose to push it to the array
        forecastData.push(newMonth);
      }
    }

    // Find the index of the current date in forecastData
    const startIndex = forecastData.findIndex(
      (data) => data.date === currentMMMYY
    );

    // Calculate the ending index based on monthsAhead
    const endIndex = startIndex + monthsAhead + 1; // +1 to include the current month

    // Slice forecastData up to the calculated endIndex
    const adjustedForecastData = forecastData.slice(0, endIndex);
    return adjustedForecastData;
  };

  const monthlyData = getMonthlyBalanceData(monthlyBalances);
  const monthlyFunds = calculateMonthlyFunds(funds);
  const monthlyFutureTransactions =
    calculateMonthlyFutureTransactions(futureTransactions);
  const subscriptionData = calculateMonthlySubscriptions(subscriptions);

  // Pre-compute the fullMonthlyBalance outside of the useEffect dependency
  const fullMonthlyBalance = addFundsToMonthlyBalance(
    monthlyData,
    monthlyFunds
  );

  // Set the projected data only when necessary dependencies change
  // Subscriptions are now included in the forecast calculation
  const updatedProjectedData = forecastMonthlyData(
    fullMonthlyBalance,
    monthlyFutureTransactions,
    myIncome,
    monthsAhead,
    subscriptionData
  );

  // Split projectedData based on the current date "Nov 24"
  const currentDate = format(new Date(), 'MMM yy'); // Define the current date
  const splitIndex = updatedProjectedData.findIndex(
    (data) => data.date === currentDate
  );

  // Map over the projectedData to create a new array with curBalance and projBalance
  const chartData = updatedProjectedData.map((data, index) => ({
    date: data.date,
    curBalance: index <= splitIndex ? data.amount : null, // curBalance is the amount if index is less than or equal to splitIndex
    projBalance: index >= splitIndex ? data.amount : null, // projBalance is the amount if index is greater than splitIndex
  }));

  // updatedProjectedData now contains both curBalance and projBalance keys

  return {
    chartData,
    monthsAhead,
    setMonthsAhead,
  };
};

export default useFutureBalanceHandlers;
