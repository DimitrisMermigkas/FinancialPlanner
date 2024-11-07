import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { VariableSizeList, ListChildComponentProps } from 'react-window';
import ListSubheader from '@mui/material/ListSubheader';
import {
  useTheme,
  useMediaQuery,
  AutocompleteRenderOptionState,
  Autocomplete,
  Typography,
  FilterOptionsState,
  AutocompleteChangeReason,
} from '@mui/material';

// Common constants
export const LISTBOX_PADDING = 8;
export const OuterElementContext = createContext({});

export const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

// Custom hook for cache reset
export function useResetCache(data: unknown) {
  const ref = useRef<VariableSizeList>(null);
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Render row function
export const renderRow = ({ data, index, style }: ListChildComponentProps) => {
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
      display: 'flex',
    },
  });
};

// Custom ListboxComponent
export const ListboxComponent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
  const itemCount = itemData.length;
  const itemSize = smUp ? 32 : 48;

  // Calculate size of each child
  const getChildSize = (child: React.ReactNode) => {
    if (React.isValidElement(child) && child.type === ListSubheader) {
      return 48;
    }
    return itemSize;
  };

  // Calculate the height of the virtualized list
  const getHeight = () => {
    return itemCount > 8
      ? 8 * itemSize
      : itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

// Common types
export interface Option<ValueType = string | number> {
  label: string;
  value: ValueType;
}

export interface OptionWithIsNew<ValueType = string | number>
  extends Option<ValueType> {
  isNew?: boolean;
}

export interface CustomAutocompleteChangeReason {
  reason?: AutocompleteChangeReason | 'checkboxRemove' | 'checkboxAdd';
}

export interface AutocompleteVirtualizedProps<
  ValueType,
  Multiple extends boolean = false
> extends Omit<
    Partial<React.ComponentProps<typeof Autocomplete>>,
    'onChange' | 'options' | 'value' | 'renderOption' | 'getOptionDisabled'
  > {
  options: OptionWithIsNew<ValueType>[];
  label?: string;
  value: true extends Multiple ? ValueType[] | null : ValueType | null;
  onChange: (
    value: true extends Multiple ? ValueType[] : ValueType | null,
    reason?: CustomAutocompleteChangeReason['reason']
  ) => void;
  error?: boolean;
  helperText?: string;
  textFieldProps?: React.ComponentProps<
    typeof import('../Textfields/CustomTextField').CustomTextField
  >;
  getOptionDisabled?: (option: OptionWithIsNew<ValueType>) => boolean;
  onCreate?: (value: OptionWithIsNew<ValueType>) => void;
  renderOption?: (
    props: object,
    option: OptionWithIsNew<ValueType>,
    state: AutocompleteRenderOptionState
  ) => React.ReactNode;
}

export const renderRows = <ValueType,>(
  props: object,
  option: OptionWithIsNew<ValueType>,
  state: AutocompleteRenderOptionState
) => (
  <li
    {...props}
    key={option.label}
    style={{
      width: '100%',
      backgroundColor: state.selected ? '#f0f0f0' : 'inherit',
      fontWeight: state.selected ? 'bold' : 'normal',
    }}
  >
    <Typography noWrap={true} title={option.label}>
      {option.label}
    </Typography>
  </li>
);
export const filteredOptionsSelect = <ValueType,>(
  options: OptionWithIsNew<ValueType>[],
  state: FilterOptionsState<OptionWithIsNew<ValueType>>
) => {
  const { inputValue } = state;
  // Filter options based on inputValue
  const existingOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const isExisting = options.some((option) => inputValue === option.label);
  // If the inputValue doesn't match an existing option, add a new one
  if (inputValue !== '' && !isExisting) {
    return [
      {
        value: inputValue as ValueType,
        label: `${inputValue} (New)`,
        isNew: true, // Add new option at the end
      },
      ...existingOptions, // Keep the filtered options
    ];
  }

  return existingOptions; // Return filtered options
};
