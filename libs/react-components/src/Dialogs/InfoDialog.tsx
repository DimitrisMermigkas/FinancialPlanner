import { Button } from '@mui/material';
import { CustomDialog, CustomDialogProps } from './CustomDialog';

type InfoDialogProps = CustomDialogProps & {
  btnTxt?: string;
};

const InfoDialog: React.FC<InfoDialogProps> = ({
  btnTxt = 'OK',
  onClose: handleClose,
  ...props
}) => {
  const actions = [
    <Button key="0" onClick={handleClose}>
      {btnTxt}
    </Button>,
  ];
  return <CustomDialog actions={actions} onClose={handleClose} {...props} />;
};

export default InfoDialog;
