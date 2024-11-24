// test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DialogCtxProvider } from '../Dialogs/DialogCtxProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { QueryClientProvider } from '@tanstack/react-query';
import { DefaultOptions, QueryClient } from '@tanstack/react-query';

// Import your custom theme if you have one, or use the default theme
const theme = createTheme();

const defaultOptionsConfig: DefaultOptions = {
  queries: {
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: defaultOptionsConfig,
});

const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogCtxProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </DialogCtxProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

export const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export default customRender;
