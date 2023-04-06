import { useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import {
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
  ListItem,
} from '@mui/material';

import { theme } from 'shared/styles';

import { TagsAutocompleteControllerProps } from './TagsAutocompleteController.types';

export const TagsInputController = <T extends FieldValues>({
  name,
  control,
  options,
  labelAllSelect,
  noOptionsText,
  ...props
}: TagsAutocompleteControllerProps<T>) => {
  const [selectedAll, setSelectedAll] = useState<boolean>(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleToggleSelectAll = () => {
          onChange(options || []);
          setSelectedAll((prev) => {
            if (!prev) onChange(options || []);
            else onChange([]);

            return !prev;
          });
        };

        return (
          <Autocomplete
            id="autocomplete"
            multiple
            options={options || []}
            fullWidth
            disableCloseOnSelect
            filterSelectedOptions
            noOptionsText={<ListItem sx={{ pl: theme.spacing(1.3) }}>{noOptionsText}</ListItem>}
            freeSolo={false}
            value={value || []}
            onChange={(_e, value, reason) => {
              if (reason === 'clear' || reason === 'removeOption') setSelectedAll(false);
              if (reason === 'selectOption' && value?.length === options?.length)
                setSelectedAll(true);
              onChange(value);
            }}
            renderInput={(params) => <TextField {...params} {...props} />}
            renderOption={(props, option, { selected }) => (
              <ListItem {...props}>
                <Checkbox checked={selected} />
                {option}
              </ListItem>
            )}
            PaperComponent={(paperProps) => {
              const { children, ...restPaperProps } = paperProps;

              return (
                <Paper {...restPaperProps}>
                  <ListItem
                    onMouseDown={(e) => e.preventDefault()} // prevent blur
                    sx={{ pl: theme.spacing(2.8) }}
                  >
                    <FormControlLabel
                      onClick={(e) => {
                        e.preventDefault(); // prevent blur
                        handleToggleSelectAll();
                      }}
                      label={labelAllSelect}
                      sx={{
                        width: '100%',
                      }}
                      control={<Checkbox id="select-all-checkbox" checked={selectedAll} />}
                    />
                  </ListItem>
                  <Divider />
                  {children}
                </Paper>
              );
            }}
          />
        );
      }}
    />
  );
};
