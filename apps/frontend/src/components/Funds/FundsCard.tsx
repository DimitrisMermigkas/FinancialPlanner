import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import { PieChart, PieSeriesType } from '@mui/x-charts'; // Updated import

import { formatTimestamp } from '../../utils/formatDate';
import { VirtualizedSelect } from '@my-workspace/react-components';
import useFundsHandlers from 'apps/frontend/src/handlers/Funds.handlers';
import FundsLogs from './FundsLogs';
import CardComponent from '../CardComponent/CardComponent';
import { Funds, Reason } from '@my-workspace/common';

interface Option {
  value: string | number;
  label: string;
}

interface FundsCardProps {
  funds: Funds[];
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
  const {
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
  } = useFundsHandlers({
    funds: funds,
    reasons: reasons,
    setBalance: setBalance,
  });

  return (
    <>
      <CardComponent
        title="Funds"
        buttonText="Deposit Funds"
        cardStyle={{ flex: 0.6 }}
        onClick={handleClickOpenInsert}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <PieChart
              colors={['#FF6384', '#36A2EB', '#FFCE56']}
              series={[
                {
                  data: fundsDataChart,
                  highlightScope: { fade: 'global', highlight: 'item' },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: 'gray',
                  },
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
          </div>
          <FundsLogs
            logs={logs}
            selectedReason={selectedReason}
            handleWithdraw={handleWithdraw}
          />
        </div>
      </CardComponent>

      {/* Dialog for inserting funds */}
      <Dialog
        open={openInsertDialog}
        onClose={handleCloseInsert}
        PaperProps={{ style: { width: '500px', minHeight: '40%' } }}
      >
        <DialogTitle>Insert Funds</DialogTitle>
        <DialogContent
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '70%',
              justifyContent: 'center',
              alignContent: 'center',
              rowGap: '10px',
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
              value={selectedReason.id}
              options={reasonOptions}
              onChange={(newValue) => handleUpdateReason('title', newValue)}
              onCreate={createNewReason}
              textFieldProps={{
                label: 'Select a Reason',
                variant: 'outlined',
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
                handleUpdateReason('description', e.target.value)
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
    </>
  );
};

export default FundsCard;
