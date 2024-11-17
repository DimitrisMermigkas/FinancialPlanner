import { screen, fireEvent, waitFor } from '@testing-library/react';
import { DynamicForm } from './DynamicForm';
import { z } from 'zod';
import userEvent from '@testing-library/user-event';
import customRender from '../ThemeProvider/test-utils';

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

describe('DynamicForm', () => {
  test('should render all fields correctly', () => {
    customRender(
      <DynamicForm fields={fields} schema={schema} onSubmit={onSubmit} />
    );

    // Check if the fields are rendered
    fields.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
  });

  test('should show validation error for required fields when not filled out', async () => {
    customRender(
      <DynamicForm fields={fields} schema={schema} onSubmit={onSubmit} />
    );

    const submitButton = document.querySelector(`button[type="submit"]`);
    if (submitButton) fireEvent.click(submitButton);
    // Wait for validation messages to appear
    await waitFor(() => {
      const requiredMessages = screen.getAllByText('Required');
      // Check if the array contains elements and each is in the document
      expect(requiredMessages.length).toBeGreaterThan(0);
      requiredMessages.forEach((message) => {
        expect(message).toBeInTheDocument();
      });
    });
  });

  test('should show the helper text message', async () => {
    customRender(
      <DynamicForm fields={fields} schema={schema} onSubmit={onSubmit} />
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
    customRender(
      <DynamicForm
        fields={fields}
        schema={schema}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
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
