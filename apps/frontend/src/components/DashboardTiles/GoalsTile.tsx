import React from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import { format } from 'date-fns';
import { useGoals, useReasons, useFunds } from '../../api/apiHooks';
import { calculateGoalProgress } from '@my-workspace/common';
import CardComponent from '../common/CardComponent';

interface GoalItemProps {
  title: string;
  savedAmount: number;
  goalAmount: number;
  percentage: number;
  dueDate?: Date | null;
}

const GoalItem: React.FC<GoalItemProps> = ({
  title,
  savedAmount,
  goalAmount,
  percentage,
  dueDate,
}) => {
  return (
    <Box
      sx={{
        background: 'linear-gradient(165deg, #2A3A4DCC 0%, #0B0D1B4D 100%)',
        borderRadius: '20px',
        padding: '8px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        boxShadow: '3px 3px 4px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '80px',
          height: '60px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={60}
          thickness={4}
          sx={{
            color: percentage >= 60 ? '#B93842' : '#2196F3',
            position: 'absolute',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#fff' }}>
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'space-between',
          '& .MuiBox-root': {
            flex: 1,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#fff', marginBottom: '4px' }}
            >
              {title}
            </Typography>
            {dueDate && (
              <Typography variant="body2" sx={{ color: '#8B8D93' }}>
                Deadline: {format(new Date(dueDate), 'MMMM dd, yyyy')}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#8B8D93' }}>Saved up</Typography>
            <Typography sx={{ color: '#fff' }}>
              €{savedAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#8B8D93' }}>Goal</Typography>
            <Typography sx={{ color: '#fff' }}>
              €{goalAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const GoalsTile: React.FC = () => {
  const { data: goals } = useGoals();
  const { data: reasons } = useReasons();
  const { data: funds } = useFunds();

  const goalsWithProgress = goals?.map((goal) => {
    const reason = reasons?.find((r) => r.id === goal.reasonId);
    const reasonFunds = funds?.filter(
      (fund) => fund.reasonId === goal.reasonId
    );
    const currentAmount =
      reasonFunds?.reduce((sum, fund) => sum + fund.amount, 0) || 0;

    const progress = calculateGoalProgress(currentAmount, {
      amount: goal.amount,
      status: goal.status,
    });

    return {
      title: reason?.title || '',
      savedAmount: currentAmount,
      goalAmount: goal.amount,
      percentage: progress.percentage,
      dueDate: goal.dueDate,
    };
  });

  // Sort goals: ones with dueDate first, then by closest dueDate
  const sortedGoals = goalsWithProgress?.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  });

  const upcomingGoal = sortedGoals?.find((goal) => goal.dueDate);
  const otherGoals = sortedGoals?.filter((goal) =>
    upcomingGoal ? goal !== upcomingGoal : true
  );

  return (
    <CardComponent
      title="Goals"
      cardStyle={{ height: '100%', width: '100%' }}
      cardContentStyle={{ height: '100%' }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'auto',
        }}
      >
        {upcomingGoal ? (
          <>
            <GoalItem key="upcoming" {...upcomingGoal} />
            {otherGoals && otherGoals.length > 0 && (
              <>
                <Divider
                  sx={{
                    my: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    mx: '15%',
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      overflow: 'auto',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      },
                    }}
                  >
                    {otherGoals.map((goal, index) => (
                      <GoalItem key={index} {...goal} />
                    ))}
                  </Box>
                </Box>
              </>
            )}
          </>
        ) : (
          // If no goals with dueDate, render all goals normally
          sortedGoals?.map((goal, index) => <GoalItem key={index} {...goal} />)
        )}
      </Box>
    </CardComponent>
  );
};

export default GoalsTile;
