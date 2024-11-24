import React, { useState } from 'react';
import CardComponent from '../CardComponent/CardComponent';
import {
  AutocompleteVirtualizedProps,
  CustomDialog,
  DynamicForm,
  FieldConfig,
} from '@my-workspace/react-components';
import { CreateGoals, CreateGoalsDto, Goals } from '@my-workspace/common';
import GoalsTabs from './GoalsTab';
import { useGoals } from '../../api/apiHooks';

const GoalsCard: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    data: goals,
    create: createGoal,
    del: deleteGoal,
    refetch,
  } = useGoals();

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
    createGoal.mutate(newGoal);
    setOpenDialog(false);
  };
  const onDeleteGoal = async (goalId: string) => {
    await deleteGoal.mutateAsync({ id: goalId });
    await refetch();
  };

  return (
    <CardComponent
      title="Goals"
      buttonText="Add Goal"
      onClick={() => setOpenDialog(true)}
    >
      <GoalsTabs goals={goals} deleteGoal={onDeleteGoal} />
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
