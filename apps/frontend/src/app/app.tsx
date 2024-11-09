import {
  CustomAppBar,
  CustomButton,
  CustomDrawer,
  Loading,
  PageLayout,
} from '@my-workspace/react-components';
import { useState } from 'react';
import { useTheme } from '@mui/material';
import AppLayout from './AppLayout';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import withLazyLoad from '../hocs/withLazyLoad';

const drawerVariant = 'persistent';
const drawerAnchor = 'left';
const appBarHeight = '64px';

export function App() {
  const theme = useTheme();
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

  const DashboardPage = withLazyLoad(
    () => import('../pages/Dashboard/Dashboard')
  );
  const PlannerPage = withLazyLoad(() => import('../pages/Planner/Planner'));
  const DepositPage = withLazyLoad(() => import('../pages/Deposit/Deposit'));
  const InfoPage = withLazyLoad(() => import('../pages/Info/Info'));

  const drawerItems = [
    {
      key: 0,
      text: 'Dashboard',
      link: '/dashboard',
      icon: null,
    },
    {
      key: 1,
      text: 'Yearly Plan',
      link: '/plan',
      icon: null,
    },
    {
      key: 2,
      text: 'Deposit & Funds',
      link: '/deposit',
      icon: null,
    },
    {
      key: 3,
      text: 'Info',
      link: '/info',
      icon: null,
    },
  ];

  const router = createBrowserRouter([
    {
      path: '/',
      // errorElement: <Error />,
      element: <AppLayout drawerItems={drawerItems} />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'plan', element: <PlannerPage /> },
        { path: 'deposit', element: <DepositPage /> },
        { path: 'info', element: <InfoPage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
  // return (
  //   <Loading isLoading={loading}>
  //     <div
  //       style={{
  //         display: 'flex',
  //         flexDirection: drawerAnchor === 'left' ? 'row' : 'row-reverse',
  //         height: '100%',
  //         backgroundColor: '#30323dff',
  //       }}
  //     >
  //       <CustomAppBar
  //         title="MainPage"
  //         style={{
  //           background:
  //             'linear-gradient(180deg, rgba(92,128,188,1) 0%, rgba(77,80,97,1) 100%)',
  //           height: appBarHeight,
  //           display: 'flex',
  //           justifyContent: 'center',
  //         }}
  //         drawerDirection={drawerAnchor}
  //         drawerVariant={drawerVariant}
  //         onOpenDrawer={handleDrawerOpen}
  //         open={openDrawer}
  //       />

  //       {/* <CustomDrawer
  //         variant={drawerVariant}
  //         anchor={drawerAnchor}
  //         open={openDrawer}
  //         onCloseDrawer={handleDrawerClose}
  //         paperStyle={{ top: appBarHeight }}
  //       ></CustomDrawer> */}
  //       <PageLayout
  //         title="Current Balance"
  //         style={{
  //           color: '#f2f4f7ff',
  //           display: 'flex',
  //           flexDirection: 'column',
  //           marginTop: appBarHeight,
  //           height: `calc(100% - ${appBarHeight})`,
  //         }}
  //       >
  //         <Dashboard />
  //       </PageLayout>
  //     </div>
  //   </Loading>
  // );
}

export default App;
