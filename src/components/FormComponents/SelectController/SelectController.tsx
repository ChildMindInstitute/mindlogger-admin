import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

import { SelectEvent } from 'types/event';

import { SelectControllerProps } from './SelectController.types';

export const SelectController = <T extends FieldValues>({
  name,
  control,
  options,
  value,
  customChange,
  ...props
}: SelectControllerProps<T>) => {
  const { t } = useTranslation('app');

  const renderSelect = (
    onChange: ((e: SelectEvent) => void) | undefined,
    value: string | undefined,
  ) => (
    <TextField {...props} select onChange={onChange} value={value}>
      {options?.map(({ labelKey, value, icon }) => (
        <MenuItem key={labelKey} value={value as string}>
          {icon || ''} {t(labelKey)}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value } }) =>
            renderSelect((e) => {
              customChange && customChange(e);
              onChange(e);
            }, value)
          }
        />
      ) : (
        renderSelect(customChange, value)
      )}
    </>
  );
};
