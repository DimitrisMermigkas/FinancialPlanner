import { Balance, Funds } from '@my-workspace/common';
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
export const fetchCurrentBalance = async (): Promise<Balance> => {
  const response = await axios.get(`${API_URL}/balance`); // Adjust the endpoint as needed
  return response.data as Balance;
};
export const fetchBalanceHistory = async (): Promise<Balance[]> => {
  const response = await axios.get(`${API_URL}/balance/all`); // Adjust the endpoint as needed
  return response.data as Balance[];
};
