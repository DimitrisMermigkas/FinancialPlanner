import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/Circle';
import CardComponent from '../CardComponent/CardComponent';
import {
  AutocompleteVirtualizedProps,
  CustomDialog,
  DynamicForm,
  FieldConfig,
  useDialogContext,
} from '@my-workspace/react-components';
import {
  CreateGoals,
  CreateGoalsDto,
  Goals,
  GoalsSchema,
} from '@my-workspace/common';
import { addGoal } from '../../services/api';
import GoalsTabs from './GoalsTab';

interface GoalsCardProps {
  goals: Goals[];
  setGoals: React.Dispatch<React.SetStateAction<Goals[]>>;
}
const GoalsCard: React.FC<GoalsCardProps> = ({ goals, setGoals }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const dialogContext = useDialogContext();

  const fields: FieldConfig<Goals>[] = [
    {
      name: 'amount',
      label: 'Amount',
      type: 'input',
      componentProps: {
        type: 'number',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'input',
    },
    {
      name: 'type',
      label: 'Transaction Type',
      type: 'select',
      isRequired: true,
      componentProps: {
        options: [
          { label: 'Target Goal', value: 'SAVINGS' },
          { label: 'Set as limit', value: 'LIMIT' },
        ],
      } as AutocompleteVirtualizedProps<string, false>,
    },
  ];

  const onAddGoal = async (data: CreateGoals) => {
    console.log(data);
    const todaysDate = new Date();
    // const goalStatus = data.type == 'LIMIT' ? 'IN_PROGRESS' : 'PENDING';

    const newGoal = {
      ...data,
      status: 'IN_PROGRESS' as const,
      description: '',
      createdAt: todaysDate,
    };
    const newGoalUpdated = await addGoal(newGoal);
    setGoals([...goals, newGoalUpdated]);
    setOpenDialog(false);
  };
  return (
    <CardComponent
      title="Goals"
      buttonText="Add Goal"
      onClick={() => setOpenDialog(true)}
    >
      <GoalsTabs goals={goals} setGoals={setGoals} />
      <CustomDialog
        open={openDialog}
        title="Set a balance goal"
        onClose={() => setOpenDialog(false)}
      >
        <DynamicForm
          fields={fields}
          schema={CreateGoalsDto.omit({ status: true })}
          onSubmit={onAddGoal}
        />
      </CustomDialog>
    </CardComponent>
  );
};

export default GoalsCard;
