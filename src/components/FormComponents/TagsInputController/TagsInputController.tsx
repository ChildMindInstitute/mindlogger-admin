import { Controller, FieldValues } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';

import { TagsInputControllerProps } from './TagsInputController.types';

export const TagsInputController = <T extends FieldValues>({
  name,
  control,
  options,
  ...props
}: TagsInputControllerProps<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value } }) => (
      <Autocomplete
        multiple
        fullWidth
        options={options || []}
        freeSolo
        onChange={(event, item) => {
          onChange(item);
        }}
        value={value}
        renderInput={(params) => <TextField {...params} {...props} placeholder="" />}
      />
    )}
  />
);
