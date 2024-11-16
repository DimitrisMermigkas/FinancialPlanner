import {
  Balance,
  CreateTransaction,
  Funds,
  Goals,
  Reason,
  Transaction,
} from '@my-workspace/common';
import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Update with your server address if necessary

/* Delete APIs
 ********************************************************************
 */

export const deleteTransaction = async (transactionId: string) => {
  const response = await axios.delete(
    `${API_URL}/transaction/${transactionId}`
  );
  return response.data as Transaction; // Return deleted Transaction
};
export const deleteGoal = async (goalsId: string) => {
  const response = await axios.delete(`${API_URL}/goals/${goalsId}`);
  return response.data as Goals; // Return deleted Transaction
};

/* Patch APIs
 ********************************************************************
 */

export const updateTransaction = async (
  id: string,
  updatedTransaction: {
    amount?: number;
    type?: 'expense' | 'income' | 'fund';
    description?: string;
    completedAt?: Date;
  }
) => {
  const response = await axios.patch(
    `${API_URL}/transaction/${id}`,
    updatedTransaction
  );
  return response.data as Transaction; // Return updated Transaction
};

/* Post APIs
 ********************************************************************
 */
export const addGoal = async (goal: Omit<Goals, 'id'>) => {
  const response = await axios.post(`${API_URL}/goals`, goal);
  return response.data as Goals; // Return added goal
};
export const addReason = async (reason: Omit<Reason, 'id'>) => {
  const response = await axios.post(`${API_URL}/reasons`, reason);
  return response.data as Reason; // Return added Reason
};

export const addFunds = async (fund: Omit<Funds, 'id'>) => {
  const response = await axios.post(`${API_URL}/funds`, fund);
  return response.data as Funds; // Return the added transaction data
};

export const addTransaction = async (transaction: CreateTransaction) => {
  const response = await axios.post(`${API_URL}/transaction`, transaction);
  return response.data as Transaction; // Return the added transaction data
};

export const updateBalance = async (
  type: 'expense' | 'income' | 'fund',
  amount: number,
  completedAt: Date
) => {
  try {
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

    return response.data as Balance; // Return updated balance data
  } catch (error) {
    console.error('Error updating balance:', error);
    throw error; // Rethrow error for further handling
  }
};

/* Get APIs
 ********************************************************************
 */
// Fetch transactions from the API
export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await axios.get(`${API_URL}/transaction`); // Adjust the endpoint as needed
  return response.data as Transaction[];
};

// Fetch funds from the API with generic filtering options
export const fetchFunds = async (
  filters: Record<string, any> = {}
): Promise<Funds[]> => {
  // Use the filters object to add query parameters dynamically
  const response = await axios.get(`${API_URL}/funds`, {
    params: filters,
  });
  return response.data as Funds[];
};

// Fetch the current balance from the API
export const fetchCurrentBalance = async (): Promise<Balance> => {
  const response = await axios.get(`${API_URL}/balance`); // Adjust the endpoint as needed
  return response.data as Balance;
};
export const fetchBalanceHistory = async (): Promise<Balance[]> => {
  const response = await axios.get(`${API_URL}/balance/all`); // Adjust the endpoint as needed
  return response.data as Balance[];
};
// Fetch the reasons list from the API
export const fetchReasons = async (): Promise<Reason[]> => {
  const response = await axios.get(`${API_URL}/reasons`); // Adjust the endpoint as needed
  return response.data as Reason[];
};
// Fetch the goals list from the API
export const fetchGoals = async (): Promise<Goals[]> => {
  const response = await axios.get(`${API_URL}/goals`); // Adjust the endpoint as needed
  return response.data as Goals[];
};

export const fetchFundsForReason = async (id: number) => {};
