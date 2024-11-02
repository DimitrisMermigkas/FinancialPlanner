import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
  CustomTextField,
  CustomTextFieldProps,
  Option,
  VirtualizedSelect,
} from '@my-workspace/react-components';

type DialogFormData = {
  textValue: string;
  selectValue: 'income' | 'expense';
  dateValue: Date;
  amountValue: string;
};

type OpenDialogProps = {
  open: boolean;
  hasOptions: boolean;
  onClose: (data: DialogFormData | null) => void;
};

const textFieldProps: CustomTextFieldProps = {
  label: 'Select an Option',
  variant: 'outlined',
};

const DialogWithForm: React.FC<OpenDialogProps> = ({
  open,
  hasOptions,
  onClose,
}) => {
  const [textValue, setTextValue] = useState('');
  const [selectValue, setSelectValue] = useState<'income' | 'expense'>(
    'expense'
  );
  const [amountValue, setAmountValue] = useState('');
  const [dateValue, setDateValue] = useState<Date>(new Date());

  const handleSelectionChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as 'income' | 'expense');
  };

  const handleOk = () => {
    const formData: DialogFormData = {
      textValue,
      selectValue,
      dateValue,
      amountValue,
    };
    if (formData) onClose(formData);
    setDateValue(new Date());
    setTextValue('');
  };

  const handleCancel = () => {
    onClose(null);
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)}>
      <DialogTitle>Form Dialog</DialogTitle>
      <DialogContent
        dividers
        style={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}
      >
        <CustomTextField
          label="Text Input"
          fullWidth
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
        />
        <CustomTextField
          label="Amount"
          fullWidth
          type="number"
          value={amountValue}
          onChange={(e) => setAmountValue(e.target.value)}
        />
        {hasOptions && (
          <Select
            value={selectValue}
            onChange={(e) => handleSelectionChange(e)}
            label="Select Option"
          >
            <MenuItem value="expense">Future Expense</MenuItem>;
            <MenuItem value="income">Future Income</MenuItem>;
          </Select>
        )}
        <DateTimePicker
          label="Date & Time"
          value={dateValue}
          onChange={(newDate) => newDate && setDateValue(newDate)}
          slotProps={{
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!amountValue}
          onClick={handleOk}
          color="primary"
          variant="contained"
        >
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogWithForm;
