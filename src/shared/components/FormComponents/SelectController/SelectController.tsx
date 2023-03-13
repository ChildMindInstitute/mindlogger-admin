import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';

import { Svg } from 'shared/components';
import { SelectEvent } from 'shared/types/event';
import theme from 'shared/styles/theme';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { SelectControllerProps } from './SelectController.types';

export const SelectController = <T extends FieldValues>({
  name,
  control,
  options,
  value: selectValue,
  customChange,
  withChecked,
  ...props
}: SelectControllerProps<T>) => {
  const { t } = useTranslation('app');

  const renderSelect = (onChange: ((e: SelectEvent) => void) | undefined, selectValue?: string) => (
    <TextField {...props} select onChange={onChange} value={selectValue}>
      {options?.map(({ labelKey, value, icon }) => (
        <MenuItem key={labelKey} value={value as string}>
          <StyledFlexTopCenter>
            {icon && (
              <StyledFlexTopCenter
                className="icon-wrapper"
                sx={{ marginRight: theme.spacing(1.8) }}
              >
                {icon}
              </StyledFlexTopCenter>
            )}
            {t(labelKey)}
            {withChecked && selectValue === value && (
              <StyledFlexTopCenter className="icon-wrapper" sx={{ marginLeft: theme.spacing(1.6) }}>
                <Svg id="check" />
              </StyledFlexTopCenter>
            )}
          </StyledFlexTopCenter>
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
        renderSelect(customChange, selectValue)
      )}
    </>
  );
};
