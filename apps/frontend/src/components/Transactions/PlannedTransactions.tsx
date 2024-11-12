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
  deleteTransaction,
  fetchTransactions,
  updateBalance,
  updateTransaction,
} from '../../services/api';
import { formatTimestamp } from '../../utils/formatDate';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CardComponent from '../CardComponent/CardComponent';
import {
  AutocompleteVirtualizedProps,
  CustomDialog,
  DynamicForm,
  FieldConfig,
  useDialogContext,
} from '@my-workspace/react-components';
import {
  Transaction,
  TransactionSchema,
  TransactionType,
} from '@my-workspace/common';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const dialogContext = useDialogContext();

  const fields: FieldConfig<Transaction>[] = [
    {
      name: 'amount',
      label: 'Amount',
      type: 'input',
      componentProps: {
        type: 'number',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'input',
    },
    {
      name: 'type',
      label: 'Transaction Type',
      type: 'select',
      isRequired: true,
      componentProps: {
        options: [
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
        ],
      } as AutocompleteVirtualizedProps<string, false>,
    },
    {
      name: 'completedAt',
      label: 'Scheduled at',
      type: 'date',
    },
  ];

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
        type: formData.selectValue as TransactionType,
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
      const todaysDate = new Date();
      const { id, ...data } = foundTransation;
      const updatedTran = { ...data, completedAt: todaysDate };
      const updatedTransaction = await updateTransaction(id, updatedTran);
      // Update the balance based on the transaction type
      const newBalance = await updateBalance(
        updatedTransaction.type,
        updatedTransaction.amount,
        todaysDate
      );
      setBalance(newBalance.amount);
      // Fetch updated transactions after adding the new one
      const updatedTransactions = await fetchTransactions();
      setTransactions(updatedTransactions); // Update the transactions state
    }
  };

  const onClickDelete = async (e: unknown, transactionId: string) => {
    if (!transactionId) return;
    if (
      await dialogContext.getConfirmation({
        type: 'confirm',
        title: 'Confirm delete',
        message: `Are you sure you want to delete this transaction?`,
      })
    ) {
      deleteTransaction(transactionId);
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
              <IconButton
                onClick={(e) => onClickDelete(e, transaction.id)}
                sx={{ color: 'inherit', mr: 0.5 }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardComponent>
      <CustomDialog
        open={openDialog}
        title="Transaction Form"
        onClose={() => setOpenDialog(false)}
      >
        <DynamicForm
          fields={fields}
          schema={TransactionSchema.omit({ id: true })}
          onSubmit={planTransaction}
        />
      </CustomDialog>
    </>
  );
};

export default PlannedTransactions;
