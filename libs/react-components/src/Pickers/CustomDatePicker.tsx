import React from 'react';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { CustomTextFieldProps } from '../Textfields/CustomTextField';

/**
 * Props for the CustomDatePicker component.
 *
 * Extends the DatePickerProps from MUI with additional customization options.
 */
interface CustomDatePickerProps extends DatePickerProps<Date> {
  /**
   * Optional props for the underlying text field component.
   * This can include styles, placeholder, and other properties specific to the text field.
   */
  textFieldProps?: CustomTextFieldProps;

  /**
   * Styles to be applied to the calendar component.
   * This allows customization of the calendar's appearance.
   */
  calendarSx?: React.CSSProperties;
  daySx?: React.CSSProperties;
}

/**
 * CustomDatePicker is a wrapper around the MUI DatePicker component
 * that allows for additional styling and customization options.
 *
 * @param {CustomDatePickerProps} textFieldProps - Props for the underlying text field component.
 * This can include styles, placeholder, and all other properties passed to CustomTextfield.
 * @param {CustomDatePickerProps} calendarSx - Styles to be applied to the calendar component.
 * @param {CustomDatePickerProps} daySx - Styles to be applied to the day component.
 * @returns {JSX.Element} The rendered CustomDatePicker component.
 */
export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  textFieldProps = {},
  calendarSx = {},
  daySx = {},
  ...props
}) => {
  return (
    <DatePicker
      {...props}
      slotProps={{
        desktopPaper: { sx: calendarSx }, // Apply styles to the calendar
        day: {
          sx: {
            daySx,
          },
        },
        textField: {
          ...textFieldProps,
          sx: {
            ...textFieldProps.sx,
            '& .MuiInputBase-root': {
              ...textFieldProps.inputStyles,
            },
            // '& .MuiInputBase-input': {
            //   ...textFieldProps.inputStyles,
            // },
            '& .MuiOutlinedInput-notchedOutline': {
              ...textFieldProps.fieldsetStyles,
            },
          },
        },
      }}
    />
  );
};
