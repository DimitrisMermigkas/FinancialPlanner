import React from 'react';
import {
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Goals } from '@my-workspace/common';
import { useDialogContext } from '@my-workspace/react-components';
import DeleteIcon from '@mui/icons-material/Delete';

interface GoalsTabsProps {
  goals: Goals[];
  deleteGoal: (id: string) => void;
}

const GoalsTabs: React.FC<GoalsTabsProps> = ({ goals, deleteGoal }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const dialogContext = useDialogContext();
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const renderGoalsByTypeAndStatus = (type: string, status: string) => {
    const filteredGoals = goals.filter(
      (goal) => goal.type === type && goal.status === status
    );

    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{`${status}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal, index) => (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography key={index} sx={{ marginBottom: '8px' }}>
                  {goal.description} - Target: {goal.amount}€
                </Typography>
                <IconButton
                  onClick={(e) => onClickDelete(e, goal.id)}
                  sx={{ color: 'inherit', mr: 0.5 }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))
          ) : (
            <Typography>No goals found</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const onClickDelete = async (e: unknown, goalId: string) => {
    if (!goalId) return;
    if (
      await dialogContext.getConfirmation({
        type: 'confirm',
        title: 'Confirm delete goal',
        message: `Are you sure you want to delete this goal?`,
      })
    ) {
      deleteGoal(goalId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Savings" />
        <Tab label="Limits" />
      </Tabs>
      {selectedTab === 0 &&
        ['IN_PROGRESS', 'ACHIEVED', 'PENDING'].map((status) =>
          renderGoalsByTypeAndStatus('SAVINGS', status)
        )}
      {selectedTab === 1 &&
        ['IN_PROGRESS', 'ACHIEVED', 'PENDING'].map((status) =>
          renderGoalsByTypeAndStatus('LIMIT', status)
        )}
    </div>
  );
};

export default GoalsTabs;
