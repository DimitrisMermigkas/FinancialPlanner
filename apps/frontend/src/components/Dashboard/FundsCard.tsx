import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { PieChart, PieSeriesType } from "@mui/x-charts"; // Updated import
import { VirtualizedSelect } from "../Selects/VirtualizedSelect";
import {
  addFunds,
  addReason,
  addTransaction,
  fetchFunds,
  Fund,
  Reason,
  updateBalance,
} from "../../services/api";
import { formatTimestamp } from "../../utils/formatDate";
import FundsLogDialog from "./FundsLogDialog";

interface Option {
  value: string | number;
  label: string;
}

interface FundsCardProps {
  funds: Fund[];
  reasons: Reason[];
  setReasons: React.Dispatch<React.SetStateAction<Reason[]>>;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const FundsCard: React.FC<FundsCardProps> = ({
  funds,
  reasons,
  setReasons,
  setBalance,
}) => {
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [selectedReason, setSelectedReason] = useState<{
    id?: string;
    title: string;
    description: string;
  }>({ title: "", description: "" });
  const [reasonOptions, setReasonOptions] = useState<Option[]>([]);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [logs, setLogs] = useState<Fund[]>([]); // Logs for deposits

  useEffect(() => {
    if (reasons.length > 0) {
      const options = reasons.map((reason) => ({
        value: reason.title,
        label: reason.title,
      }));
      setReasonOptions(options);
    }
  }, [reasons]);

  const groupedFunds = funds.reduce((acc, fund) => {
    const { reasonId, amount } = fund;

    if (!acc[reasonId]) {
      const reason = reasons.find((reason) => reason.id === reasonId);
      const label = reason ? reason.title : "Unknown"; // Default to "Unknown" if not found

      acc[reasonId] = { reasonId, label, totalAmount: 0 };
    }

    acc[reasonId].totalAmount += amount;
    return acc;
  }, {} as Record<string, { reasonId: string; label: string; totalAmount: number }>);

  const groupedFundsArray = Object.values(groupedFunds);
  const fundsDataChart = groupedFundsArray.map((fund) => {
    return { id: fund.reasonId, value: fund.totalAmount, label: fund.label };
  });

  const handleClickOpenInsert = () => {
    setOpenInsertDialog(true);
  };

  const handleCloseInsert = () => {
    setOpenInsertDialog(false);
    setFundAmount(0);
    setSelectedReason({ title: "", description: "" });
  };

  const handleUpdateReason = (name: "description" | "title", newValue: any) => {
    const updatedReason = { ...selectedReason, [name]: newValue };
    setSelectedReason(updatedReason);
  };
  const createNewReason = (newValue: any) => {
    const updatedOptions = [
      ...reasonOptions,
      {
        value: newValue,
        label: newValue,
      },
    ];
    setReasonOptions(updatedOptions);
    handleUpdateReason("title", newValue);
  };
  const handleAddFund = async () => {
    if (selectedReason) {
      const reasonExists = reasons.find(
        (reason) => reason.title == selectedReason.title
      );
      if (reasonExists) {
        addFunds({ amount: fundAmount, reasonId: reasonExists.id });
      } else {
        const newReason = await addReason(selectedReason);
        await addFunds({ amount: fundAmount, reasonId: newReason.id });
      }
      await addTransaction({
        amount: fundAmount,
        type: "fund",
        description: `Funds for ${selectedReason.title}`,
        completedAt: new Date(),
      });
      await updateBalance("expense", fundAmount);
      handleCloseInsert();
    }
  };
  const handlePieChartClick = async (event: any, params: any) => {
    const index = params.dataIndex;
    const reasonPie = reasons[index];
    if (reasonPie) {
      setSelectedReason(reasonPie);
      // Fetch logs for the selected fund (dummy data for example)
      const fetchedFunds = await fetchFunds({ reasonId: reasonPie.id });
      setLogs(fetchedFunds); // Replace with actual logs fetching
    }
    setOpenLogsDialog(true);
  };

  const handleWithdraw = async (value: number) => {
    if (selectedReason && selectedReason.id) {
      // Here you would typically call your API to update the balance and funds
      await addFunds({ amount: value, reasonId: selectedReason.id });
      const updatedBalance = await updateBalance("income", -value);
      setBalance(updatedBalance.amount);
      // Close the dialog after withdrawing
      setOpenLogsDialog(false);
    }
  };

  return (
    <Card sx={{ width: "48%" }}>
      <CardContent>
        <Typography variant="h5">Funds</Typography>
        <PieChart
          colors={["#FF6384", "#36A2EB", "#FFCE56"]}
          series={[
            {
              data: fundsDataChart,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          width={400}
          height={200}
          onItemClick={handlePieChartClick}
        />
        <Typography variant="h6">
          Total Funds: €
          {funds.reduce((acc, fund) => acc + fund.amount, 0).toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpenInsert}
        >
          Insert Funds
        </Button>
      </CardContent>

      {/* Dialog for inserting funds */}
      <Dialog
        open={openInsertDialog}
        onClose={handleCloseInsert}
        PaperProps={{ style: { width: "500px", minHeight: "40%" } }}
      >
        <DialogTitle>Insert Funds</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "70%",
              justifyContent: "center",
              alignContent: "center",
              rowGap: "10px",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              label="Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={fundAmount}
              onChange={(e) => setFundAmount(Number(e.target.value))}
            />
            <VirtualizedSelect
              value={selectedReason}
              options={reasonOptions}
              onChange={(newValue) => handleUpdateReason("title", newValue)}
              onCreate={createNewReason}
              textfieldProps={{
                label: "Select a Reason",
                variant: "outlined",
              }}
            />
            <TextField
              multiline
              rows={2}
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              value={selectedReason?.description}
              onChange={(e) =>
                handleUpdateReason("description", e.target.value)
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInsert}>Cancel</Button>
          <Button color="primary" onClick={handleAddFund}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <FundsLogDialog
        open={openLogsDialog}
        onClose={() => setOpenLogsDialog(false)}
        logs={logs}
        selectedReason={selectedReason}
        handleWithdraw={handleWithdraw}
      />
    </Card>
  );
};

export default FundsCard;
