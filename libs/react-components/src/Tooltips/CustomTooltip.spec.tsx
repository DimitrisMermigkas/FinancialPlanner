import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { CustomTooltip } from './CustomTooltip';
import { Box, Button, Typography } from '@mui/material';
import customRender from '../ThemeProvider/test-utils';

describe('CustomTooltip', () => {
  it('renders without crashing', () => {
    customRender(
      <CustomTooltip title="Tooltip Text">
        <span>Hover me</span>
      </CustomTooltip>
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('displays the correct tooltip text', async () => {
    customRender(
      <CustomTooltip title="Tooltip Text">
        <span>Hover me</span>
      </CustomTooltip>
    );
    const tooltipTrigger = screen.getByText('Hover me');

    // Hover over the element to trigger the tooltip
    fireEvent.mouseOver(tooltipTrigger);

    expect(await screen.findByText('Tooltip Text')).toBeInTheDocument();
  });

  it('applies custom styles correctly', async () => {
    const customTooltipStyle = { backgroundColor: 'black', color: 'white' };
    const customArrowStyle = { color: 'black' };

    customRender(
      <CustomTooltip
        title="Styled Tooltip"
        tooltipStyles={customTooltipStyle}
        arrowStyles={customArrowStyle}
      >
        <span>Hover me</span>
      </CustomTooltip>
    );

    // Hover to display the tooltip
    fireEvent.mouseOver(screen.getByText('Hover me'));

    const tooltip = await screen.findByText('Styled Tooltip');
    expect(tooltip).toHaveStyle('background-color: black');
    expect(tooltip).toHaveStyle('color: white');
  });

  it('displays complex content in the tooltip', async () => {
    const handleOpenDialog = jest.fn(); // Mock function for dialog open

    customRender(
      <CustomTooltip
        title={
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Tooltip with Action
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              This tooltip contains a button that opens a dialog.
            </Typography>
            <Button variant="outlined" size="small" onClick={handleOpenDialog}>
              Open Dialog
            </Button>
          </Box>
        }
        arrow
        tooltipStyles={{
          backgroundColor: 'rgba(0, 0, 0, 0.87)',
          color: '#ffffff',
          padding: '16px',
          borderRadius: '32px',
          maxWidth: '300px',
        }}
        arrowStyles={{
          color: 'red',
        }}
      >
        <Button variant="contained" color="primary">
          Hover me
        </Button>
      </CustomTooltip>
    );

    // Hover over the button to trigger the tooltip
    fireEvent.mouseOver(screen.getByText('Hover me'));

    // Wait for the tooltip to appear
    await waitFor(() => {
      // Get the tooltip element by role
      const tooltipContainer = screen.getByRole('tooltip');

      // Access the child elements directly
      const tooltip = tooltipContainer.childNodes; // This gives you a NodeList of child elements
      expect(tooltip).toHaveLength(1);
      const MuiBoxRoot = tooltip[0].childNodes[0];
      const MuiBoxRootChildren = MuiBoxRoot.childNodes;
      // Check for the tooltip's title and other children
      expect(MuiBoxRootChildren).toHaveLength(3); // Should have the 3 children (title, description, button)

      // Verify each child's text
      expect(MuiBoxRootChildren[0]).toHaveTextContent('Tooltip with Action');
      expect(MuiBoxRootChildren[1]).toHaveTextContent(
        'This tooltip contains a button that opens a dialog.'
      );
      expect(MuiBoxRootChildren[2]).toHaveTextContent('Open Dialog');

      // Ensure the tooltip has the correct styles applied
      expect(tooltip[0]).toHaveStyle('background-color: rgba(0, 0, 0, 0.87)');
      expect(tooltip[0]).toHaveStyle('border-radius: 32px');

      // Click the button inside the tooltip
      fireEvent.click(screen.getByText('Open Dialog'));
      expect(handleOpenDialog).toHaveBeenCalledTimes(1); // Verify the dialog open function is called
    });
  });

  it('displays the arrow with custom styles', async () => {
    customRender(
      <CustomTooltip
        title="Tooltip with Arrow"
        arrow
        arrowStyles={{
          color: 'red',
        }}
      >
        <Button>Hover me</Button>
      </CustomTooltip>
    );

    // Hover over the button to trigger the tooltip
    fireEvent.mouseOver(screen.getByText('Hover me'));
    // Wait for the tooltip to appear
    await waitFor(() => {
      // Check if the arrow has the correct custom color applied
      const arrow = document.querySelector('.MuiTooltip-arrow');
      expect(arrow).toHaveStyle('color: red');
    });
  });
});
