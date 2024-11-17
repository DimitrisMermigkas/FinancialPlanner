import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard/Dashboard';
import { customRender } from '@my-workspace/react-components';
describe('App', () => {
  it('should render successfully', async () => {
    const routes = [{ path: '/dashboard', element: <DashboardPage /> }];
    const router = createMemoryRouter(routes, {
      initialEntries: ['/dashboard'],
    });
    customRender(<RouterProvider router={router} />);
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /current balance/i })
      ).toBeInTheDocument()
    );
    expect(screen.getByText(/current balance/i)).toBeInTheDocument();
    expect(screen.getByText(/transactions/i)).toBeInTheDocument();
  });
});
