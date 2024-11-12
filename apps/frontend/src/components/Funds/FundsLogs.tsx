import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { formatTimestamp } from '../../utils/formatDate';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Funds, Reason } from '@my-workspace/common';

interface FundsLogsProps {
  logs: Funds[];
  selectedReason: Omit<Reason, 'createdAt' | 'updatedAt'>;
  handleWithdraw: (amount: number) => void;
}

const FundsLogs: React.FC<FundsLogsProps> = ({
  logs,
  selectedReason,
  handleWithdraw,
}) => {
  const theme = useTheme();
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);

  const sumOfLogs = logs.reduce((acc, log) => acc + log.amount, 0);

  const logColumns: GridColDef[] = [
    {
      field: 'completedAt',
      headerName: 'Date',
      width: 140,
      valueGetter: (value, row, column) => {
        return formatTimestamp(row.createdAt);
      },
    },

    {
      field: 'amount',
      headerName: 'Amount',
      width: 125,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              color: theme.palette.text.primary,
              width: '100%',
              height: '100%',
            }}
          >
            €{params.value.toFixed(2)}
          </Box>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 200,
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  return (
    <div>
      <Typography variant="h6">Logs for {selectedReason?.title}</Typography>
      <DataGrid
        rows={logs}
        columns={logColumns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={(row) => row.id} // Set unique ID for each row
      />
      <Typography variant="h6">
        Total Amount: €{sumOfLogs.toFixed(2)}
      </Typography>
      <TextField
        margin="dense"
        label="Withdraw Amount"
        type="number"
        fullWidth
        variant="outlined"
        value={withdrawalAmount}
        onChange={(e) => setWithdrawalAmount(Number(e.target.value))}
      />

      <Button
        color="primary"
        onClick={() => {
          handleWithdraw(-withdrawalAmount); // Pass the negative amount to updateFund
        }}
      >
        Withdraw
      </Button>
    </div>
  );
};

export default FundsLogs;
