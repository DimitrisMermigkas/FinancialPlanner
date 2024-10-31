import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomList from './CustomList'; // Adjust the import path as necessary
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import DeleteIcon from '@mui/icons-material/Delete';

describe('CustomList', () => {
  const items = [
    { primary: 'Item 1', secondary: 'Secondary text 1' },
    { primary: 'Item 2', icon: <div>Icon 2</div> },
  ];

  it('renders the title', () => {
    render(<CustomList title="Test List" items={items} />);
    expect(screen.getByText('Test List')).toBeTruthy();
  });

  it('renders list items', () => {
    render(<CustomList items={items} />);
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
  });

  it('renders icons when provided', () => {
    render(<CustomList items={items} iconPosition="start" />);
    expect(screen.getByText('Icon 2')).toBeTruthy();
  });

  it('renders the button icon', () => {
    render(
      <CustomList
        items={items}
        buttonIcon={<div data-testid="delete-icon">Delete</div>}
      />
    );
    const deleteButton = screen.getAllByTestId('delete-icon');
    expect(deleteButton).toHaveLength(2);
  });

  it('does not render icons if not provided', () => {
    const noIconItems = [{ primary: 'Item 1' }];
    render(<CustomList items={noIconItems} />);
    expect(screen.queryByText('Icon 2')).toBeNull();
  });
  it('click on 1st delete button and open confirmation dialog', () => {
    const mockOkFunc = jest.fn();
    const mockCancelFunc = jest.fn();
    const defaultProps = {
      open: true,
      title: 'Test Title',
      okBtnTxt: 'OK',
      okFunc: mockOkFunc,
      cancelBtnTxt: 'Cancel',
      cancelFunc: mockCancelFunc,
    };
    render(
      <div id="testRender">
        <CustomList
          items={items}
          iconPosition="start"
          buttonIcon={<DeleteIcon data-testid="delete-icon" />}
        />
        <ConfirmDialog {...defaultProps} />
      </div>
    );
    const container = document.querySelector('#testRender');
    const secondButton = container?.getElementsByTagName('button')[1];
    expect(secondButton).toBeTruthy();
    secondButton?.click();
    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);
    expect(mockOkFunc).toHaveBeenCalledTimes(1);
  });
});
