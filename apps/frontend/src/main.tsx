import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import GlobalStyles from './app/GlobalStyles';
import { ThemeProvider } from '@mui/material';
import theme from './app/theme';
import { DialogCtxProvider } from '@my-workspace/react-components';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DialogCtxProvider>
        <GlobalStyles />
        <App />
      </DialogCtxProvider>
    </LocalizationProvider>
  </ThemeProvider>
);
