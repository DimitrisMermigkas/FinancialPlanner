import AppLayout from './AppLayout';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import withLazyLoad from '../hocs/withLazyLoad';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../api/queryClient';
import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SavingsIcon from '@mui/icons-material/Savings';

// const drawerVariant = 'persistent';
// const drawerAnchor = 'left';
// const appBarHeight = '64px';

export function App() {
  /*                            Loader Handling Area
   *************************************************************************************************
   */
  // const [loading, setLoading] = useState(false);

  /*                            Drawer Handling Area
   *************************************************************************************************
   */
  // const [openDrawer, setOpenDrawer] = useState(true);

  // const handleDrawerOpen = () => {
  //   setOpenDrawer(true);
  // };

  // const handleDrawerClose = () => {
  //   setOpenDrawer(false);
  // };

  const DashboardPage = withLazyLoad(
    () => import('../pages/Dashboard/Dashboard')
  );
  const PlannerPage = withLazyLoad(() => import('../pages/Planner/Planner'));
  const DepositPage = withLazyLoad(() => import('../pages/Deposit/Deposit'));
  const InfoPage = withLazyLoad(() => import('../pages/Info/Info'));
  const SettingsPage = withLazyLoad(() => import('../pages/Settings/Settings'));

  const menuItems = {
    main: [
      {
        icon: <HomeIcon />,
        label: 'Dashboard',
        path: '/dashboard',
      },
      {
        icon: <SavingsIcon />,
        label: 'Savings',
        path: '/deposit',
      },
      {
        icon: <PaymentIcon />,
        label: 'Billing',
        path: '/plan',
      },
      {
        icon: <SettingsIcon />,
        label: 'RTL',
        path: '/rtl',
      },
    ],
    account: [
      {
        icon: <PersonIcon />,
        label: 'Profile',
        path: '/profile',
      },
      {
        icon: <LoginIcon />,
        label: 'Sign In',
        path: '/signin',
      },
      {
        icon: <PersonAddIcon />,
        label: 'Sign Up',
        path: '/signup',
      },
    ],
  };

  const router = createBrowserRouter([
    {
      path: '/',
      // errorElement: <Error />,
      element: <AppLayout menuItems={menuItems} />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: 'dashboard', element: <DashboardPage /> },
        { path: 'plan', element: <PlannerPage /> },
        { path: 'deposit', element: <DepositPage /> },
        { path: 'info', element: <InfoPage /> },
        { path: 'profile', element: <SettingsPage /> },
      ],
    },
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
