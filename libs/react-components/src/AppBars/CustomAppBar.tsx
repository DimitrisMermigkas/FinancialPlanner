import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  AppBarProps,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, useTheme } from '@mui/material/styles';

interface CustomAppBarProps extends AppBarProps {
  title: string;
  children?: React.ReactNode;
  open: boolean;
  onOpenDrawer: () => void;
  drawerVariant?: 'persistent' | 'temporary' | 'permanent';
  drawerDirection?: 'left' | 'right';
  flexContainerStyle?: React.CSSProperties;
}

const FlexContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // Title and children are spaced apart
  width: '100%',
});

/**
 * CustomAppBar is a styled app bar component built on top of MUI's AppBar, designed to support dynamic drawer handling and customizable layout.
 *
 * @param {string} title - The main title text displayed within the AppBar.
 * @param {React.ReactNode} children - Optional. Elements displayed on the right side of the AppBar, useful for icons or actions.
 * @param {boolean} open - A boolean indicating if the drawer is currently open; conditionally displays the menu icon.
 * @param {() => void} onOpenDrawer - Function triggered to open the drawer, typically changing the `open` state.
 * @param {'persistent' | 'temporary' | 'permanent'} [drawerVariant='permanent'] - Optional. Specifies the variant of the drawer, defining its behavior alongside the AppBar.
 * @param {'left' | 'right'} [drawerDirection='left'] - Optional. Specifies the position of the drawer icon button, either on the left or right side.
 * @param {React.CSSProperties} [flexContainerStyle] - Optional. Inline styles for the flex container, customizing layout and alignment of the title and children.
 * @param {React.CSSProperties} [style] - Optional. Inline styles for the AppBar component itself.
 */

export const CustomAppBar: React.FC<CustomAppBarProps> = ({
  title,
  children,
  open,
  onOpenDrawer,
  drawerVariant = 'permanent',
  drawerDirection = 'left',
  style,
  flexContainerStyle,
}) => {
  const theme = useTheme();

  return (
    <AppBar position="fixed" style={style}>
      <Toolbar>
        {/* IconButton will be rendered conditionally based on drawerDirection */}
        {drawerDirection === 'left' &&
          drawerVariant === 'persistent' &&
          !open && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onOpenDrawer}
              sx={{
                marginRight: theme.spacing(2),
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

        <FlexContainer style={flexContainerStyle}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
          {/* Children are rendered on the right side of the AppBar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>
        </FlexContainer>

        {/* IconButton moves to the right (after FlexContainer) for right direction */}
        {drawerDirection === 'right' &&
          drawerVariant === 'persistent' &&
          !open && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="open drawer"
              onClick={onOpenDrawer}
              sx={{
                marginLeft: theme.spacing(2),
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;
