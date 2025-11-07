import styled from '@emotion/styled';
import { List, Theme, Typography, useTheme } from '@mui/material';
import { CustomButton, CustomDrawer } from '@my-workspace/react-components';
import { FC, ReactNode } from 'react';
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

const AppMain = styled.main<{ $drawerWidth: number }>`
  background-repeat: no-repeat;
  width: calc(100% - ${(props) => props.$drawerWidth}px);
  height: 100%;
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

export default function AppLayout({ menuItems }: AppLayoutProps) {
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
        />
        <AppMain $drawerWidth={drawerWidth}>
          <Outlet />
        </AppMain>
      </AppFrame>
    </Root>
  );
}
