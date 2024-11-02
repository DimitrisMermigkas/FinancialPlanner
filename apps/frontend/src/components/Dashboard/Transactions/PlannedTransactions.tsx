import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import {
  addTransaction,
  fetchTransactions,
  Transaction,
  updateBalance,
  updateTransaction,
} from '../../../services/api';
import { formatTimestamp } from '../../../utils/formatDate';
import { v4 as uuidv4 } from 'uuid';
import DialogWithForm from '../../Forms/DialogForm';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

interface PlannedTransactionsProps {
  transactions: Transaction[];
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const PlannedTransactions: React.FC<PlannedTransactionsProps> = ({
  transactions,
  setBalance,
  setTransactions,
}) => {
  const today = new Date();
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // Filter transactions to include only those with a future date
  const futureTransactions = transactions.filter(
    (transaction) => new Date(transaction.completedAt) > today
  );

  const planTransaction = async (
    formData: {
      textValue: string;
      selectValue: 'income' | 'expense';
      dateValue: Date;
      amountValue: string;
    } | null
  ) => {
    if (formData) {
      const plannedTransaction = {
        amount: parseFloat(formData.amountValue),
        type: formData.selectValue,
        description: formData.textValue,
        completedAt: formData.dateValue,
      };
      addTransaction(plannedTransaction);
    }
    setOpenDialog(false);
  };

  const markAsPaid = async (transactionId: string) => {
    const foundTransation = transactions.find(
      (tran) => tran.id == transactionId
    );
    if (foundTransation) {
      const { id, ...data } = foundTransation;
      const updatedTran = { ...data, completedAt: new Date() };
      const updatedTransaction = await updateTransaction(id, updatedTran);
      // Update the balance based on the transaction type
      const newBalance = await updateBalance(
        updatedTransaction.type,
        updatedTransaction.amount
      );
      setBalance(newBalance.amount);
      // Fetch updated transactions after adding the new one
      const updatedTransactions = await fetchTransactions();
      setTransactions(updatedTransactions); // Update the transactions state
    }
  };

  return (
    <>
      <Card
        sx={{
          width: '22%',
          height: '100%',
          borderRadius: '16px',
          background: '#c5d2e7ff',
          padding: '16px',
        }}
      >
        <CardContent
          style={{ display: 'flex', flexDirection: 'column', rowGap: '16px' }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5" color="#4d5061ff">
              Planned Transactions
            </Typography>
            <Button
              onClick={() => setOpenDialog(true)}
              variant="contained"
              color="primary"
            >
              Plan a transaction
            </Button>
          </div>
          <List>
            {futureTransactions.map((transaction) => (
              <ListItem key={transaction.id}>
                <ListItemText
                  primary={transaction.description}
                  secondary={formatTimestamp(
                    new Date(transaction.completedAt).toISOString()
                  )}
                />
                <Box
                  sx={{
                    color:
                      transaction.type === 'expense' ? '#910707' : '#087d00',
                    fontWeight: 'bold',
                  }}
                >
                  €{transaction.amount.toFixed(2)}
                </Box>
                <IconButton
                  onClick={() => markAsPaid(transaction.id)}
                  sx={{ color: 'inherit', mr: 0.5 }}
                >
                  <TaskAltIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      <DialogWithForm
        open={openDialog}
        hasOptions={true}
        onClose={planTransaction}
      />
    </>
  );
};

export default PlannedTransactions;
