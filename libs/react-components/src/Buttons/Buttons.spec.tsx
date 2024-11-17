import React from 'react';
// Adjust the import path
import CustomButton from './CustomButton'; // Adjust the import path as necessary
import { fireEvent, screen } from '@testing-library/react';
import { customRender } from '../ThemeProvider/test-utils';
// import theme from 'apps/frontend/src/app/theme';
describe('CustomButton', () => {
  it('renders without crashing', () => {
    customRender(<CustomButton>Click Me</CustomButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('displays the correct text', () => {
    customRender(<CustomButton>Submit</CustomButton>);
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customStyle = { backgroundColor: 'blue', color: 'white' };
    const { container } = customRender(
      <CustomButton style={customStyle}>Styled Button</CustomButton>
    );

    const button = container.querySelector('button');
    expect(button).toHaveStyle(`background-color: blue`);
    expect(button).toHaveStyle(`color: white`);
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    customRender(<CustomButton onClick={handleClick}>Click Me</CustomButton>);

    // Simulate a click event
    fireEvent.click(screen.getByText('Click Me'));

    expect(handleClick).toHaveBeenCalledTimes(1); // Check that the click handler was called
  });
});
