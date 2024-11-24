import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDatabase, createMutationFn } from '../hooks/useDatabase';
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

// export const useBalances = () => {
//   return useDatabase<{
//     create: Dto.CreateBalance;
//     update: object;
//     response: Dto.Balance;
//   }>('/balance');
// };

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

export const useBalances = () => {
  const queryClient = useQueryClient();

  // Query for fetching all balances
  const {
    data = [],
    isLoading: isBalancesLoading,
    refetch,
  } = useQuery({
    queryKey: ['balances'],
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

      const response = await axios.post(`${API_URL}/balance`, {
        amount: newBalance,
        updatedAt: completedAt,
      });

      return response.data;
    },
    onSuccess: (newBalance) => {
      // Update the current balance in cache
      queryClient.setQueryData<{ amount: number }>(['balance'], newBalance);
    },
  });

  return {
    data,
    isBalancesLoading,
    create,
    refetch,
  };
};

// export const useScreens = () => {
//   return useDatabase<{
//     create: Dto.CreateScreenDto;
//     update: Dto.UpdateScreenDto;
//     response: Dto.Screen;
//   }>('/screens');
// };

// export const useStores = () => {
//   return useDatabase<{
//     create: Dto.CreateStoreDto;
//     update: Dto.UpdateStoreDto;
//     response: Dto.Store;
//   }>('/stores');
// };
