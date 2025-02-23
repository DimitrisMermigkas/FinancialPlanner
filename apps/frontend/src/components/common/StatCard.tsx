import React from 'react';
import {
  Box,
  Typography,
  Card,
  styled,
  Menu,
  MenuItem,
  IconButton,
  Select,
} from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(129deg, #151D27 25%, #0b0d1b4d 80%)',
  backgroundPosition: '90% 30%',
  backgroundSize: '100% 100%',
  borderRadius: '20px',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
  marginBottom: 0,
  boxSizing: 'border-box',
}));

const StyledSelect = styled(Select)({
  fontSize: '10px',
  color: 'rgba(255, 255, 255, 0.7)',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-select': {
    padding: '4px 8px',
    paddingRight: '32px !important',
  },
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.7)',
    right: '8px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
});

interface StatCardProps {
  title: string;
  amount: number;
  percentageChange?: number;
  timeFrame: 'This Month' | 'Last Month' | 'This Year';
  onTimeFrameChange: (
    newTimeFrame: 'This Month' | 'Last Month' | 'This Year'
  ) => void;
  gradientColors: string[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  percentageChange,
  timeFrame,
  onTimeFrameChange,
  gradientColors,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTimeFrameSelect = (
    newTimeFrame: 'This Month' | 'Last Month' | 'This Year'
  ) => {
    onTimeFrameChange(newTimeFrame);
    handleClose();
  };

  return (
    <StyledCard>
      <Box
        style={{
          width: '100%',
          boxSizing: 'border-box',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          gap: '16px',
          height: '100%',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            style={{ fontSize: 24, fontWeight: 'normal' }}
            color="rgba(255, 255, 255, 0.8)"
          >
            {title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <StyledSelect
              value={timeFrame}
              onChange={(event) =>
                handleTimeFrameSelect(
                  event.target.value as
                    | 'This Month'
                    | 'Last Month'
                    | 'This Year'
                )
              }
            >
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="Last Month">Last Month</MenuItem>
              <MenuItem value="This Year">This Year</MenuItem>
            </StyledSelect>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          height="100%"
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}
          >
            <Typography variant="h3" fontWeight="bold" style={{ fontSize: 34 }}>
              €{amount.toLocaleString()}
            </Typography>
            {percentageChange !== undefined && (
              <Typography
                color={percentageChange >= 0 ? '#22C55E' : '#FF4842'}
                style={{ fontSize: 14 }}
              >
                {percentageChange >= 0 ? '+' : ''}
                {percentageChange}%
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default StatCard;
