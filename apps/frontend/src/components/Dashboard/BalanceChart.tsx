// BalanceChart.tsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { Balance } from "../../services/api";
import { eachDayOfInterval, format, subDays } from "date-fns";

interface BalanceChartProps {
  open: boolean;
  onClose: () => void;
  data: Balance[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ open, onClose, data }) => {
  // Sort data by date
  const sortedData = data.sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  );

  // Define the last 40 days as the date range
  const endDate = new Date();
  const startDate = subDays(endDate, 39); // 39 days ago + today = 40 days
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Map sortedData amounts to corresponding dates, or `null` if no data exists for that date
  const yAxisData = dateRange.map((date) => {
    const dateString = format(date, "yyyy-MM-dd");
    const record = sortedData.find(
      (item) => format(new Date(item.updatedAt), "yyyy-MM-dd") === dateString
    );
    return record ? record.amount : null;
  });

  // Generate x-axis data as days of the month
  const xAxisData = dateRange.map((date) => format(date, "dd"), 10);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Balance History</DialogTitle>
      <DialogContent>
        <LineChart
          xAxis={[
            {
              data: xAxisData,
              label: "Days of the Month",
            },
          ]}
          series={[
            {
              data: yAxisData,
              label: "Balance (€)",
              color: "#3f51b5",
              connectNulls: true, // Ensure the line is continuous even if data is missing
            },
          ]}
          width={600}
          height={400}
        />
      </DialogContent>
      <Button
        onClick={onClose}
        color="primary"
        variant="contained"
        style={{ margin: "20px" }}
      >
        Close
      </Button>
    </Dialog>
  );
};

export default BalanceChart;
