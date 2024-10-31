import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { Fund } from "../../services/api"; // Adjust the import path according to your project structure
import { formatTimestamp } from "../../utils/formatDate";

interface FundsLogDialogProps {
  open: boolean;
  onClose: () => void;
  logs: Fund[];
  selectedReason: { title: string; description: string };
  handleWithdraw: (amount: number) => void;
}

const FundsLogDialog: React.FC<FundsLogDialogProps> = ({
  open,
  onClose,
  logs,
  selectedReason,
  handleWithdraw,
}) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);

  const sumOfLogs = logs.reduce((acc, log) => acc + log.amount, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: { width: "500px", minHeight: "40%" } }}
    >
      <DialogTitle>Deposit Logs</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Logs for {selectedReason?.title}</Typography>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>€{log.amount.toFixed(2)}</td>
                <td>{formatTimestamp(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          color="primary"
          onClick={() => {
            handleWithdraw(-withdrawalAmount); // Pass the negative amount to updateFund
            onClose(); // Close the dialog after withdrawal
          }}
        >
          Withdraw
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FundsLogDialog;
