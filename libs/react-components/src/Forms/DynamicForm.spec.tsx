import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { DynamicForm } from './DynamicForm';
import { z } from 'zod';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { act, ReactNode } from 'react';

// Mock schema
const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  birthdate: z.date().optional(),
  appointmentTime: z.date().optional(),
  favoriteColor: z.string().optional(),
  hobbies: z
    .array(
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
      })
    )
    .optional(),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to terms'),
});

// Mock onSubmit function
const onSubmit = async (data: z.infer<typeof schema>) => {
  console.log(data);
};

// Fields configuration
const fields = [
  {
    name: 'username',
    label: 'Username',
    type: 'input' as const,
    isRequired: true,
    componentProps: {
      placeholder: 'Enter your username',
      variant: 'outlined',
    },
  },
  {
    name: 'birthdate',
    label: 'Birthdate',
    type: 'date' as const,
    componentProps: {
      disableFuture: true, // Example prop for date picker
    },
  },
  {
    name: 'appointmentTime',
    label: 'Appointment Time',
    type: 'time' as const,
    componentProps: {
      ampm: true, // Example prop for time picker
    },
  },
  {
    name: 'favoriteColor',
    label: 'Favorite Color',
    type: 'select' as const,
    componentProps: {
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
      ],
    },
  },
  {
    name: 'hobbies',
    label: 'Hobbies',
    type: 'multiselect' as const,
    componentProps: {
      options: [
        { label: 'Reading', value: 'reading' },
        { label: 'Traveling', value: 'traveling' },
        { label: 'Cooking', value: 'cooking' },
      ],
    },
  },
  {
    name: 'agreeToTerms',
    label: 'Agree to Terms',
    type: 'checkbox' as const,
    componentProps: {},
  },
];

const defaultValues = {
  favoriteColor: 'red',

};

const LocalProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    {children}
  </LocalizationProvider>
);

describe('DynamicForm', () => {
  test('should render all fields correctly', () => {
    render(
      <DynamicForm fields={fields} schema={schema} onSubmit={onSubmit} />,
      { wrapper: LocalProvider }
    );

    // Check if the fields are rendered
    fields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
  });

  test('should show validation error for required fields when not filled out', async () => {
    render(
      <DynamicForm fields={fields} schema={schema} onSubmit={onSubmit} />,
      { wrapper: LocalProvider }
    );

    const submitButton = document.querySelector(`button[type="submit"]`);
    if (submitButton) fireEvent.click(submitButton);
    // Wait for validation messages to appear
    await waitFor(() => {
      // Check if the error message for username appears
      expect(
        screen.getByText('Username must be at least 3 characters long')
      ).toBeInTheDocument();

      // Check for 'agreeToTerms' field error
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  test('should show the helper text message', async () => {
    render(
      <DynamicForm fields={fields} schema={schema} onSubmit={onSubmit} />,
      { wrapper: LocalProvider }
    );

    // Fill in username
    userEvent.type(screen.getByLabelText('Username'), 'testuser');

    const submitButton = document.querySelector(`button[type="submit"]`);
    if (submitButton) fireEvent.click(submitButton);

    // Check if the validation message is shown
    expect(await screen.findByText('Required')).toBeInTheDocument();
  });

  test('should submit form successfully when valid data is provided', async () => {
    // Mock console.log
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    render(
      <DynamicForm
        fields={fields}
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />,
      { wrapper: LocalProvider }
    );

    const textfielduser = screen.getByLabelText('Username');
    const appointmentTime = screen.getByLabelText('Appointment Time');

    // Fill in valid data for each field
    fireEvent.change(textfielduser, { target: { value: 'testuser' } });
    fireEvent.change(appointmentTime, { target: { value: '12:30 PM' } });

    const checkbox = document.querySelector(
      `input[type="checkbox"]`
    ) as HTMLElement;
    checkbox.click();

    const submitButton = document.querySelector(`button[type="submit"]`);
    if (submitButton) fireEvent.click(submitButton);

    // Wait for form submission to complete
    await waitFor(() => {
      const date = new Date().setHours(12, 30, 0, 0);

      expect(logSpy).toHaveBeenCalledWith({
        username: 'testuser',
        birthdate: undefined,
        appointmentTime: new Date(date),
        favoriteColor: 'red',
        hobbies: undefined,
        agreeToTerms: true,
      });
    });
  });
});
