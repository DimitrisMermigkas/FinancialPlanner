import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import {
  addTransaction,
  Balance,
  fetchTransactions,
  Transaction,
  updateBalance,
} from '../../services/api';
import { formatTimestamp } from '../../utils/formatDate';
import { DatePicker } from '@mui/x-date-pickers';

interface TransactionsCardProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>; // Add this prop
  setBalance: React.Dispatch<React.SetStateAction<number>>; // Add this prop
}

const TransactionsCard: React.FC<TransactionsCardProps> = ({
  transactions,
  setTransactions,
  setBalance,
}) => {
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>(
    {
      amount: 0,
      type: 'expense', // Default type
      description: '',
      completedAt: new Date(),
    }
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeDate = (value: Date | null) => {
    if (value)
      setNewTransaction((prev) => ({
        ...prev,
        completedAt: value,
      }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Call your API to add the transaction
      const addedTransaction = await addTransaction(newTransaction);
      console.log('Transaction added:', addedTransaction);

      // Update the balance based on the transaction type
      const newBalance = await updateBalance(
        newTransaction.type,
        newTransaction.amount
      );
      setBalance(newBalance.amount);
      // Fetch updated transactions after adding the new one
      const updatedTransactions = await fetchTransactions();
      setTransactions(updatedTransactions); // Update the transactions state
      handleClose(); // Close the dialog
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'completedAt',
      headerName: 'Date',
      width: 200,
      // valueGetter: (params) =>
      //   formatTimestamp(new Date(params.row.completedAt).toISOString()),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        const color =
          params.row.type == 'expense'
            ? '#910707'
            : params.row.type === 'income'
            ? '#087d00'
            : '#c1cb27';

        return (
          <Box
            sx={{
              backgroundColor: color,
              width: '100%',
              height: '100%',
              color: 'white',
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
      width: 250,
    },
  ];
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Card sx={{ width: '48%', height: '100%' }}>
      <CardContent style={{ paddingInline: '16px', paddingBlock: 0 }}>
        <Typography variant="h5">Transactions</Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add Transaction
        </Button>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={transactions}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            getRowId={(row) => row.id} // Set unique ID for each row
          />
        </div>
      </CardContent>

      {/* Dialog for adding a new transaction */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Transaction</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            name="amount"
            fullWidth
            variant="outlined"
            value={newTransaction.amount}
            onChange={handleChange}
          />
          <TextField
            multiline
            select
            label="Type"
            name="type"
            value={newTransaction.type}
            onChange={handleChange}
            fullWidth
            margin="dense"
            variant="outlined"
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            variant="outlined"
            value={newTransaction.description}
            onChange={handleChange}
          />
          <DatePicker
            value={new Date(newTransaction.completedAt)}
            onChange={handleChangeDate}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default TransactionsCard;
