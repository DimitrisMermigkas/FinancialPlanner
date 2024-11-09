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
} from '../../services/api';
import { formatTimestamp } from '../../utils/formatDate';
import { v4 as uuidv4 } from 'uuid';
import DialogWithForm from '../Forms/DialogForm';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CardComponent from '../CardComponent/CardComponent';

interface PlannedTransactionsProps {
  transactions: Transaction[];
  futureTransactions: Transaction[];
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const PlannedTransactions: React.FC<PlannedTransactionsProps> = ({
  transactions,
  futureTransactions,
  setBalance,
  setTransactions,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

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
      await addTransaction(plannedTransaction);
      const updatedTransactions = await fetchTransactions();
      setTransactions(updatedTransactions); // Update the transactions state
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
      <CardComponent
        title="Planned Transactions"
        buttonText="Plan a Transaction"
        onClick={() => setOpenDialog(true)}
      >
        <List>
          {futureTransactions.map((transaction) => (
            <ListItem key={transaction.id}>
              <ListItemText
                style={{ marginBottom: 0, marginTop: 0 }}
                primary={transaction.description}
                secondary={formatTimestamp(
                  new Date(transaction.completedAt).toISOString()
                )}
              />
              <Box
                sx={{
                  color: transaction.type === 'expense' ? '#910707' : '#087d00',
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
      </CardComponent>
      <DialogWithForm
        open={openDialog}
        hasOptions={true}
        onClose={planTransaction}
      />
    </>
  );
};

export default PlannedTransactions;
