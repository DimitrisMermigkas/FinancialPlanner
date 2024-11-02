import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Balance } from '../../../services/api';
import { eachDayOfInterval, format, subDays } from 'date-fns';

interface BalanceChartProps {
  open: boolean;
  onClose: () => void;
  data: Balance[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ open, onClose, data }) => {
  const [showProjected, setShowProjected] = useState(false);

  // Sort data by date
  const sortedData = data.sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  // Define the date range and initialize arrays
  const endDate = new Date();
  const startDate = subDays(endDate, 33);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Map sortedData amounts to corresponding dates or set to `null` if no data exists for that date
  const yAxisData = dateRange.map((date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const record = sortedData.find(
      (item) => format(new Date(item.updatedAt), 'yyyy-MM-dd') === dateString
    );
    return record ? record.amount : null;
  });

  // Format dates as MMM-YY and bold the first day of each month in the labels
  const xAxisData = dateRange.map((date) => format(date, 'MMM-dd'));

  // ApexCharts options with custom x-axis formatter
  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: xAxisData,
      labels: {
        formatter: (value: string) => {
          const currentDate = new Date(value);
          const isFirstOfMonth = currentDate.getDate() === 1;
          const newValue = isFirstOfMonth
            ? format(currentDate, 'MMM-yy')
            : value;
          return newValue;
        },
        useHTML: true, // Enable HTML formatting in labels
      },
      title: {
        text: 'Date',
      },
    },
    yaxis: {
      title: {
        text: 'Balance (€)',
      },
    },

    colors: ['#3f51b5'],
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Balance History</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={showProjected}
              onChange={() => setShowProjected(!showProjected)}
            />
          }
          label="Show Projected Balance"
        />
        {/* <ApexCharts
          options={chartOptions}
          series={[
            {
              name: 'Balance (€)',
              data: yAxisData,
            },
          ]}
          type="line"
          width={600}
          height={400}
        /> */}
      </DialogContent>
      <Button
        onClick={onClose}
        color="primary"
        variant="contained"
        style={{ margin: '20px' }}
      >
        Close
      </Button>
    </Dialog>
  );
};

export default BalanceChart;
