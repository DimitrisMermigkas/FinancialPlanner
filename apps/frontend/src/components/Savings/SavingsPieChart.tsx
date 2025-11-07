import React from 'react';
import { PieChart } from '@mui/x-charts';
import CardComponent from '../common/CardComponent';
import useFundsHandlers from '../../handlers/Funds.handlers';

const SavingsPieChart: React.FC = () => {
  const { fundsDataChart, handlePieChartClick } = useFundsHandlers();

  return (
    <CardComponent title="Savings Distribution">
      <PieChart
        series={[
          {
            data: (fundsDataChart || []).filter(
              (item): item is { id: string; value: number; label: string } =>
                item !== undefined
            ),
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: {
              innerRadius: 30,
              additionalRadius: -30,
              color: 'gray',
            },
          },
        ]}
        width={600}
        height={200}
        onItemClick={handlePieChartClick}
      />
    </CardComponent>
  );
};

export default SavingsPieChart;
