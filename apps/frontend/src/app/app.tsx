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
  const SettingsPage = withLazyLoad(() => import('../pages/Settings/Settings'));

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
        { path: 'settings', element: <SettingsPage /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
