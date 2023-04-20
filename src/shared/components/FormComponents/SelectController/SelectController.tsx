import { useTranslation } from 'react-i18next';
import { Controller, FieldError, FieldValues } from 'react-hook-form';
import { TextField, Box } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { SelectEvent } from 'shared/types';
import { theme, StyledFlexTopCenter } from 'shared/styles';

import { SelectControllerProps, SelectUiType } from './SelectController.types';
import { StyledPlaceholder, StyledItem, StyledMenuItem } from './SelectController.styles';

export const SelectController = <T extends FieldValues>({
  name,
  control,
  options,
  value: selectValue,
  customChange,
  withChecked,
  placeholder,
  isLabelNeedTranslation = true,
  uiType = SelectUiType.Primary,
  ...props
}: SelectControllerProps<T>) => {
  const { t } = useTranslation('app');

  const getMenuItem = (
    labelKey: string,
    value: string | boolean,
    disabled: boolean,
    icon?: JSX.Element,
    withoutKey?: boolean,
  ) => (
    <StyledMenuItem {...(!withoutKey && { key: labelKey })} uiType={uiType} value={value as string}>
      <StyledItem disabled={disabled}>
        {icon && (
          <StyledFlexTopCenter className="icon-wrapper" sx={{ marginRight: theme.spacing(1.8) }}>
            {icon}
          </StyledFlexTopCenter>
        )}
        {isLabelNeedTranslation ? t(labelKey) : labelKey}
        {withChecked && selectValue === value && (
          <StyledFlexTopCenter className="icon-wrapper" sx={{ marginLeft: theme.spacing(1.6) }}>
            <Svg id="check" />
          </StyledFlexTopCenter>
        )}
      </StyledItem>
    </StyledMenuItem>
  );

  const renderSelect = (
    onChange: ((e: SelectEvent) => void) | undefined,
    selectValue?: string,
    error?: FieldError,
  ) => (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {placeholder && !selectValue && <StyledPlaceholder>{placeholder}</StyledPlaceholder>}
      <TextField
        {...props}
        select
        onChange={onChange}
        value={selectValue}
        error={!!error}
        helperText={error?.message || null}
      >
        {options?.map(({ labelKey, value, icon, disabled = false, tooltip }) =>
          tooltip ? (
            <Tooltip key={labelKey} tooltipTitle={tooltip}>
              {getMenuItem(labelKey, value, disabled, icon, true)}
            </Tooltip>
          ) : (
            getMenuItem(labelKey, value, disabled, icon)
          ),
        )}
      </TextField>
    </Box>
  );

  return (
    <>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) =>
            renderSelect(
              (e) => {
                customChange && customChange(e);
                onChange(e);
              },
              value,
              error,
            )
          }
        />
      ) : (
        renderSelect(customChange, selectValue)
      )}
    </>
  );
};
