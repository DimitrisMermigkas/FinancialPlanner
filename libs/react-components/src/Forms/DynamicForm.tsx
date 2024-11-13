import { z, ZodType } from 'zod';
import {
  Controller,
  useForm,
  Path,
  SubmitErrorHandler,
  FieldValues,
  FieldErrors,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import CustomTextField, {
  CustomTextFieldProps,
} from '../Textfields/CustomTextField';
import CustomButton from '../Buttons/CustomButton';
import { VirtualizedSelect } from '../Selects/VirtualizedSelect';
import {
  CustomDatePicker,
  CustomDatePickerProps,
} from '../Pickers/CustomDatePicker';
import {
  CustomTimePicker,
  CustomTimePickerProps,
} from '../Pickers/CustomTimePicker';
import { VirtualizedMultipleSelect } from '../Selects/VirtualizedMultipleSelect';
import CustomCheckbox from '../Checkboxes/CustomCheckbox';
import { CheckboxProps, FormControlLabel, FormHelperText } from '@mui/material';
import React, { BaseSyntheticEvent } from 'react';
import { AutocompleteVirtualizedProps } from '../Selects/sharedSelectPropsAndUtils';
import styled from '@emotion/styled';

const ResponsiveContainer = styled.div`
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  overflow: auto;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
`;
// Define a type that maps each field type to its props
type FieldPropsMap = {
  input: CustomTextFieldProps;
  date: CustomDatePickerProps;
  time: CustomTimePickerProps;
  select: AutocompleteVirtualizedProps<string, false>;
  multiselect: AutocompleteVirtualizedProps<string, true>;
  checkbox: CheckboxProps;
};

export type FieldConfig<T> = {
  name: Path<T>;
  label: string;
  type: keyof FieldPropsMap;
  isRequired?: boolean;
  componentProps?: FieldPropsMap[keyof FieldPropsMap];
};

interface DynamicFormProps<T extends ZodType> {
  fields: FieldConfig<z.infer<T>>[];
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  defaultValues?: Partial<z.infer<T>>; // Add defaultValues as an optional prop
  containerStyle?: React.CSSProperties;
  formStyle?: React.CSSProperties;
}

// Define the DynamicForm as a Functional Component
export const DynamicForm: React.FC<DynamicFormProps<ZodType>> = ({
  fields,
  schema,
  onSubmit,
  defaultValues = {},
  containerStyle,
  formStyle,
}) => {
  // Set up useForm with zodResolver
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onError: SubmitErrorHandler<FieldValues> = (
    errors: FieldErrors<FieldValues>,
    event?: BaseSyntheticEvent
  ) => {
    console.log(errors);
  };

  const fieldConfigs = fields.map((field) => ({
    name: field.name,
    label: field.label,
    type: field.type,
    isRequired: field.isRequired,
    componentProps: field.componentProps,
  }));

  // Create an array to hold the rendered components
  const renderedFields: JSX.Element[] = [];

  if (fieldConfigs.length > 0) {
    for (const fieldConfig of fieldConfigs) {
      const errorMessage = errors[fieldConfig.name]?.message; // Extract the error message

      let fieldComponent: JSX.Element | null = null;
      switch (fieldConfig.type) {
        case 'input':
          const props = fieldConfig.componentProps as CustomTextFieldProps;
          const isTypeNumber = props?.type == 'number';

          fieldComponent = (
            <Controller
              key={fieldConfig.name}
              control={control}
              name={fieldConfig.name}
              rules={{ required: fieldConfig.isRequired }}
              render={({ field }) => (
                <CustomTextField
                  type={isTypeNumber ? 'number' : 'text'}
                  label={fieldConfig.label}
                  error={!!errorMessage}
                  helperText={errorMessage as string}
                  {...field}
                  {...(fieldConfig.componentProps as CustomTextFieldProps)} // Explicitly casting to CustomTextFieldProps
                />
              )}
            />
          );

          break;

        case 'date':
          fieldComponent = (
            <Controller
              key={fieldConfig.name}
              control={control}
              name={fieldConfig.name}
              rules={{ required: fieldConfig.isRequired }}
              render={({ field }) => (
                <CustomDatePicker
                  label={fieldConfig.label}
                  textFieldProps={{
                    error: !!errorMessage,
                    helperText: errorMessage as string | undefined, // Ensure it's a string or undefined
                  }}
                  {...field}
                  {...(fieldConfig.componentProps as CustomDatePickerProps)} // Explicitly casting to CustomDatePickerProps
                />
              )}
            />
          );
          break;
        case 'time':
          fieldComponent = (
            <Controller
              key={fieldConfig.name}
              control={control}
              name={fieldConfig.name}
              rules={{ required: fieldConfig.isRequired }}
              render={({ field }) => (
                <CustomTimePicker
                  label={fieldConfig.label}
                  textFieldProps={{
                    error: !!errorMessage,
                    helperText: errorMessage as string | undefined, // Ensure it's a string or undefined
                  }}
                  {...field}
                  {...(fieldConfig.componentProps as CustomTimePickerProps)} // Explicitly casting to CustomDatePickerProps
                />
              )}
            />
          );
          break;
        case 'select':
          fieldComponent = (
            <Controller
              key={fieldConfig.name}
              control={control}
              name={fieldConfig.name}
              rules={{ required: fieldConfig.isRequired }}
              render={({ field }) => (
                <VirtualizedSelect
                  error={!!errorMessage}
                  helperText={errorMessage as string | undefined} // Ensure it's a string or undefined
                  {...field}
                  label={fieldConfig.label}
                  {...(fieldConfig.componentProps as AutocompleteVirtualizedProps<string>)} // Explicitly casting to AutocompleteVirtualizedProps
                />
              )}
            />
          );
          break;
        case 'multiselect':
          fieldComponent = (
            <Controller
              key={fieldConfig.name}
              control={control}
              name={fieldConfig.name}
              rules={{ required: fieldConfig.isRequired }}
              render={({ field }) => (
                <VirtualizedMultipleSelect
                  error={!!errorMessage}
                  helperText={errorMessage as string | undefined} // Ensure it's a string or undefined
                  {...field}
                  label={fieldConfig.label}
                  {...(fieldConfig.componentProps as AutocompleteVirtualizedProps<
                    string,
                    true
                  >)} // Explicitly casting to AutocompleteVirtualizedProps[]
                />
              )}
            />
          );
          break;
        case 'checkbox':
          fieldComponent = (
            <Controller
              key={fieldConfig.name}
              control={control}
              name={fieldConfig.name}
              rules={{ required: fieldConfig.isRequired }}
              render={({ field }) => (
                <>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        {...field}
                        {...(fieldConfig.componentProps as CheckboxProps)}
                      />
                    }
                    required={fieldConfig.isRequired}
                    label={fieldConfig.label}
                  />
                  {!!errorMessage && (
                    <FormHelperText error={true}>
                      {errorMessage as string}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          );
          break;
      }
      if (fieldComponent) {
        renderedFields.push(fieldComponent);
      }
    }
    return (
      <ResponsiveContainer style={{ display: 'flex', ...containerStyle }}>
        <StyledForm
          style={formStyle}
          onSubmit={(e) =>
            handleSubmit(
              onSubmit,
              onError
            )(e).catch((e) => {
              console.log('e', e);
            })
          }
        >
          {renderedFields}
          <CustomButton
            variant="outlined"
            type="submit"
            disabled={isSubmitting}
          >
            Submit
          </CustomButton>
        </StyledForm>
      </ResponsiveContainer>
    );
  } else return null;
};

export default DynamicForm;
