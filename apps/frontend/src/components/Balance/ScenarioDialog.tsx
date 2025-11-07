import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from '@mui/material';
import { CustomDialog } from '@my-workspace/react-components';
import { useState } from 'react';

interface ScenarioDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (params: ScenarioParams) => void;
}

export interface ScenarioParams {
  expenseChange: number;
  incomeChange: number;
}

export const ScenarioDialog: React.FC<ScenarioDialogProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [params, setParams] = useState<ScenarioParams>({
    expenseChange: 0,
    incomeChange: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      title="Create Scenario"
      actions={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={() => onConfirm(params)} variant="contained">
            Apply Scenario
          </Button>
        </>
      }
    >
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Adjust monthly expenses and income by percentage
        </Typography>
        <TextField
          fullWidth
          label="Monthly Expenses Change %"
          name="expenseChange"
          type="number"
          value={params.expenseChange}
          onChange={handleChange}
          sx={{ mb: 2 }}
          helperText="Positive value increases expenses, negative decreases"
        />
        <TextField
          fullWidth
          label="Monthly Income Change %"
          name="incomeChange"
          type="number"
          value={params.incomeChange}
          onChange={handleChange}
          helperText="Positive value increases income, negative decreases"
        />
      </Box>
    </CustomDialog>
  );
};
