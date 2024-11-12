// theme.ts
import { createTheme, TypeBackground } from '@mui/material/';

declare module '@mui/material/styles' {
  interface Palette {
    orange: Palette['primary'];
    gray: Palette['primary'];
    background: TypeBackground;
  }
  interface TypeBackground {
    gradient?: string; // Add the gradient property
  }
  interface PaletteOptions {
    orange?: PaletteOptions['primary'];
    gray?: PaletteOptions['primary'];
  }
}

// Define your colors
const colors = {
  jet: '#45474c',
  onyx: '#3B3D42',
  purple: '#37156a',
  pink: '#f00143',
  orange: '#f7992b',
  orangeLight: '#FFAE53',
  antiflashWhite: '#f2f4f7ff',
};

// Create the theme
const theme = createTheme({
  typography: {
    fontFamily: `Oswald, Sans-serif`, // Replace 'YourCustomFont' with your desired font
  },
  palette: {
    orange: {
      main: '#f5b054',
      light: '#fce069',
      dark: '#f68433',
    },
    gray: {
      main: '#45474c',
      dark: '#3B3D42',
      light: '#65676c',
    },

    primary: {
      main: colors.orange,
      contrastText: colors.antiflashWhite,
    },
    secondary: {
      main: colors.pink,
      contrastText: colors.antiflashWhite,
    },
    background: {
      paper: colors.onyx,
      default: colors.jet,
      gradient: `linear-gradient(to bottom, #65676c 0%, ${colors.onyx} 100%)`,
    },
    text: {
      primary: colors.orange,
      secondary: colors.antiflashWhite,
    },
  },
});

export default theme;
