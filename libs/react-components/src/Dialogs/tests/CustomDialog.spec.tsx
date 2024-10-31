import { Button } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomDialog } from '../CustomDialog';

describe('CustomDialog Component', () => {
  it('should render the dialog title', () => {
    render(
      <CustomDialog open={true} title={'Title'} contentText={'Content'} />
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should respect disableEscapeKeyDown prop', async () => {
    const handleClose = jest.fn();
    const event = userEvent.setup();
    render(
      <CustomDialog
        open={true}
        onClose={handleClose}
        disableEscapeKeyDown={true}
      />
    );
    await event.keyboard('{Escape}');
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render additional actions', async () => {
    render(<CustomDialog open={true} actions={<Button>Button</Button>} />);
    fireEvent.click(screen.getByText('Button'));
  });

  it('should render topFixedContent', () => {
    render(
      <CustomDialog
        open={true}
        title="Dialog with Top Content"
        topFixedContent={<div>Top Fixed Content</div>}
      />
    );
    expect(screen.getByText('Top Fixed Content')).toBeInTheDocument();
  });

  it('should apply custom content styles', () => {
    render(<CustomDialog open={true} contentStyle={{ maxHeight: '200px' }} />);
    const dialogContent = screen
      .queryByRole('dialog')
      ?.querySelector('.MuiDialogContent-root');
    expect(dialogContent).toHaveStyle('max-height: 200px');
  });
});
