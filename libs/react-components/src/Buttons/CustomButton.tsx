import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  style?: React.CSSProperties;
}

/**
 * CustomButton is a wrapper around the MUI Button component, adding support for custom inline styles and additional props for flexible styling.
 *
 * @param {React.CSSProperties} style - Optional. Inline styles to customize the appearance of the button, allowing adjustments to dimensions, colors, etc.
 * @param {ButtonProps['classes']} classes - Optional. Classes applied to the MUI Button component, enabling customization of the button's styling using MUI's styling system.
 * @param {React.ReactNode} children - The content displayed within the button, typically text or icons.
 * @param {ButtonProps} props - Additional properties from the MUI Button component, supporting standard MUI button configurations (e.g., `variant`, `color`, `onClick`).
 */

export const CustomButton: React.FC<CustomButtonProps> = ({
  classes,
  style,
  children,
  ...props
}) => {
  return (
    <Button classes={classes} style={style} {...props}>
      {children}
    </Button>
  );
};

export default CustomButton;
