import { Button, Slide, SlideProps, useTheme } from '@mui/material';
import { forwardRef } from 'react';
import { CustomDialog, CustomDialogProps } from './CustomDialog';

const Transition = forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

type ConfirmDialogProps = CustomDialogProps & {
  okFunc?: () => void;
  cancelFunc?: () => void;
  okBtnTxt?: string;
  cancelBtnTxt?: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  okFunc,
  cancelFunc,
  fullWidth = true,
  okBtnTxt = 'Confirm',
  cancelBtnTxt = 'Cancel',
  maxWidth = 'md',
  ...props
}) => {
  const theme = useTheme();

  const actions = (
    <>
      {okFunc && (
        <Button
          autoFocus
          style={{ color: theme.palette.text.primary }}
          onClick={okFunc}
        >
          {okBtnTxt}
        </Button>
      )}
      {cancelFunc && (
        <Button
          style={{ color: theme.palette.text.primary }}
          onClick={cancelFunc}
        >
          {cancelBtnTxt}
        </Button>
      )}
    </>
  );

  return (
    <CustomDialog
      maxWidth={maxWidth}
      TransitionComponent={Transition}
      actions={actions}
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export default ConfirmDialog;
