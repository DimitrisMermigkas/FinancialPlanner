import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomButton from './CustomButton'; // Adjust the import path as necessary

describe('CustomButton', () => {
  it('renders without crashing', () => {
    render(<CustomButton>Click Me</CustomButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('displays the correct text', () => {
    render(<CustomButton>Submit</CustomButton>);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'blue', color: 'white' };
    const { container } = render(
      <CustomButton style={customStyle}>Styled Button</CustomButton>
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle(`background-color: blue`);
    expect(button).toHaveStyle(`color: white`);
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<CustomButton onClick={handleClick}>Click Me</CustomButton>);

    // Simulate a click event
    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1); // Check that the click handler was called
  });
});
