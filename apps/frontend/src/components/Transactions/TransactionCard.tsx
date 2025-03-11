import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Box,
  useTheme,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  Typography,
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { formatTimestamp } from '../../utils/formatDate';
import { DatePicker } from '@mui/x-date-pickers';
import CardComponent from '../common/CardComponent';
import {
  PaymentMethod,
  Transaction,
  TransactionType,
} from '@my-workspace/common';
import {
  useCurrentBalance,
  useHistory,
  useSubscriptions,
  useTransactions,
} from '../../api/apiHooks';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format, addMonths } from 'date-fns';

interface TransactionCardProps {
  calculateMonthlyExpenses: (transactions: Transaction[]) => number;
}

type ViewMode = 'transactions' | 'planned';

const TransactionsCard: React.FC<TransactionCardProps> = ({
  calculateMonthlyExpenses,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>(
    {
      amount: 0,
      type: 'expense' as TransactionType, // Default type
      description: '',
      completedAt: new Date(),
      paymentMethod: PaymentMethod.CARD,
    }
  );
  const { data: transactions, create: createTransaction } = useTransactions();
  const { create: createHistory, refetch: refetchHistory } = useHistory();
  const { refetch: refetchBalance } = useCurrentBalance();
  const { data: subscriptions } = useSubscriptions();
  const today = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>('transactions');

  const cardExpenses = calculateMonthlyExpenses(transactions);
  console.log('🚀 ~ cardExpenses:', cardExpenses);
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
      const addedTransaction = await createTransaction.mutateAsync(
        newTransaction
      );
      console.log('Transaction added:', addedTransaction);

      // Update the balance based on the transaction type
      await createHistory.mutateAsync({
        type: newTransaction.type,
        amount: newTransaction.amount,
        completedAt: newTransaction.completedAt,
      });
      await refetchHistory();
      await refetchBalance();
      handleClose(); // Close the dialog
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setViewMode(event.target.checked ? 'planned' : 'transactions');
  };

  const handleEdit = (id: string) => {
    console.log('Edit clicked for:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete clicked for:', id);
  };

  // Define columns for DataGrid
  const columns: GridColDef[] = [
    {
      field: 'completedAt',
      headerName: 'Date',
      width: 150,
      valueFormatter: (value: string) =>
        formatTimestamp(new Date(value).toISOString()),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 105,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 125,
      renderCell: (params: GridRenderCellParams) => {
        const color =
          params.row.type === 'expense'
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
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(params.row.id)}
            size="small"
            sx={{ color: 'primary.main' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            size="small"
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const switchButton = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography>Transactions</Typography>
      <Switch
        checked={viewMode === 'planned'}
        onChange={handleViewChange}
        color="primary"
      />
      <Typography>Planned</Typography>
    </Box>
  );

  const getNextPaymentDate = (startDate: Date, frequency: string) => {
    const today = new Date();
    const start = new Date(startDate);
    
    switch (frequency) {
      case 'MONTHLY':
        while (start <= today) {
          start.setMonth(start.getMonth() + 1);
        }
        return start;
      case 'WEEKLY':
        while (start <= today) {
          start.setDate(start.getDate() + 7);
        }
        return start;
      case 'YEARLY':
        while (start <= today) {
          start.setFullYear(start.getFullYear() + 1);
        }
        return start;
      default:
        return start;
    }
  };

  const allPlannedTransactions = [
    ...subscriptions
      .filter(sub => sub.active) // Only show active subscriptions
      .map((subscription) => ({
        ...subscription,
        nextPayment: getNextPaymentDate(
          subscription.startDate,
          subscription.frequency
        ),
      })),
    ...transactions.filter(t => new Date(t.completedAt) > today).map((ft) => ({
      ...ft,
      nextPayment: ft.completedAt,
    })),
  ].sort(
    (a, b) =>
      new Date(a.nextPayment).getTime() - new Date(b.nextPayment).getTime()
  );

  const PlannedTransactionCard = ({ item }: { item: any }) => (
    <Paper
      sx={{
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="subtitle1">{item.description}</Typography>
        <Typography variant="body2" color="text.secondary">
          Next payment: {format(new Date(item.nextPayment), 'dd MMM yyyy')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.frequency ? `${item.frequency} via ${item.paymentMethod}` : item.paymentMethod}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography 
          variant="h6" 
          color={item.type === 'expense' ? 'error.main' : 'success.main'}
        >
          €{item.amount.toFixed(2)}
        </Typography>
        <Box>
          <IconButton
            onClick={() => handleEdit(item.id)}
            size="small"
            sx={{ color: 'primary.main' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(item.id)}
            size="small"
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );

  return (
    <CardComponent
      title="Transactions"
      buttonComponent={switchButton}
      cardStyle={{ height: '100%' }}
      cardContentStyle={{ height: '100%' }}
    >
      <Box sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
        {viewMode === 'transactions' ? (
          <DataGrid
            rows={transactions.filter((t) => new Date(t.completedAt) <= today)}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            sx={{
              maxHeight: '550px',
              border: 'none',
              '& .MuiDataGrid-cell': {
                color: 'white',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            }}
          />
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <Typography>Next Up</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflow: 'auto',
                paddingRight: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                },
              }}
            >
              {allPlannedTransactions.map((item, index) => (
                <PlannedTransactionCard key={index} item={item} />
              ))}
            </Box>
          </div>
        )}
      </Box>

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
    </CardComponent>
  );
};

export default TransactionsCard;
