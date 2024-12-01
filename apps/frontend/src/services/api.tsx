import { CurrentBalance, Funds, History } from '@my-workspace/common';
import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Update with your server address if necessary

/* Get APIs
 ********************************************************************
 */
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
export const fetchCurrentBalance = async (): Promise<CurrentBalance> => {
  const response = await axios.get(`${API_URL}/currentbalance`); // Adjust the endpoint as needed
  if (response.data.length > 0) return response.data[0] as CurrentBalance;
  else return response.data as CurrentBalance;
};
export const fetchBalanceHistory = async (): Promise<History[]> => {
  const response = await axios.get(`${API_URL}/history`); // Adjust the endpoint as needed
  return response.data as History[];
};
