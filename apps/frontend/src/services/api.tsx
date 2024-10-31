import axios from "axios";

const API_URL = "http://localhost:4000"; // Update with your server address if necessary

// Define the types for the expected data structures
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  completedAt: Date; // or string, depending on how the date is formatted
  type: "expense" | "income" | "fund"; // Adjust this type based on your enum or string literals for TransactionType
}

export interface Fund {
  id: string;
  amount: number;
  description?: string; // Optional if it may not always be provided
  createdAt?: string; // or string
  updatedAt?: string; // or string
  reasonId: string;
}

export interface Balance {
  id: string;
  amount: number;
  updatedAt: string;
}

export interface Reason {
  id: string;
  title: string;
  description: string;
}

/* Patch APIs
 ********************************************************************
 */

/* Post APIs
 ********************************************************************
 */
export const addReason = async (reason: Omit<Reason, "id">) => {
  const response = await axios.post(`${API_URL}/reasons`, reason);
  return response.data as Reason; // Return added Reason
};

export const addFunds = async (fund: Omit<Fund, "id">) => {
  const response = await axios.post(`${API_URL}/funds`, fund);
  return response.data; // Return the added transaction data
};

export const addTransaction = async (transaction: {
  amount: number;
  type: "expense" | "income" | "fund";
  description: string;
  completedAt: Date;
}) => {
  const response = await axios.post(`${API_URL}/transaction`, transaction);
  return response.data; // Return the added transaction data
};

export const updateBalance = async (
  type: "expense" | "income" | "fund",
  amount: number
) => {
  try {
    const currentBalance = await fetchCurrentBalance();

    if (!currentBalance) {
      throw new Error("Could not fetch current balance.");
    }

    const newBalance =
      type === "expense"
        ? currentBalance.amount - amount
        : currentBalance.amount + amount;

    const response = await axios.post(`${API_URL}/balance`, {
      amount: newBalance,
    });

    return response.data as Balance; // Return updated balance data
  } catch (error) {
    console.error("Error updating balance:", error);
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
): Promise<Fund[]> => {
  // Use the filters object to add query parameters dynamically
  const response = await axios.get(`${API_URL}/funds`, {
    params: filters,
  });
  return response.data as Fund[];
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

export const fetchFundsForReason = async (id: number) => {};
