import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

import { SelectControllerProps } from './SelectController.types';

export const SelectController = <T extends FieldValues>({
  name,
  control,
  options,
  ...props
}: SelectControllerProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <TextField {...props} select onChange={onChange} value={value}>
          {options?.map(({ labelKey, value }) => (
            <MenuItem key={value} value={value}>
              {t(labelKey)}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};
