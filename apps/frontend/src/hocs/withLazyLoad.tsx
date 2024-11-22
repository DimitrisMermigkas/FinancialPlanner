import React, { ComponentType, lazy, Suspense } from 'react';

interface LazyLoadOptions {
  fallback?: React.ReactNode; // Optional fallback element during loading
}

interface LoadingProps {
  isLoading: boolean;
  error?: Error | null;
}

const DefaultLoading: React.FC<LoadingProps> = ({ isLoading, error }) =>
  error ? (
    <div>Error loading component: {error.message}</div>
  ) : isLoading ? (
    <div>Loading...</div>
  ) : null;
export default function withLazyLoad(
  importCallback: () => Promise<{ default: React.ComponentType<any> }>,
  options?: LazyLoadOptions,
  LoadingComponent: ComponentType<LoadingProps> = DefaultLoading
) {
  const LazyComponent = lazy(importCallback);

  return function LazyWrapper(
    props: React.ComponentProps<typeof LazyComponent>
  ) {
    return (
      <Suspense fallback={options?.fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
