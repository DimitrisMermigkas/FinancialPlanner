import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomTextField from '../Textfields/CustomTextField';
import CustomButton from '../Buttons/CustomButton';
import { VirtualizedSelect } from '../Selects/VirtualizedSelect';
import { CustomDatePicker } from '../Pickers/CustomDatePicker';
import { CustomTimePicker } from '../Pickers/CustomTimePicker';
import { VirtualizedMultipleSelect } from '../Selects/VirtualizedMultipleSelect';
import { FormControlLabel } from '@mui/material';
import CustomCheckbox from '../Checkboxes/CustomCheckbox';

export const SimpleForm = () => {
  const loginSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email('Invalid email address'),
    type: z.string(),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    date: z
      .date()
      .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: 'Invalid date',
      }),
    time: z
      .date()
      .refine((time) => time instanceof Date && !isNaN(time.getTime()), {
        message: 'Invalid time',
      }),
    movie: z.array(z.number()).min(1, 'Select at least 1 movie from the list'),
    userDefault: z.boolean(),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const options = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
  ];
  const movies = [
    { label: 'The Shawshank Redemption', value: 1994 },
    { label: 'The Godfather', value: 1972 },
    { label: 'The Godfather: Part II', value: 1974 },
    { label: 'The Dark Knight', value: 2008 },
    { label: '12 Angry Men', value: 1957 },
    { label: "Schindler's List", value: 1993 },
    { label: 'Pulp Fiction', value: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      value: 2003,
    },
    { label: 'The Good, the Bad and the Ugly', value: 1966 },
    { label: 'Fight Club', value: 1999 },
    { label: 'Forrest Gump', value: 1994 },
    { label: 'Inception', value: 2010 },
    {
      label: 'The Lord of the Rings: The Two Towers',
      value: 2002,
    },
    { label: "One Flew Over the Cuckoo's Nest", value: 1975 },
  ];
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(data);
      })}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '200px',
        rowGap: '8px',
      }}
    >
      <CustomTextField
        label="Name"
        {...register('name')}
        error={!!errors.name?.message}
        helperText={errors.name?.message}
      />
      <CustomTextField
        label="Email"
        type="email"
        {...register('email')}
        error={!!errors.email?.message}
        helperText={errors.email?.message}
      />
      <CustomTextField
        label="Password"
        type="password"
        {...register('password')}
        error={!!errors.password?.message}
        helperText={errors.password?.message}
      />
      <Controller
        name="type"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Select Type',
          },
        }}
        render={({ field }) => (
          <VirtualizedSelect
            label="Type"
            error={!!errors.type?.message}
            helperText={errors.type?.message}
            options={options}
            {...field}
          />
        )}
      />
      <Controller
        name="movie"
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Select movie',
          },
        }}
        render={({ field }) => (
          <VirtualizedMultipleSelect
            label="Movie"
            error={!!errors.movie?.message}
            helperText={errors.movie?.message}
            options={movies}
            {...field}
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        rules={{
          required: 'Enter proper Date',
        }}
        render={({ field }) => (
          <CustomDatePicker
            label="Date"
            textFieldProps={{
              error: !!errors.date?.message,
              helperText: errors.date?.message,
            }}
            {...field}
          />
        )}
      />
      <Controller
        name="time"
        control={control}
        rules={{ required: 'Enter proper time' }}
        render={({ field }) => (
          <CustomTimePicker
            label="Time"
            textFieldProps={{
              error: !!errors.time?.message,
              helperText: errors.time?.message,
            }}
            {...field}
          />
        )}
      />
      <Controller
        name="userDefault"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            label="Make user default"
            control={<CustomCheckbox {...field} />}
          />
        )}
      />

      <CustomButton variant="outlined" type="submit" disabled={isSubmitting}>
        Submit
      </CustomButton>
    </form>
  );
};
export default SimpleForm;
