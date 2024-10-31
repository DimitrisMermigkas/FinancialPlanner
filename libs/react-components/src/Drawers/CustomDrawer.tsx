import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface DrawerHeaderProps {
  anchor: 'left' | 'right' | 'bottom' | 'top' | undefined;
}

const DrawerHeader = styled('div')<DrawerHeaderProps>(({ theme, anchor }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  justifyContent: anchor === 'right' ? 'flex-start' : 'flex-end',
}));

interface CustomDrawer extends DrawerProps {
  children: React.ReactNode;
  paperStyle?: React.CSSProperties;
  drawerWidth?: number;
  onCloseDrawer?: () => void;
}

/**
 * CustomDrawer component provides a flexible, customizable drawer component with options for anchor,
 * width, variant, and close behavior, making it adaptable for various layout needs.
 *
 * @param {React.ReactNode} children - The primary content to display inside the drawer, rendered within the drawer body.
 * @param {boolean} open - Determines if the drawer is currently open. Controls visibility of the drawer content.
 * @param {DrawerProps['variant']} variant - The display variant for the drawer. Options include 'temporary', 'persistent', and 'permanent'.
 * @param {() => void} onCloseDrawer - Optional. Function called when the close button in the drawer header is clicked. Only used for 'persistent' drawers.
 * @param {React.CSSProperties} paperStyle - Optional. Custom styles applied to the drawer's paper component, allowing for customization of background, border, etc.
 * @param {'left' | 'right' | 'top' | 'bottom'} anchor - Specifies the side of the screen where the drawer appears, such as 'left' or 'right'.
 * @param {number} drawerWidth - Optional. The width of the drawer when open, defaulting to 240 pixels. Used to control drawer size dynamically.
 * @param {DrawerProps} props - Additional properties from the MUI Drawer component, allowing further customization.
 */

export const CustomDrawer: React.FC<CustomDrawer> = ({
  children,
  open,
  variant,
  onCloseDrawer,
  paperStyle,
  anchor,
  drawerWidth = 240,
  ...props
}) => {
  const theme = useTheme();
  const openDrawerWidth = drawerWidth;
  const closedDrawerWidth = 0; // Set the width when drawer is closed

  const calcDrawerWidth = () => {
    if (variant == 'permanent') {
      return openDrawerWidth;
    } else {
      return open ? openDrawerWidth : closedDrawerWidth;
    }
  };
  return (
    <Drawer
      sx={{
        width: calcDrawerWidth(),
        flexShrink: 0,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        '& .MuiDrawer-paper': {
          width: calcDrawerWidth(),
          boxSizing: 'border-box',
          ...paperStyle,
        },
      }}
      {...props}
      open={open}
      variant={variant}
      anchor={anchor}
    >
      {variant == 'persistent' && onCloseDrawer && (
        <DrawerHeader anchor={anchor}>
          <IconButton onClick={onCloseDrawer}>
            {anchor === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
      )}
      <Box
        sx={{
          flexGrow: 1,
          paddingInline: theme.spacing(3),
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: 'flex',
        }}
      >
        {children}
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
