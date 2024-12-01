import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { apiClient } from '../api/apiClient';

const API_METHODS = {
  GET: <T>(url: string) => apiClient.get<T>(url),
  POST: <T>(url: string, data: unknown) => apiClient.post<T>(url, data),
  PATCH: <T>(url: string, data: unknown) => apiClient.patch<T>(url, data),
  DELETE: (url: string) => apiClient.delete(url),
};

const createApiRequest = <T>(method: ApiMethod) => {
  return async (params: { url: string; data?: unknown }): Promise<T> => {
    const response: AxiosResponse<T> = await API_METHODS[method](
      params.url,
      params.data
    );
    return response.data;
  };
};

type ApiMethod = keyof typeof API_METHODS;
type BaseModel = { create?: object; update?: object; response: { id: string } };
type Response<T extends BaseModel> = T['response'];

export const getAllQueryFn = <T>() => createApiRequest<T[]>('GET');
export const createMutationFn = <T>() => createApiRequest<T>('POST');
export const updateMutationFn = <T>() => createApiRequest<T>('PATCH');
export const deleteMutationFn = <T>() => createApiRequest<T>('DELETE');

export const useDatabase = <T extends BaseModel>(url: string) => {
  // Remove starting '/' from url
  const queryKey = url.slice(1).split('/');
  const queryClient = useQueryClient();

  const get = useQuery<Response<T>[], Error>({
    queryKey,
    queryFn: () => getAllQueryFn<Response<T>>()({ url }),
  });

  const create = useMutation({
    mutationFn: (newData: T['create']) =>
      createMutationFn<Response<T>>()({ url, data: newData }),
    onSuccess: (createdData) => {
      queryClient.setQueryData<Response<T>[]>(queryKey, (oldData = []) => [
        ...oldData,
        createdData,
      ]);
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: T['update'] }) =>
      updateMutationFn<Response<T>>()({ url: `${url}/${id}`, data }),
    onSuccess: (updatedData: Response<T>) => {
      queryClient.setQueryData<Response<T>[]>(queryKey, (oldData = []) =>
        oldData.map((item) => (item.id === updatedData.id ? updatedData : item))
      );
    },
  });

  const del = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      deleteMutationFn<Response<T>>()({ url: `${url}/${id}` }),
    onSuccess: (deletedData) => {
      queryClient.setQueryData<Response<T>[]>(queryKey, (oldData = []) =>
        oldData.filter((item) => item.id !== deletedData.id)
      );
    },
  });

  const { data = [], isLoading, refetch } = get;

  const loading =
    isLoading || create.isPending || update.isPending || del.isPending;

  return {
    data,
    loading,
    refetch,
    get,
    create,
    update,
    del,
  };
};
