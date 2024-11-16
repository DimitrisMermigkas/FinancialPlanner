import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CardComponent from '../../components/CardComponent/CardComponent';
import { PageLayout } from '@my-workspace/react-components';

const userSettings = {
  picture: '../../icons/ataman.png',
  name: 'John Doe',
  username: 'johndoe',
  income: 3000,
  averageExpenses: 1200,
  monthlyExpenses: [
    'Rent: 800€',
    'Utilities: 100€',
    'Internet: 50€',
    'Groceries: 250€',
  ],
};

const SettingsPage: React.FC = () => {
  const [editableFields, setEditableFields] = useState(userSettings);

  const handleEdit = (field: keyof typeof userSettings) => {
    // Implement edit logic here
    console.log(`Edit ${field}`);
  };

  return (
    <PageLayout
      title="Settings"
      style={{
        color: '#f2f4f7ff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <CardComponent>
        <Avatar
          src={editableFields.picture}
          alt={editableFields.name}
          sx={{ width: 100, height: 100, marginBottom: '16px' }}
        />
        <Typography variant="h5">{editableFields.name}</Typography>
        <Typography variant="subtitle1">@{editableFields.username}</Typography>

        <List>
          <ListItem
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography>Income</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{`${editableFields.income}€`}</Typography>
              <IconButton onClick={() => handleEdit('income')}>
                <EditIcon />
              </IconButton>
            </div>
          </ListItem>

          <ListItem
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography>Average Monthly Expenses</Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{`${editableFields.averageExpenses}€`}</Typography>

              <IconButton onClick={() => handleEdit('averageExpenses')}>
                <EditIcon />
              </IconButton>
            </div>
          </ListItem>

          <Typography variant="h6" sx={{ marginTop: '16px' }}>
            Default Monthly Expenses
          </Typography>
          {editableFields.monthlyExpenses.map((expense, index) => (
            <ListItem
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
              key={index}
            >
              <ListItemText primary={expense} />

              <IconButton onClick={() => console.log(`Edit expense ${index}`)}>
                <EditIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Change password')}
        >
          Change Password
        </Button>
      </CardComponent>
    </PageLayout>
  );
};

export default SettingsPage;
