import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useFunds, useGoals, useReasons } from '../../api/apiHooks';
import CardComponent from '../common/CardComponent';
import { calculateGoalProgress } from '@my-workspace/common';

const SavingsTableCard: React.FC = () => {
  const { data: funds = [] } = useFunds();
  const { data: goals = [] } = useGoals();
  const { data: reasons = [] } = useReasons();

  // Aggregate funds by reason
  const aggregatedFunds = React.useMemo(() => {
    const fundsByReason = reasons.map((reason) => {
      const relatedFunds = funds.filter((fund) => fund.reasonId === reason.id);
      const currentBalance = relatedFunds.reduce(
        (sum, fund) => sum + fund.amount,
        0
      );
      const goal = goals.find((g) => g.reasonId === reason.id);

      let goalProgress = null;
      if (goal) {
        goalProgress = calculateGoalProgress(currentBalance, {
          amount: goal.amount,
          status: goal.status,
        });
      }

      return {
        id: reason.id,
        category: reason.title,
        currentBalance: currentBalance,
        goalAmount: goal?.amount || null,
        // monthlyContribution: goal?.monthlyContribution || null,
        progress: goalProgress?.percentage || null,
        status: goalProgress?.status || 'NO_GOAL',
      };
    });

    return fundsByReason;
  }, [funds, goals, reasons]);

  const columns: GridColDef[] = [
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
    },
    {
      field: 'currentBalance',
      headerName: 'Current Balance',
      flex: 1,
      valueFormatter: (value: number | null) => {
        return `€${value?.toFixed(2) || ''}`;
      },
    },
    {
      field: 'goalAmount',
      headerName: 'Goal',
      flex: 1,
      valueFormatter: (value: number | null) => {
        return `€${value?.toFixed(2) || ''}`;
      },
    },
    {
      field: 'progress',
      headerName: 'Progress',
      flex: 1,
      valueFormatter: (value: number | null) => {
        return `${value?.toFixed(1) || ''}%`;
      },
    },
    // {
    //   field: 'monthlyContribution',
    //   headerName: 'Monthly Contrib.',
    //   flex: 1,
    //   valueFormatter: (params: { value: number | null }) => {
    //     return params.value ? `€${params.value.toFixed(2)}` : '-';
    //   },
    // },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      valueFormatter: (value: string | null) => {
        return value?.replace('_', ' ') || '';
      },
    },
  ];

  return (
    <CardComponent title="Savings Overview">
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={aggregatedFunds}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              color: 'white',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        />
      </div>
    </CardComponent>
  );
};

export default SavingsTableCard;
