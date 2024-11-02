// theme.ts
import { createTheme } from '@mui/material/';

// Define your colors
const colors = {
  jet: '#30323dff',
  davysGray: '#4d5061ff',
  glaucous: '#5c80bcff',
  columbiaBlue: '#c5d2e7ff',
  lightCoral: '#e57678ff',
  lavenderBlush: '#eee5e9ff',
  antiflashWhite: '#f2f4f7ff',
};

// Create the theme
const theme = createTheme({
  palette: {
    primary: {
      main: colors.glaucous,
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.lightCoral,
      contrastText: '#ffffff',
    },
    background: {
      default: colors.antiflashWhite,
      paper: colors.lavenderBlush,
    },
    text: {
      primary: colors.jet,
      secondary: colors.davysGray,
    },
  },
});

export default theme;
