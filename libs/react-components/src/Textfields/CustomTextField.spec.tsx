import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomTextField from './CustomTextField'; // Adjust the import path as necessary

describe('CustomTextField', () => {
  it('renders without crashing', () => {
    render(<CustomTextField label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    render(<CustomTextField label="Username" />);
    expect(screen.getByLabelText('Username')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customInputStyle = { backgroundColor: 'lightgrey', color: 'cyan' };
    const customLabelStyle = { color: 'red' };
    const { container } = render(
      <CustomTextField
        label="Test"
        value={'george'}
        inputStyles={customInputStyle}
        labelStyles={customLabelStyle}
      />
    );

    const input = container.querySelector('input');
    const label = container.querySelector('label');

    expect(input).toHaveStyle('background-color: lightgrey');
    expect(input).toHaveStyle('color:cyan');
    expect(input).toHaveValue('george');
    expect(label).toHaveStyle('color: red');
  });
});
