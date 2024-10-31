import { fireEvent, render, screen } from '@testing-library/react';
import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog Component', () => {
  it('renders confirm and cancel buttons with default text', () => {
    render(
      <ConfirmDialog open={true} okFunc={jest.fn()} cancelFunc={jest.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('uses custom button text when provided', () => {
    render(
      <ConfirmDialog
        open={true}
        okFunc={jest.fn()}
        cancelFunc={jest.fn()}
        okBtnTxt="Yes"
        cancelBtnTxt="No"
      />
    );
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No' })).toBeInTheDocument();
  });

  it('calls okFunc when confirm button is clicked', async () => {
    const handleOk = jest.fn();
    render(<ConfirmDialog open={true} okFunc={handleOk} />);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(handleOk).toHaveBeenCalledTimes(1);
  });

  it('calls cancelFunc when cancel button is clicked', async () => {
    const handleCancel = jest.fn();
    render(<ConfirmDialog open={true} cancelFunc={handleCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });

  it('only renders confirm button when cancelFunc is not provided', () => {
    render(<ConfirmDialog open={true} okFunc={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel' })
    ).not.toBeInTheDocument();
  });

  it('only renders cancel button when okFunc is not provided', () => {
    render(<ConfirmDialog open={true} cancelFunc={jest.fn()} />);
    expect(
      screen.queryByRole('button', { name: 'Confirm' })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });
});
