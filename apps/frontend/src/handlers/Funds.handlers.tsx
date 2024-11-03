import { useEffect, useState } from 'react';
import {
  addFunds,
  addReason,
  addTransaction,
  fetchFunds,
  Fund,
  Reason,
  updateBalance,
} from '../services/api';
import { Option } from '@my-workspace/react-components';

interface FundsCardProps {
  funds: Fund[];
  reasons: Reason[];
  setBalance: React.Dispatch<React.SetStateAction<number>>;
}

const useFundsHandlers = ({ funds, reasons, setBalance }: FundsCardProps) => {
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [selectedReason, setSelectedReason] = useState<{
    id?: string;
    title: string;
    description: string;
  }>({ title: '', description: '' });
  const [reasonOptions, setReasonOptions] = useState<Option[]>([]);
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
      const label = reason ? reason.title : 'Unknown'; // Default to "Unknown" if not found

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
    setSelectedReason({ title: '', description: '' });
  };

  const handleUpdateReason = (name: 'description' | 'title', newValue: any) => {
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
    handleUpdateReason('title', newValue);
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
        type: 'fund',
        description: `Funds for ${selectedReason.title}`,
        completedAt: new Date(),
      });
      await updateBalance('expense', fundAmount);
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
      const updatedBalance = await updateBalance('income', -value);
      setBalance(updatedBalance.amount);
      // Close the dialog after withdrawing
      setOpenLogsDialog(false);
    }
  };

  return {
    // State variables
    openInsertDialog,
    openLogsDialog,
    setOpenLogsDialog,
    fundAmount,
    setFundAmount,
    selectedReason,
    reasonOptions,
    logs,
    fundsDataChart,
    // Functions
    handleClickOpenInsert,
    handleCloseInsert,
    handleUpdateReason,
    createNewReason,
    handleAddFund,
    handlePieChartClick,
    handleWithdraw,
  };
};
export default useFundsHandlers;
