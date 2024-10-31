import { fireEvent, render, screen } from '@testing-library/react';
import InfoDialog from '../InfoDialog';

describe('InfoDialog Component', () => {
  it('should render with default OK button', () => {
    render(
      <InfoDialog
        open={true}
        title="Test Info Dialog"
        contentText="Test Content"
      />
    );
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    expect(screen.getByText('Test Info Dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('uses custom button text when provided', () => {
    render(<InfoDialog open={true} btnTxt="Got it!" />);
    expect(screen.getByRole('button', { name: 'Got it!' })).toBeInTheDocument();
  });

  it('calls onClose when button is clicked', async () => {
    const handleClose = jest.fn();
    render(<InfoDialog open={true} onClose={handleClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(handleClose).toHaveBeenCalled();
  });
});
