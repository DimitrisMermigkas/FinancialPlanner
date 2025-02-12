import { useEffect, useState, useMemo } from 'react';
import { fetchFunds } from '../services/api';
import { Option } from '@my-workspace/react-components';
import { Funds, Reason, TransactionType } from '@my-workspace/common';
import {
  useFunds,
  useHistory,
  useReasons,
  useTransactions,
} from '../api/apiHooks';

type ReasonWithoutTimestamps = Omit<Reason, 'createdAt' | 'updatedAt'>;

const useFundsHandlers = () => {
  const [openInsertDialog, setOpenInsertDialog] = useState(false);
  const [openLogsDialog, setOpenLogsDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState<number>(0);
  const [selectedReason, setSelectedReason] = useState<ReasonWithoutTimestamps>(
    { id: '', title: '', description: '' }
  );

  const [reasonOptions, setReasonOptions] = useState<Option[]>([]);
  const [logs, setLogs] = useState<Funds[]>([]); // Logs for deposits

  const { data: funds, create: createFund } = useFunds();
  const { data: reasons, create: createReason } = useReasons();
  const { create: createTransaction } = useTransactions();
  const { create: createHistory } = useHistory();

  const groupedFunds = useMemo(() => {
    return funds.reduce((acc, fund) => {
      const { reasonId, amount } = fund;

      if (!acc[reasonId]) {
        const reason = reasons.find((reason) => reason.id === reasonId);
        const label = reason ? reason.title : 'Unknown';

        acc[reasonId] = { reasonId, label, totalAmount: 0 };
      }

      acc[reasonId].totalAmount += amount;
      return acc;
    }, {} as Record<string, { reasonId: string; label: string; totalAmount: number }>);
  }, [funds, reasons]);

  const groupedFundsArray = useMemo(
    () => Object.values(groupedFunds),
    [groupedFunds]
  );
  const fundsDataChart = useMemo(
    () =>
      groupedFundsArray.map((fund) => {
        if (fund.totalAmount > 0) {
          return {
            id: fund.reasonId,
            value: fund.totalAmount,
            label: fund.label,
          };
        }
      }),
    [groupedFundsArray]
  );

  useEffect(() => {
    if (reasons.length > 0) {
      const options = reasons.map((reason) => ({
        value: reason.title,
        label: reason.title,
      }));
      setReasonOptions(options);
    }
  }, [reasons]);

  const handleClickOpenInsert = () => {
    setOpenInsertDialog(true);
  };

  const handleCloseInsert = () => {
    setOpenInsertDialog(false);
    setFundAmount(0);
    setSelectedReason({ id: '', title: '', description: '' });
  };

  const handleUpdateReason = (
    name: 'description' | 'title',
    newValue: unknown
  ) => {
    const updatedReason = { ...selectedReason, [name]: newValue };
    setSelectedReason(updatedReason);
  };
  const createNewReason = (newValue: any) => {
    const updatedOptions = [...reasonOptions, newValue];
    setReasonOptions(updatedOptions);
    handleUpdateReason('title', newValue.value);
  };
  const handleAddFund = async () => {
    if (selectedReason) {
      const todaysDate = new Date();
      const reasonExists = reasons.find(
        (reason) => reason.title === selectedReason.title
      );
      if (reasonExists) {
        createFund.mutate({
          amount: fundAmount,
          reasonId: reasonExists.id,
          updatedAt: todaysDate,
        });
      } else {
        const { id, ...rest } = selectedReason;
        const newReason = await createReason.mutateAsync({
          ...rest,
          updatedAt: todaysDate,
        });
        createFund.mutate({
          amount: fundAmount,
          reasonId: newReason.id,
          updatedAt: todaysDate,
        });
      }
      createTransaction.mutate({
        amount: fundAmount,
        type: 'fund' as TransactionType,
        description: `Funds for ${selectedReason.title}`,
        completedAt: todaysDate,
      });
      createHistory.mutate({
        type: 'expense',
        amount: fundAmount,
        completedAt: todaysDate,
      });
      handleCloseInsert();
    }
  };
  const handlePieChartClick = async (event: any, params: any) => {
    const index = params.dataIndex;
    const selectedFundLabel = fundsDataChart[index]?.label;
    const reasonPie = reasons.find(
      (reason) => reason.title === selectedFundLabel
    );
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
      const todaysDate = new Date();

      // Create the withdrawal fund entry (negative amount)
      createFund.mutate({
        amount: value,
        reasonId: selectedReason.id,
        updatedAt: todaysDate,
      });

      createHistory.mutate({
        type: 'income',
        amount: -value,
        completedAt: todaysDate,
      });
    }
  };

  return {
    funds,
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
