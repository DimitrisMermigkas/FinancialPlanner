import styled from '@emotion/styled';
import { List, Theme, Typography, useTheme } from '@mui/material';
import {
  CustomAppBar,
  CustomButton,
  CustomDrawer,
} from '@my-workspace/react-components';
import { FC, ReactNode, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
type DrawerListItemProps = {
  link: string;
  text: string;
  icon: ReactNode;
  theme?: Theme;
};

const Root = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
`;

const AppFrame = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;

const AppMain = styled.main<{ $appBarHeight: number; $drawerWidth: number }>`
  background-repeat: no-repeat;
  width: calc(100% - ${(props) => props.$drawerWidth}px);
  margin-top: ${(props) => props.$appBarHeight}px;
  height: calc(100% - ${(props) => props.$appBarHeight}px);
`;

const DrawerListItem: FC<DrawerListItemProps> = ({
  link,
  text,
  icon,
  theme,
}) => {
  return (
    <NavLink to={link} style={{ display: 'flex', flexDirection: 'column' }}>
      <CustomButton color="primary" variant="outlined">
        {text}
      </CustomButton>
    </NavLink>
  );
};

type AppLayoutProps = {
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
};

const drawerWidth = 240;
const appBarHeight = 64;

export default function AppLayout({ menuItems }: AppLayoutProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  const openSettings = () => {
    navigate('/settings');
  };

  return (
    <Root>
      <AppFrame>
        <CustomDrawer
          menuItems={menuItems}
          variant="permanent"
          anchor="left"
          paperStyle={{
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                alt="profilePic"
                width={130}
                style={{ border: '1px solid #121a2b2f' }}
              />
              <Typography variant="h5">Dimitris Mer</Typography>
              <Typography variant="h6">xFreaKx15</Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <List
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  rowGap: '8px',
                }}
              >
                {menuItems.main.map((item) => (
                  <DrawerListItem
                    key={item.path}
                    link={item.path}
                    text={item.label}
                    icon={item.icon}
                    theme={theme}
                  />
                ))}
              </List>
              <CustomButton variant="contained" onClick={openSettings}>
                Settings
              </CustomButton>
            </div>
          </div>
        </CustomDrawer>
        <AppMain $appBarHeight={appBarHeight} $drawerWidth={drawerWidth}>
          <Outlet />
        </AppMain>
      </AppFrame>
    </Root>
  );
}
