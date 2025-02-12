import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase } from '../hooks/useDatabase';
import * as Dto from '@my-workspace/common';
import axios from 'axios';
import { fetchBalanceHistory, fetchCurrentBalance } from '../services/api';
const API_URL = 'http://localhost:4000'; // Update with your server address if necessary

export const useTransactions = () => {
  return useDatabase<{
    create: Dto.CreateTransaction;
    update: object;
    response: Dto.Transaction;
  }>('/transaction');
};

export const useCurrentBalance = () => {
  return useDatabase<{
    update: Dto.UpdateCurrentBalance;
    response: Dto.CurrentBalance;
  }>('/currentbalance');
};

export const useFunds = () => {
  return useDatabase<{
    create: Dto.CreateFunds;
    update: Partial<Dto.CreateFunds>;
    response: Dto.Funds;
  }>('/funds');
};

export const useReasons = () => {
  return useDatabase<{
    create: Dto.CreateReason;
    update: Partial<Dto.CreateReason>;
    response: Dto.Reason;
  }>('/reasons');
};

export const useGoals = () => {
  return useDatabase<{
    create: Dto.CreateGoals;
    update: Partial<Dto.CreateGoals>;
    response: Dto.Goals;
  }>('/goals');
};

export const useHistory = () => {
  const queryClient = useQueryClient();

  // Query for fetching all balances
  const {
    data = [],
    isLoading: isBalancesLoading,
    refetch,
  } = useQuery({
    queryKey: ['history'],
    queryFn: fetchBalanceHistory,
  });

  // Create mutation for handling balance updates
  const create = useMutation({
    mutationFn: async ({
      type,
      amount,
      completedAt,
    }: {
      type: 'expense' | 'income' | 'fund';
      amount: number;
      completedAt: Date;
    }) => {
      const currentBalance = await fetchCurrentBalance();
      const allBalances = await fetchBalanceHistory();

      if (!currentBalance) {
        throw new Error('Could not fetch current balance.');
      }

      const difference = type === 'expense' ? -amount : amount;

      // Find all balances that need to be updated (including completedAt date)
      const balancesToUpdate = allBalances.filter(
        (balance) =>
          balance.createdAt &&
          new Date(balance.createdAt).toISOString().split('T')[0] >=
            new Date(completedAt).toISOString().split('T')[0]
      );

      // Create the new balance entry
      const responseCreate = await axios.post(`${API_URL}/history`, {
        amount: currentBalance.amount + difference,
        createdAt: completedAt,
        updatedAt: new Date(),
      });

      // Update all subsequent balances
      const updatePromises = balancesToUpdate.map((balance) =>
        axios.patch(`${API_URL}/history/${balance.id}`, {
          amount: balance.amount + difference,
          updatedAt: new Date(),
        })
      );

      // Update the current balance
      const responseUpdate = await axios.patch(
        `${API_URL}/currentbalance/${currentBalance.id}`,
        {
          amount: currentBalance.amount + difference,
          updatedAt: new Date(),
        }
      );

      // Wait for all updates to complete
      await Promise.all(updatePromises);

      return responseUpdate.data;
    },
    onSuccess: (newBalance) => {
      // Invalidate history query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['history'] });
      // Update the current balance in cache
      queryClient.setQueryData<{ amount: number }>(
        ['currentbalance'],
        newBalance
      );
    },
  });

  return {
    data,
    isBalancesLoading,
    create,
    refetch,
  };
};
