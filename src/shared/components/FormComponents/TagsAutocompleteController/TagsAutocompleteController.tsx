import { Controller, FieldValues } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';

import { Chip } from 'shared/components';

import { TagsAutocompleteControllerProps } from './TagsAutocompleteController.types';

export const TagsInputController = <T extends FieldValues>({
  name,
  control,
  options,
  onRemove,
  ...props
}: TagsAutocompleteControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value } }) => (
      <Autocomplete
        multiple
        fullWidth
        options={options || []}
        onChange={(event, item) => {
          onChange(item);
        }}
        value={value}
        renderInput={(params) => <TextField {...params} {...props} placeholder="" />}
        renderTags={(value) =>
          value.map((option, index) => (
            <Chip
              color="secondary"
              key={index}
              title={option}
              onRemove={() => onRemove && onRemove(option)}
            />
          ))
        }
      />
    )}
  />
);
