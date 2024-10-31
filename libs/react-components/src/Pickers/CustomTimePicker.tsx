import React from 'react';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers';
import { CustomTextFieldProps } from '../Textfields/CustomTextField';

interface CustomTimePickerProps extends TimePickerProps<Date> {
  clockSx?: React.CSSProperties; // Styles for the clock
  /**
   * Optional props for the underlying text field component.
   * This can include styles, placeholder, and other properties specific to the text field.
   */
  textFieldProps?: CustomTextFieldProps;
}

/**
 * CustomDatePicker is a wrapper around the MUI DatePicker component
 * that allows for additional styling and customization options.
 *
 * @param {CustomDatePickerProps} textFieldProps - Props for the underlying text field component.
 * This can include styles, placeholder, and all other properties passed to CustomTextfield.
 * @param {CustomDatePickerProps} clockSx - Styles to be applied to the clock component.
 * @returns {JSX.Element} The rendered CustomDatePicker component.
 */

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  clockSx = {},
  textFieldProps = {},
  ...props
}) => {
  return (
    <TimePicker
      {...props}
      slotProps={{
        desktopPaper: { sx: clockSx }, // Apply styles to the clock
        textField: {
          ...textFieldProps,
          sx: {
            ...textFieldProps.sx,
            '& .MuiInputBase-input': {
              ...textFieldProps.inputStyles,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              ...textFieldProps.fieldsetStyles,
            },
          },
        },
      }}
    />
  );
};
