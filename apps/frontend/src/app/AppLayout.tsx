import styled from '@emotion/styled';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import {
  CustomAppBar,
  CustomButton,
  CustomDrawer,
} from '@my-workspace/react-components';
import { FC, ReactNode, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import ataman from '../icons/ataman.png';
type DrawerListItemProps = {
  link: string;
  text: string;
  icon: ReactNode;
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
  background: #b7d7e8;
`;

const AppMain = styled.main<{ $appBarHeight: number; $drawerWidth: number }>`
  background-repeat: no-repeat;
  width: calc(100% - ${(props) => props.$drawerWidth}px);
  margin-top: ${(props) => props.$appBarHeight}px;
  height: calc(100% - ${(props) => props.$appBarHeight}px);
`;

const DrawerListItem: FC<DrawerListItemProps> = ({ link, text, icon }) => {
  return (
    <NavLink to={link}>
      <ListItemButton>
        <ListItemText primary={text} />
        <ListItemIcon>{icon}</ListItemIcon>
      </ListItemButton>
    </NavLink>
  );
};

interface IDrawerItem {
  key: number;
  link: string;
  text: string;
  icon: ReactNode;
}

type AppLayoutProps = {
  drawerItems: IDrawerItem[];
};

const drawerVariant = 'persistent';
const drawerAnchor = 'left';
const appBarHeight = 64;

export default function AppLayout({ drawerItems }: AppLayoutProps) {
  const [openDrawer, setOpenDrawer] = useState(true);

  const drawerWidth = openDrawer ? 240 : 0;

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  const navigate = useNavigate();

  const openSettings = () => {
    navigate('/info');
  };
  return (
    <Root>
      <AppFrame>
        <CustomAppBar
          title="MainPage"
          style={{
            background: 'linear-gradient(to bottom, #87bdd8 15%, #daebe8 100%)',
            height: appBarHeight,
            display: 'flex',
            justifyContent: 'center',
          }}
          drawerDirection={drawerAnchor}
          drawerVariant={drawerVariant}
          onOpenDrawer={handleDrawerOpen}
          open={openDrawer}
        ></CustomAppBar>
        <CustomDrawer
          variant={drawerVariant}
          anchor={drawerAnchor}
          open={openDrawer}
          onCloseDrawer={handleDrawerClose}
          paperStyle={{
            top: appBarHeight,
            background: '#daebe8',
            height: 'calc(100% - 64px)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <img
                src={ataman}
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
              <List>
                {drawerItems.map((item) => (
                  <DrawerListItem
                    key={item.key}
                    link={item.link}
                    text={item.text}
                    icon={item.icon}
                  />
                ))}
              </List>
              <CustomButton variant="outlined" onClick={openSettings}>
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
