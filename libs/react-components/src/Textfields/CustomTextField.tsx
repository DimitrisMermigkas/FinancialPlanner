import React from 'react';
import { styled, TextField, TextFieldProps } from '@mui/material';

// Define an interface for styles props
interface StylesProps {
  fieldsetStyles?: React.CSSProperties; // Props for fieldset styles
}

export interface CustomTextFieldProps
  extends Omit<TextFieldProps, 'slotProps'>,
    StylesProps {
  labelStyles?: React.CSSProperties; // Allow passing styles specifically to the label
  inputStyles?: React.CSSProperties; // Allow passing styles specifically to the input
  fieldsetStyles?: React.CSSProperties; // Allow passing styles specifically to the fieldset
  slotProps?: TextFieldProps['slotProps'] & {
    htmlInput?: { style?: React.CSSProperties };
    label?: { style?: React.CSSProperties };
    inputLabel?: { style?: React.CSSProperties };
  };
}

// Create a styled TextField
const StyledTextField = styled((props: CustomTextFieldProps & StylesProps) => {
  const { fieldsetStyles, inputStyles, labelStyles, slotProps, ...rest } =
    props;
  return (
    <TextField
      {...rest}
      slotProps={{
        htmlInput: {
          ...slotProps?.htmlInput,
          style: {
            ...slotProps?.htmlInput?.style, // Merge existing input styles
            ...inputStyles, // Apply custom styles to input
          },
        },
        inputLabel: {
          ...slotProps?.inputLabel,
          sx: {
            ...slotProps?.inputLabel?.style, // Merge existing label styles
            ...labelStyles, // Apply custom styles to label
          },
        },
      }}
    />
  );
})(({ fieldsetStyles }) => ({
  // Applying styles directly based on variant
  '& .MuiOutlinedInput-notchedOutline': {
    ...fieldsetStyles,
  },
}));

/**
 * CustomTextField is a styled wrapper around MUI's TextField component,
 * allowing customization of input, label, and fieldset styles via props.
 *
 * @param {string} [variant] - The variant of the TextField, e.g., "outlined", "filled", or "standard".
 * @param {React.CSSProperties} [labelStyles] - Optional. Styles specifically for the label element.
 * @param {React.CSSProperties} [inputStyles] - Optional. Styles specifically for the input element.
 * @param {React.CSSProperties} [fieldsetStyles] - Optional. Styles specifically for the fieldset element.
 * @param {any} [slotProps] - Optional. Additional props to customize inner components, such as htmlInput and inputLabel.
 * @param {TextFieldProps} [props] - Additional props to be passed to the underlying TextField component, excluding 'slotProps'.
 */

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  labelStyles = {},
  inputStyles = {},
  fieldsetStyles = {},
  variant,
  slotProps = {},
  ...props
}) => {
  return (
    <StyledTextField
      variant={variant}
      labelStyles={labelStyles}
      inputStyles={inputStyles}
      fieldsetStyles={fieldsetStyles}
      slotProps={slotProps}
      {...props} // Spread other props like label, variant, value, etc.
    />
  );
};

export default CustomTextField;
