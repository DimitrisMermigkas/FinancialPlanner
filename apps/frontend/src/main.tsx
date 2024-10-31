import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import GlobalStyles from './app/GlobalStyles';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GlobalStyles />
      <App />
    </LocalizationProvider>
  </StrictMode>
);
