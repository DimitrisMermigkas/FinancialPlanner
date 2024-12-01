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

      if (!currentBalance) {
        throw new Error('Could not fetch current balance.');
      }

      const newBalance =
        type === 'expense'
          ? currentBalance.amount - amount
          : currentBalance.amount + amount;

      const response = await axios.patch(
        `${API_URL}/currentbalance/${currentBalance.id}`,
        {
          amount: newBalance,
          updatedAt: completedAt,
        }
      );

      return response.data;
    },
    onSuccess: (newBalance) => {
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
