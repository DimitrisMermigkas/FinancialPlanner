import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface CustomDrawerProps extends DrawerProps {
  children?: React.ReactNode;
  paperStyle?: React.CSSProperties;
  menuItems: {
    main: Array<{
      icon: React.ReactNode;
      label: string;
      path: string;
    }>;
    account: Array<{
      icon: React.ReactNode;
      label: string;
      path: string;
    }>;
  };
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

export const CustomDrawer: React.FC<CustomDrawerProps> = ({
  menuItems,
  variant,
  paperStyle,
  anchor,
  ...props
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const drawerWidth = 240;

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  const MenuItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2),
    borderRadius: 8,
    cursor: 'pointer',
    gap: theme.spacing(2),
    color: '#FFFFFF',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#2A3A4D',
    },
    '& .MuiSvgIcon-root': {
      color: '#6292B3',
    },
  }));

  const SectionTitle = styled(Typography)(({ theme }) => ({
    color: '#FFFFFF',
    padding: theme.spacing(2, 2, 1),
    fontSize: '0.75rem',
    fontWeight: 600,
  }));

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(187deg, #080D1BED 50%, #474F5D 100%)',
          // backgroundSize: '100% 200%',
          backgroundPosition: 'top',
          border: 'none',
          ...paperStyle,
        },
      }}
      {...props}
      variant={variant}
      anchor={anchor}
    >
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#FFFFFF',
            fontWeight: 600,
            mb: 4,
          }}
        >
          FINANCIAL PROJ
        </Typography>

        <Box sx={{ mb: 4 }}>
          {menuItems.main.map((item, index) => (
            <MenuItem key={index} onClick={() => handleMenuClick(item.path)}>
              {item.icon}
              <Typography>{item.label}</Typography>
            </MenuItem>
          ))}
        </Box>

        <SectionTitle>ACCOUNT PAGES</SectionTitle>
        <Box>
          {menuItems.account.map((item, index) => (
            <MenuItem key={index} onClick={() => handleMenuClick(item.path)}>
              {item.icon}
              <Typography>{item.label}</Typography>
            </MenuItem>
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;
