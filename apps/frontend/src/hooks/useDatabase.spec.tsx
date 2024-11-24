import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { apiClient } from '../api/apiClient';
import { useDatabase } from './useDatabase';

jest.mock('../api/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

type TestEntity = {
  id: string;
  name: string;
};

type TestModel = {
  create: Omit<TestEntity, 'id'>;
  update: Omit<TestEntity, 'id'>;
  response: TestEntity;
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useDatabase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData: TestEntity[] = [{ id: '1', name: 'Test Entity' }];
    mockedApiClient.get.mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useDatabase<TestModel>('/api/test'), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockData);
  });

  it('should create an entity successfully', async () => {
    const newEntity = { ID: '2', Name: 'New Entity' };
    mockedApiClient.get.mockResolvedValueOnce({ data: [] });
    mockedApiClient.post.mockResolvedValueOnce({ data: newEntity });

    const { result } = renderHook(() => useDatabase<TestModel>('/api/test'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      const { mutate } = result.current.create;
      mutate({ name: 'New Entity' });
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Ensure the GET method is called only during the initial data fetch.
    // No additional GET requests should be made after the delete mutation,
    // since the query should not be refetched.
    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);
    expect(mockedApiClient.post).toHaveBeenCalledWith('/api/test', {
      name: 'New Entity',
    });
    expect(result.current.data).toContainEqual(newEntity);
    expect(result.current.loading).toBe(false);
  });

  it('should update an entity successfully', async () => {
    const updatedEntity: TestEntity = { id: '2', name: 'Updated Entity' };
    const unchangedEntity: TestEntity = { id: '1', name: 'Another Entity' };
    const initialData: TestEntity[] = [
      unchangedEntity,
      { id: '2', name: 'Test Entity' },
    ];

    mockedApiClient.get.mockResolvedValueOnce({ data: initialData });
    mockedApiClient.patch.mockResolvedValueOnce({ data: updatedEntity });

    const { result } = renderHook(() => useDatabase<TestModel>('/api/test'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      const { mutate } = result.current.update;
      mutate({ id: '2', data: { name: 'Updated Entity' } });
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);
    expect(mockedApiClient.patch).toHaveBeenCalledWith('/api/test/2', {
      name: 'Updated Entity',
    });
    expect(result.current.data).toContainEqual(unchangedEntity);
    expect(result.current.data).toContainEqual(updatedEntity);
  });

  it('should delete an entity successfully', async () => {
    const deletedEntity: TestEntity = { id: '1', name: 'Deleted Entity' };
    const initialData: TestEntity[] = [
      { id: '1', name: 'Test Entity' },
      { id: '2', name: 'Another Entity' },
    ];
    mockedApiClient.get.mockResolvedValueOnce({ data: initialData });
    mockedApiClient.delete.mockResolvedValueOnce({ data: deletedEntity });

    const { result } = renderHook(() => useDatabase<TestModel>('/api/test'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(true));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      const { mutate } = result.current.del;
      mutate({ id: '1' });
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedApiClient.get).toHaveBeenCalledTimes(1);
    expect(mockedApiClient.delete).toHaveBeenCalledWith('/api/test/1');
    expect(result.current.data).not.toContainEqual(deletedEntity);
    expect(result.current.data?.length).toBe(1);
  });

  it('should not fetch data when enabled is false', async () => {
    const { result } = renderHook(
      () => useDatabase<TestModel>('/api/test', { enabled: false }),
      { wrapper: createWrapper() }
    );

    await waitFor(async () => {
      expect(mockedApiClient.get).not.toHaveBeenCalled();
      expect(result.current.data.length).toBe(0);
    });
  });
});
