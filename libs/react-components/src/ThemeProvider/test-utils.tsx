// test-utils.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DialogCtxProvider } from '../Dialogs/DialogCtxProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

// Import your custom theme if you have one, or use the default theme
const theme = createTheme();

const AllProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogCtxProvider>{children}</DialogCtxProvider>
    </LocalizationProvider>
  </ThemeProvider>
);

export const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

export default customRender;
