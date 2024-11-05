import React, {
  Suspense,
  ComponentType,
  lazy,
  PropsWithRef,
  forwardRef,
} from 'react';

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

export default function withLazyLoad<P extends object>(
  importCallback: () => Promise<{ default: ComponentType<P> }>,
  LoadingComponent: ComponentType<LoadingProps> = DefaultLoading
) {
  const LazyComponent = lazy(importCallback);

  return forwardRef<unknown, PropsWithRef<P>>((props, ref) => (
    <Suspense fallback={<LoadingComponent isLoading={true} error={null} />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
}
