import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  DialogCtxProvider,
  DialogTypeKey,
  useDialogContext,
} from '../DialogCtxProvider';
import { FC, ReactNode, useState } from 'react';

const TestComponent = ({ type = 'info' }: { type?: DialogTypeKey }) => {
  const title = `Title ${type}`;

  const { getConfirmation } = useDialogContext();
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const handleClick = async () => {
    const result = await getConfirmation({ type, title });
    setConfirmed(result);
  };
  return (
    <>
      <button onClick={handleClick}>Click</button>
      {confirmed !== null && (
        <span>{confirmed ? 'Confirmed' : 'Cancelled'}</span>
      )}
    </>
  );
};

const TestComponentWithJSX = () => {
  const { getConfirmation } = useDialogContext();

  const handleClick = () => {
    getConfirmation({ type: 'info', title: 'Test', content: <div>JSX</div> });
  };

  return <button onClick={handleClick}>Click</button>;
};

const ProviderWrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <DialogCtxProvider>{children}</DialogCtxProvider>
);

describe('DialogProvider', () => {
  it('should render the children components', () => {
    render(<TestComponent />, { wrapper: ProviderWrapper });
    expect(screen.getByText('Click')).toBeInTheDocument();
  });

  it('should open info dialog when button is clicked', () => {
    render(<TestComponent />, { wrapper: ProviderWrapper });
    const button = screen.getByText('Click');
    fireEvent.click(button);
    expect(screen.getByText('Title info')).toBeInTheDocument();
  });

  it('should open confirm dialog when button is clicked', () => {
    render(<TestComponent type="confirm" />, { wrapper: ProviderWrapper });
    const button = screen.getByText('Click');
    fireEvent.click(button);
    expect(screen.getByText('Title confirm')).toBeInTheDocument();
  });

  it('should resolve promise with true on confirm and close the confirm dialog', async () => {
    render(<TestComponent type="confirm" />, { wrapper: ProviderWrapper });
    const button = screen.getByText('Click');
    fireEvent.click(button);
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should resolve promise with false on cancel and close the confirm dialog', async () => {
    render(<TestComponent type="confirm" />, { wrapper: ProviderWrapper });
    const button = screen.getByText('Click');
    fireEvent.click(button);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.getByText('Cancelled')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should close the info dialog on Close', async () => {
    render(<TestComponent />, { wrapper: ProviderWrapper });
    const button = screen.getByText('Click');
    fireEvent.click(button);
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    );
  });

  it('should render JSX element as content', () => {
    render(<TestComponentWithJSX />, { wrapper: ProviderWrapper });
    const button = screen.getByText('Click');
    fireEvent.click(button);
    expect(screen.getByText('JSX')).toBeInTheDocument();
  });
});
