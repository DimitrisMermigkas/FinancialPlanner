import React from 'react';
import { Autocomplete } from '@mui/material';
import CustomTextField from '../Textfields/CustomTextField';
import {
  AutocompleteVirtualizedProps,
  filteredOptionsSelect,
  ListboxComponent,
  OptionWithIsNew,
  renderRows,
} from './sharedSelectPropsAndUtils';

/**
 * VirtualizedSelect is a customizable and virtualized select component built using MUI's Autocomplete,
 * enabling enhanced performance and functionality for selecting options.
 *
 * @param {Option[]} options - The list of options available for selection, each consisting of a label and a value.
 * @param {string} [label] - Optional. The label displayed for the input field.
 * @param {ValueType | null} value - The currently selected value, which can be of any type defined by ValueType or null if no selection exists.
 * @param {(value: ValueType | null, reason?: CustomAutocompleteChangeReason['reason']) => void} onChange - Callback function invoked when the selected value changes, with the new value and an optional reason.
 * @param {boolean} [error] - Optional. Indicates if the component should display an error state.
 * @param {string} [helperText] - Optional. Text displayed below the input field to provide additional context or error messages.
 * @param {React.ComponentProps<typeof CustomTextField>} [textFieldProps] - Optional. Props to be passed to the custom text field used for input.
 * @param {(option: Option) => boolean} [getOptionDisabled] - Optional. A function that determines whether an option is disabled based on its properties.
 * @param {(value: string) => void} [onCreate] - Optional. Callback function triggered when a new value is created (for free solo mode).
 * @param {boolean} [freeSolo] - Optional. Allows users to input values that are not in the list of options.
 * @param {(props: object, option: Option, state: AutocompleteRenderOptionState) => React.ReactNode} [renderOption] - Optional. Custom function to render each option in the dropdown.
 */

export const VirtualizedSelect = <ValueType,>({
  options,
  label,
  value,
  onChange,
  error,
  helperText,
  textFieldProps,
  onCreate,
  freeSolo,
  renderOption = renderRows<ValueType | string>,
}: AutocompleteVirtualizedProps<ValueType, false>) => {
  const handleChange = (v: OptionWithIsNew<ValueType> | null) => {
    if (v === null) {
      // If the value is null (clear selection), pass null to onChange
      onChange?.(null);
    } else if (onCreate && v?.isNew) {
      const modifiedNewItem = {
        value: v.value,
        label: String(v.value),
      };
      onCreate(modifiedNewItem);
    } else {
      onChange && onChange(v?.value ?? null);
    }
  };

  return (
    <Autocomplete<OptionWithIsNew<ValueType>, false, false, boolean>
      value={options.find((option) => option.value === value) || null}
      onChange={(_, newValue) => {
        let updatedValue = newValue;
        if (typeof updatedValue === 'string') {
          updatedValue = {
            label: updatedValue, // Use the string as the label
            value: updatedValue as ValueType, // Use the string as the value (or any other logic to generate a value)
            isNew: true,
          };
        }
        handleChange(updatedValue);
      }}
      disableListWrap
      freeSolo={!!onCreate || freeSolo}
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      options={options}
      renderOption={(props, option, state) =>
        renderOption(props, option, state)
      }
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label
      }
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label={label}
          slotProps={{
            htmlInput: params.inputProps,
            input: params.InputProps,
            inputLabel: params.InputLabelProps,
          }}
          error={error}
          helperText={helperText}
          {...textFieldProps}
        />
      )}
      filterOptions={filteredOptionsSelect<ValueType>}
    />
  );
};
