// theme.ts
import { createTheme } from '@mui/material/';

declare module '@mui/material/styles' {
  interface Palette {
    orange: Palette['primary'];
    gray: Palette['primary'];
    iceBlue: Palette['primary'];
    background: TypeBackground;
  }
  interface TypeBackground {
    gradient?: string; // Add the gradient property
  }
  interface PaletteOptions {
    orange?: PaletteOptions['primary'];
    gray?: PaletteOptions['primary'];
    iceBlue?: PaletteOptions['primary'];
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
  iceBlue: '#6292B3',
};
const colors2 = {
  whiteDark: '#E9EDF7',
  grayDark: '#A0AEC0',
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
    iceBlue: {
      main: colors.iceBlue,
      light: '#7BA8C7',
      dark: '#4A6B85',
      contrastText: colors.antiflashWhite,
    },

    primary: {
      main: colors.iceBlue, // Changed from orange to ice blue for main actions
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
      primary: colors2.whiteDark,
      secondary: colors2.grayDark,
    },
  },
});

export default theme;
