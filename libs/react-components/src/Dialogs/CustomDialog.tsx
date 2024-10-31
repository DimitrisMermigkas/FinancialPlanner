import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ModalProps,
  styled,
} from '@mui/material';

export type CustomDialogProps = Omit<
  React.ComponentProps<typeof Dialog>,
  'content'
> & {
  open: boolean;
  contentStyle?: React.CSSProperties;
  contentText?: string;
  actions?: React.ReactNode;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  topFixedContent?: React.ReactNode;
};

// const StyledContent = styled(DialogContent)<{ maxheight: number }>`
//   max-height: ${(props) => props.maxheight + "px"};
//   min-width: ${isMobile ? "inherit" : "auto"};
// `;

const StyledTitle = styled(DialogTitle)`
  text-transform: capitalize;
`;

const TopFixedContent = styled(Box)`
  padding: 8px 24px;
`;

export const CustomDialog: React.FC<CustomDialogProps> = ({
  title,
  open,
  onClose,
  children,
  topFixedContent,
  contentStyle,
  contentText,
  actions,
  disableEscapeKeyDown,
  ...props
}) => {
  const handleClose: ModalProps['onClose'] = (event, reason) => {
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return;
    if (onClose) onClose(event, reason);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...props}
    >
      {title && <StyledTitle>{title}</StyledTitle>}
      {topFixedContent && <TopFixedContent>{topFixedContent}</TopFixedContent>}

      <DialogContent style={{ ...contentStyle }}>
        {contentText && (
          <DialogContentText id="alert-dialog-description">
            {contentText}
          </DialogContentText>
        )}
        {children}
      </DialogContent>

      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};
