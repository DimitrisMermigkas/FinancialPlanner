interface GoalProgress {
  currentAmount: number;
  targetAmount: number;
  percentage: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'ACHIEVED' | 'FAILED';
}

export function calculateGoalProgress(
  currentAmount: number,
  goal: { amount: number; status: string }
): GoalProgress {
  const percentage = (currentAmount / goal.amount) * 100;

  let status = goal.status;
  if (percentage >= 100) {
    status = 'ACHIEVED';
  } else if (percentage > 0) {
    status = 'IN_PROGRESS';
  }

  return {
    currentAmount,
    targetAmount: goal.amount,
    percentage,
    status: status as GoalProgress['status'],
  };
}
