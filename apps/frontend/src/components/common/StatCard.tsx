import React, { MouseEvent, useState } from 'react';
import { Box, Typography, Card, styled, Popover } from '@mui/material';
import { DateRange, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '../DashboardTiles/DashboardTiles.css';

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

interface StatCardProps {
  title: string;
  amount: number;
  percentageChange?: number;
  dateRange?: Range;
  onDateRangeChange?: (range: Range) => void;
  onInternalDateRangeChange?: (range: Range) => void;
  gradientColors: string[];
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  percentageChange,
  dateRange,
  onDateRangeChange,
  onInternalDateRangeChange,
  gradientColors,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [internalDateRange, setInternalDateRange] = useState<Range>(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: startOfMonth,
      endDate: today,
      key: 'selection',
    };
  });

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateRangeChange = (rangesByKey: RangeKeyDict) => {
    const newRange = rangesByKey.selection;
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    } else {
      setInternalDateRange(newRange);
      onInternalDateRangeChange?.(newRange);
    }
    handleClose();
  };

  const currentDateRange = dateRange || internalDateRange;
  const open = Boolean(anchorEl);

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
            <Typography
              onClick={handleClick}
              style={{
                fontSize: 14,
                cursor: 'pointer',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              {currentDateRange.startDate?.toLocaleDateString()} -{' '}
              {currentDateRange.endDate?.toLocaleDateString()}
            </Typography>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ bgcolor: '#151D27', p: 2, borderRadius: 1 }}>
                <DateRange
                  className="calendar-container"
                  ranges={[{ ...currentDateRange, key: 'selection' }]}
                  onChange={handleDateRangeChange}
                  months={1}
                  direction="vertical"
                  color="#6293b3"
                  rangeColors={['#6293b3']}
                  minDate={new Date(2020, 0, 1)}
                  maxDate={new Date()}
                />
              </Box>
            </Popover>
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
