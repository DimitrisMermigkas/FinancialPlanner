import {
  CustomAppBar,
  CustomButton,
  CustomDrawer,
  Loading,
  PageLayout,
} from '@my-workspace/react-components';
import { useState } from 'react';
import Dashboard from '../components/Dashboard/Dashboard';

const drawerVariant = 'persistent';
const drawerAnchor = 'left';
const appBarHeight = '64px';

export function App() {
  /*                            Loader Handling Area
   *************************************************************************************************
   */
  const [loading, setLoading] = useState(false);

  /*                            Drawer Handling Area
   *************************************************************************************************
   */
  const [openDrawer, setOpenDrawer] = useState(true);

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <Loading isLoading={loading}>
      <div
        style={{
          display: 'flex',
          flexDirection: drawerAnchor === 'left' ? 'row' : 'row-reverse',
          height: '100%',
        }}
      >
        <CustomAppBar
          title="MainPage"
          style={{
            backgroundColor: 'alice blue',
            height: appBarHeight,
            display: 'flex',
            justifyContent: 'center',
          }}
          drawerDirection={drawerAnchor}
          drawerVariant={drawerVariant}
          onOpenDrawer={handleDrawerOpen}
          open={openDrawer}
        />

        {/* <CustomDrawer
          variant={drawerVariant}
          anchor={drawerAnchor}
          open={openDrawer}
          onCloseDrawer={handleDrawerClose}
          paperStyle={{ top: appBarHeight }}
        ></CustomDrawer> */}
        <PageLayout
          title="Dashboard"
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: appBarHeight,
            height: `calc(100% - ${appBarHeight})`,
          }}
        >
          <Dashboard />
        </PageLayout>
      </div>
    </Loading>
  );
}

export default App;
