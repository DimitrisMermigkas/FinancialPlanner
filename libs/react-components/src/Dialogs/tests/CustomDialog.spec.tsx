import { Button } from '@mui/material';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomDialog } from '../CustomDialog';
import customRender from '../../ThemeProvider/test-utils';

describe('CustomDialog Component', () => {
  it('should render the dialog title', () => {
    customRender(
      <CustomDialog open={true} title={'Title'} contentText={'Content'} />
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should respect disableEscapeKeyDown prop', async () => {
    const handleClose = jest.fn();
    const event = userEvent.setup();
    customRender(
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
    customRender(
      <CustomDialog open={true} actions={<Button>Button</Button>} />
    );
    fireEvent.click(screen.getByText('Button'));
  });

  it('should render topFixedContent', () => {
    customRender(
      <CustomDialog
        open={true}
        title="Dialog with Top Content"
        topFixedContent={<div>Top Fixed Content</div>}
      />
    );
    expect(screen.getByText('Top Fixed Content')).toBeInTheDocument();
  });

  it('should apply custom content styles', () => {
    customRender(
      <CustomDialog open={true} contentStyle={{ maxHeight: '200px' }} />
    );
    const dialogContent = screen
      .queryByRole('dialog')
      ?.querySelector('.MuiDialogContent-root');
    expect(dialogContent).toHaveStyle('max-height: 200px');
  });
});
