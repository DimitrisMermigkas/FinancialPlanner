import React from 'react';
import { Autocomplete } from '@mui/material';
import CustomTextField from '../Textfields/CustomTextField';
import {
  AutocompleteVirtualizedProps,
  filteredOptionsSelect,
  ListboxComponent,
  renderRows,
} from './sharedSelectPropsAndUtils';

export const VirtualizedSelect = <ValueType,>({
  options,
  label,
  value,
  onChange,
  error,
  helperText,
  textfieldProps,
  onCreate,
  freeSolo,
  renderOption = renderRows,
}: AutocompleteVirtualizedProps<ValueType>) => {
  const handleChange = (v: any) => {
    if (onCreate && v?.isNew) onCreate(v.value);
    else {
      onChange && (v ? onChange(v.value) : onChange(null));
    }
  };

  return (
    <Autocomplete
      value={options.find((option) => option.value == value) || null}
      onChange={(_, newValue) => handleChange(newValue)}
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
          {...textfieldProps}
        />
      )}
      filterOptions={filteredOptionsSelect}
    />
  );
};
