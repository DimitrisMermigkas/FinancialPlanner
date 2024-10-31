import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from '@testing-library/react';
import { VirtualizedMultipleSelect } from './VirtualizedMultipleSelect';
import { Avatar } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

describe('VirtualizedMultipleSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders without crashing', () => {
    const handleChange = jest.fn();
    render(
      <VirtualizedMultipleSelect
        options={mockOptions}
        label="Select Options"
        value={[]}
        onChange={handleChange}
      />
    );
    expect(screen.getByLabelText('Select Options')).toBeInTheDocument();
  });

  it('displays the dropdown when clicked', async () => {
    const handleChange = jest.fn();

    render(
      <div data-testid="container">
        <VirtualizedMultipleSelect
          data-testid="autocomplete"
          id="combo-box-demo"
          options={mockOptions}
          label="Select Options"
          value={[]}
          onChange={handleChange}
          ChipProps={{
            deleteIcon: <DoneIcon />,
            avatar: <Avatar>F</Avatar>,
          }}
          textfieldProps={{
            label: 'Select an Option',
            variant: 'outlined',
          }}
        />
      </div>
    );

    const autocomplete = screen.getByTestId('container');

    const input = within(autocomplete).getByRole('combobox');

    autocomplete.click();
    autocomplete.focus();

    fireEvent.change(input, { target: { value: 'Option' } });

    // to be sure, or do `findAllByRole` which is also async
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    // Wait for the dropdown options to appear
    await waitFor(() => {
      const optionsList = screen.getByRole('presentation').querySelector('ul');
      expect(optionsList).toBeInTheDocument(); // Ensure the list exists

      // Check the number of list items
      const listItems = optionsList?.querySelectorAll('li');
      expect(listItems?.length).toBe(3); // Expect exactly 3 items
    });
  });
});
