import React from 'react';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import { BoxProps } from '@mui/material';

// Define a type for custom styles passed into CustomTooltip
interface CustomTooltipProps extends TooltipProps {
  tooltipStyles?: BoxProps['sx'];
  arrowStyles?: BoxProps['sx'];
}

/**
 * CustomTooltip is a styled wrapper around Material-UI's Tooltip component
 * that allows for custom styling of the tooltip and its arrow.
 *
 * @param {React.ReactNode} children - The content to be wrapped by the tooltip.
 * @param {React.ReactNode} title - The text or element to be displayed in the tooltip.
 * @param {boolean} [arrow] - Optional. If true, displays an arrow pointing to the tooltip target.
 * @param {BoxProps['sx']} [tooltipStyles] - Optional. Custom styles to be applied to the tooltip.
 * @param {BoxProps['sx']} [arrowStyles] - Optional. Custom styles to be applied to the tooltip's arrow.
 * @param {TooltipProps} [props] - Additional props to be passed to the underlying Tooltip component.
 */

export const CustomTooltip: React.FC<
  React.PropsWithChildren<CustomTooltipProps>
> = ({
  children,
  tooltipStyles = {},
  arrowStyles = {},
  title,
  arrow = false,
  ...props
}) => {
  return (
    <Tooltip
      title={title}
      arrow={arrow}
      slotProps={{
        tooltip: { sx: { fontSize: '0.875rem', p: 2, ...tooltipStyles } },
        arrow: { sx: arrowStyles },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};
