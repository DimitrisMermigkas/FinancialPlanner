import axios, { CreateAxiosDefaults } from 'axios';

const axiosConfig: CreateAxiosDefaults = {
  baseURL: 'http://localhost:4000/',
  timeout: 10 * 60 * 1000,
  // eslint-disable-next-line
  headers: { 'Content-Type': 'application/json' },
};

export const apiClient = axios.create(axiosConfig);
