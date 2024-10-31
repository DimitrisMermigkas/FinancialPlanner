import React from 'react';
import { styled, TextField, TextFieldProps } from '@mui/material';

// Define an interface for styles props
interface StylesProps {
  fieldsetStyles?: React.CSSProperties; // Props for fieldset styles
}

interface CustomTextFieldProps
  extends Omit<TextFieldProps, 'slotProps'>,
    StylesProps {
  labelStyles?: React.CSSProperties; // Allow passing styles specifically to the label
  inputStyles?: React.CSSProperties; // Allow passing styles specifically to the input
  fieldsetStyles?: React.CSSProperties; // Allow passing styles specifically to the fieldset
  slotProps?: any;
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
