import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';

interface HelloApiResponse {
  message: string;
}

async function getHelloApi(): Promise<HelloApiResponse> {
  const response: AxiosResponse<HelloApiResponse> = await apiClient.get('');
  return response.data;
}

const QUERY_KEY = ['helloApi'];

export const useHelloApi = (): UseQueryResult<HelloApiResponse> => {
  return useQuery<HelloApiResponse>({
    queryKey: QUERY_KEY,
    queryFn: getHelloApi,
  });
};
