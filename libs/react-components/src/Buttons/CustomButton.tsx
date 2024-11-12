import React from 'react';
import { Button, ButtonProps, Theme } from '@mui/material';
import { styled } from '@mui/styles';

interface CustomButtonProps extends ButtonProps {
  classes?: any; // Adjust as needed for your use case
  style?: React.CSSProperties;
  variant?: 'contained' | 'outlined' | 'text';
}

const StyledButton = styled(Button)(
  ({
    theme,
    variant,
  }: {
    theme: Theme;
    variant: 'contained' | 'outlined' | 'text';
  }) => ({
    transition: 'all 0.6s ease !important',
    ...(variant === 'contained' && {
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
      },
    }),
    ...(variant === 'outlined' && {
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        border: 'none',
      },
    }),
  })
);

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
  variant = 'outlined',
  ...props
}) => {
  return (
    <StyledButton
      classes={classes}
      style={{
        fontWeight: 700,
        fontSize: '16px',
        letterSpacing: 1.2,
        ...style,
      }}
      variant={variant}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default CustomButton;
