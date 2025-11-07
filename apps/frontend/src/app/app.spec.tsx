import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard/Dashboard';
import { customRender } from '@my-workspace/react-components';

// Global mock for ResizeObserver
global.ResizeObserver = class {
  observe(target: unknown) {
    // Mimic observing an element
    console.log('Observing');
  }
  unobserve(target: unknown) {
    // Mimic unobserving an element
    console.log('Unobserving');
  }
  disconnect() {
    // Mimic disconnecting the observer
    console.log('Disconnecting observer');
  }
};

describe('App', () => {
  it('should render successfully', async () => {
    const routes = [{ path: '/dashboard', element: <DashboardPage /> }];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });
    customRender(<RouterProvider router={router} />);
    expect(screen.getByText(/credit balance/i)).toBeInTheDocument();
    // expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });
});
