import React from 'react';
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

interface Goal {
  description: string;
  amount: number;
}

const mockGoals: Goal[] = [
  { description: 'Achieve a balance of 10,000€', amount: 10000 },
  { description: 'Deposit 300€ to buy a monitor', amount: 300 },
  { description: 'Save 1,500€ for vacation', amount: 1500 },
  { description: 'Contribute 500€ towards emergency fund', amount: 500 },
];

const Goals: React.FC = () => {
  return (
    <CardComponent title="Goals" buttonText="Add Goal">
      <List>
        {mockGoals.map((goal, index) => (
          <ListItem
            key={index}
            sx={{
              marginBottom: 0,
              marginTop: 0,
              display: 'flex',
              alignItems: 'center',
            }}
            secondaryAction={
              <IconButton edge="end" aria-label="edit">
                <EditIcon />
              </IconButton>
            }
          >
            <ListItemIcon sx={{ minWidth: 'auto', marginRight: '8px' }}>
              <CircleIcon sx={{ fontSize: '0.6rem', color: '#888' }} />
            </ListItemIcon>
            <ListItemText
              primary={goal.description}
              secondary={`Target: ${goal.amount}€`}
              primaryTypographyProps={{ noWrap: true }}
              sx={{ marginBottom: 0, marginTop: 0 }}
            />
          </ListItem>
        ))}
      </List>
    </CardComponent>
  );
};

export default Goals;
