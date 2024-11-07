import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete, AutocompleteRenderOptionState } from '@mui/material';
import CustomTextField from '../Textfields/CustomTextField';
import {
  CustomAutocompleteChangeReason,
  filteredOptionsSelect,
  ListboxComponent,
  OptionWithIsNew,
  Option,
  renderRows,
  AutocompleteVirtualizedProps,
} from './sharedSelectPropsAndUtils';

const renderedListItem = <ValueType,>(
  props: object,
  option: Option<ValueType>,
  state: AutocompleteRenderOptionState,
  handleChange: (
    v: OptionWithIsNew<ValueType>[],
    reason: CustomAutocompleteChangeReason['reason']
  ) => void
) => {
  return (
    <div style={{ display: 'flex' }} key={option.label}>
      <Checkbox
        checked={state.selected}
        onClick={() =>
          handleChange(
            [option],
            state.selected ? 'checkboxRemove' : 'checkboxAdd'
          )
        }
      />
      {renderRows(props, option, state)}
    </div>
  );
};

/**
 * VirtualizedMultipleSelect is a customizable multiple select component built using MUI's Autocomplete,
 * allowing users to select multiple options with checkboxes and the ability to create new options.
 *
 * @param {Option[]} options - The list of options available for selection, each consisting of a label and a value.
 * @param {string} [label] - Optional. The label displayed for the input field.
 * @param {ValueType | null} value - The currently selected values, which should be an array of type defined by ValueType.
 * @param {(value: ValueType[], reason?: CustomAutocompleteChangeReason['reason']) => void} onChange - Callback function invoked when the selected values change, with the new values and an optional reason.
 * @param {boolean} [error] - Optional. Indicates if the component should display an error state.
 * @param {string} [helperText] - Optional. Text displayed below the input field to provide additional context or error messages.
 * @param {React.ComponentProps<typeof CustomTextField>} [textFieldProps] - Optional. Props to be passed to the custom text field used for input.
 * @param {(value: OptionWithIsNew) => void} [onCreate] - Optional. Callback function triggered when a new value is created (for free solo mode).
 * @param {boolean} [freeSolo] - Optional. Allows users to input values that are not in the list of options.
 * @param {(props: any, option: Option, state: AutocompleteRenderOptionState) => React.ReactNode} [renderOption] - Optional. Custom function to render each option in the dropdown.
 * @param {object} [ChipProps] - Optional. Additional props to customize the Chip components rendered for selected options.
 */

export const VirtualizedMultipleSelect = <ValueType extends string | number>({
  options,
  label,
  value,
  onChange,
  error,
  helperText,
  textFieldProps,
  onCreate,
  freeSolo,
  renderOption,
  ChipProps,
}: AutocompleteVirtualizedProps<ValueType, true>) => {
  const handleChange = (
    v: OptionWithIsNew<ValueType>[],
    reason: CustomAutocompleteChangeReason['reason']
  ) => {
    const findNewItem = v.find((item) => item.isNew === true);
    let modifiedNewItem;
    if (findNewItem !== undefined && onCreate) {
      modifiedNewItem = {
        value: findNewItem.value,
        label:
          typeof findNewItem.value === 'string'
            ? findNewItem.value
            : String(findNewItem.value),
      };
      onCreate(modifiedNewItem); // Handle creation of new option
    } else {
      let newValue: ValueType[];
      if (reason === 'checkboxRemove') {
        const checkBoxOption = v[0];
        const updatedOptions = Array.isArray(value) ? value : []; // Ensure value is an array
        newValue = updatedOptions.filter(
          (option) => option !== checkBoxOption.value
        ); // Filter out the option being removed
      } else if (reason === 'checkboxAdd') {
        const checkBoxOption = v[0];
        const updatedOptions = Array.isArray(value) ? value : []; // Ensure value is an array
        newValue = [...updatedOptions, checkBoxOption.value];
      } else newValue = v.map((item) => item.value);
      onChange?.(newValue, reason); // Pass the updated array
    }
  };

  const renderOptionFinal = renderOption ?? renderedListItem;
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      freeSolo={!!onCreate || freeSolo}
      value={
        Array.isArray(value)
          ? options.filter((option) => value.some((v) => v === option.value))
          : [] // Fallback if value is not an array
      }
      onChange={(_, newValue, reason) => {
        const updatedValues = newValue;
        if (reason === 'createOption') {
          // Transform newValues in place
          for (let i = 0; i < updatedValues.length; i++) {
            if (typeof updatedValues[i] === 'string') {
              updatedValues[i] = {
                label: String(updatedValues[i]), // Use the string as the label
                value: updatedValues[i] as ValueType, // Use the string as the value (or any other logic to generate a value)
                isNew: true,
              };
            }
          }
        }
        handleChange(updatedValues as OptionWithIsNew<ValueType>[], reason);
      }}
      disableListWrap
      ListboxComponent={
        ListboxComponent as React.ComponentType<
          React.HTMLAttributes<HTMLElement>
        >
      }
      options={options}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label
      }
      renderOption={(props, option, state) =>
        renderOptionFinal(props, option, state, handleChange)
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
      ChipProps={ChipProps}
      filterOptions={filteredOptionsSelect}
    />
  );
};
