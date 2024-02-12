import { useState, MouseEvent, SyntheticEvent } from 'react';

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

import {
  AutocompleteOption,
  TagsAutocompleteControllerProps,
} from './TagsAutocompleteController.types';

export const TagsInputController = <T extends FieldValues>({
  name,
  control,
  options,
  labelAllSelect,
  noOptionsText,
  disabled,
  limitTags,
  defaultSelectedAll = false,
  'data-testid': dataTestid,
  ...props
}: TagsAutocompleteControllerProps<T>) => {
  const [selectedAll, setSelectedAll] = useState<boolean>(defaultSelectedAll);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const handleToggleSelectAll = (e: MouseEvent<HTMLLabelElement>) => {
          e.preventDefault(); // prevent blur
          onChange(options || []);
          setSelectedAll((prev) => {
            if (!prev) onChange(options || []);
            else onChange([]);

            return !prev;
          });
        };

        const handleChange = (
          _e: SyntheticEvent<Element, Event>,
          value: AutocompleteOption[],
          reason: string,
        ) => {
          if (reason === 'clear' || reason === 'removeOption') setSelectedAll(false);
          if (reason === 'selectOption' && value?.length === options?.length) setSelectedAll(true);
          onChange(value);
        };

        return (
          <Autocomplete
            id="autocomplete"
            multiple
            limitTags={limitTags}
            options={options || []}
            fullWidth
            disableCloseOnSelect
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            noOptionsText={<ListItem sx={{ pl: theme.spacing(1.3) }}>{noOptionsText}</ListItem>}
            freeSolo={false}
            value={value || []}
            onChange={handleChange}
            disabled={disabled}
            renderInput={({ InputLabelProps, ...params }) => <TextField {...params} {...props} />}
            renderOption={(props, option, { selected }) => (
              <ListItem {...props}>
                <Checkbox checked={selected} />
                {option.label}
              </ListItem>
            )}
            PaperComponent={(paperProps) => {
              const { children, ...restPaperProps } = paperProps;

              return (
                <Paper {...restPaperProps}>
                  <>
                    {options?.length ? (
                      <ListItem
                        onMouseDown={(event) => event.preventDefault()} // prevent blur
                        sx={{ pl: theme.spacing(2.8) }}
                      >
                        <FormControlLabel
                          onClick={handleToggleSelectAll}
                          label={labelAllSelect}
                          sx={{
                            width: '100%',
                          }}
                          control={<Checkbox id="select-all-checkbox" checked={selectedAll} />}
                        />
                      </ListItem>
                    ) : null}
                    <Divider />
                    {children}
                  </>
                </Paper>
              );
            }}
            data-testid={dataTestid}
          />
        );
      }}
    />
  );
};
