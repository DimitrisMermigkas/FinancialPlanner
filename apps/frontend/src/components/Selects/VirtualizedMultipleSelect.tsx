import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { Autocomplete, AutocompleteRenderOptionState } from '@mui/material';
import CustomTextField from '../Textfields/CustomTextField';
import {
  AutocompleteVirtualizedProps,
  CustomAutocompleteChangeReason,
  ListboxComponent,
  Option,
  renderRows,
} from './sharedSelectPropsAndUtils';

const renderedListItem = (
  props: any,
  option: Option,
  state: AutocompleteRenderOptionState,
  handleChange: (
    v: any,
    reason: CustomAutocompleteChangeReason['reason']
  ) => void
) => {
  return (
    <div style={{ display: 'flex' }}>
      <Checkbox
        checked={state.selected}
        onClick={() =>
          handleChange(
            option,
            state.selected ? 'checkboxRemove' : 'checkboxAdd'
          )
        }
      />
      {renderRows(props, option, state)}
    </div>
  );
};

export const VirtualizedMultipleSelect = <ValueType,>({
  options,
  label,
  value,
  onChange,
  error,
  helperText,
  textfieldProps,
  onCreate,
  freeSolo,
  renderOption,
  ChipProps,
}: AutocompleteVirtualizedProps<ValueType>) => {
  const handleChange = (
    v: any,
    reason: CustomAutocompleteChangeReason['reason']
  ) => {
    if (onCreate && v?.isNew) {
      onCreate(v.value); // Handle creation of new option
    } else {
      let passedValue = v;
      if (reason === 'checkboxRemove') {
        const updatedOptions = Array.isArray(value) ? value : []; // Ensure value is an array
        passedValue = updatedOptions.filter(
          (option) => option.value !== v.value
        ); // Filter out the option being removed
      } else if (reason == 'checkboxAdd') {
        const updatedOptions = Array.isArray(value) ? value : []; // Ensure value is an array
        passedValue = [...updatedOptions, v];
      } else passedValue = v;
      onChange && onChange(passedValue, reason); // Pass the updated array
    }
  };

  const renderOptionFinal = renderOption ?? renderedListItem;
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      value={
        Array.isArray(value)
          ? options.filter((option) =>
              value.some((v) => v.value === option.value)
            )
          : [] // Fallback if value is not an array
      }
      onChange={(_, newValue, reason) => handleChange(newValue, reason)}
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
          {...textfieldProps}
        />
      )}
      ChipProps={ChipProps}
    />
  );
};
