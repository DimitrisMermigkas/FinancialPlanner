import React from 'react';
import { screen } from '@testing-library/react';
import CustomTextField from './CustomTextField'; // Adjust the import path as necessary
import customRender from '../ThemeProvider/test-utils';

describe('CustomTextField', () => {
  it('renders without crashing', () => {
    customRender(<CustomTextField label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    customRender(<CustomTextField label="Username" />);
    expect(screen.getByLabelText('Username')).toBeTruthy();
  });

  it('applies custom styles correctly', () => {
    const customInputStyle = { backgroundColor: 'lightgrey', color: 'cyan' };
    const customLabelStyle = { color: 'red' };
    const { container } = customRender(
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
