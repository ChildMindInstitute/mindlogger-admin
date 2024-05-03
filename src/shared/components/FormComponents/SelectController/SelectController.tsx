import { useTranslation } from 'react-i18next';
import { Controller, FieldError, FieldValues } from 'react-hook-form';
import { Box } from '@mui/material';
import { useEffect } from 'react';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { SelectEvent } from 'shared/types';
import {
  StyledFlexEnd,
  StyledFlexTopCenter,
  StyledLabelBoldMedium,
  StyledObserverTarget,
  variables,
} from 'shared/styles';
import { groupBy } from 'shared/utils/array';

import {
  StyledPlaceholder,
  StyledItem,
  StyledMenuItem,
  selectDropdownStyles,
  StyledTextField,
  StyledPlaceholderMask,
} from './SelectController.styles';
import {
  SelectControllerProps,
  SelectUiType,
  GetMenuItem,
  Option,
  SelectObserverTargetProps,
} from './SelectController.types';

export const SelectObserverTarget = ({ targetSelector, setTrigger }: SelectObserverTargetProps) => {
  useEffect(() => {
    setTrigger?.(true);

    return () => setTrigger?.(false);
  }, [setTrigger]);

  return <StyledObserverTarget className={targetSelector} />;
};

export const SelectController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  options,
  value: valueProp,
  customChange,
  withChecked,
  withGroups,
  placeholder,
  isLabelNeedTranslation = true,
  uiType = SelectUiType.Primary,
  disabled,
  sx,
  dropdownStyles,
  helperText,
  isErrorVisible = true,
  'data-testid': dataTestid,
  targetSelector,
  setTrigger,
  SelectProps,
  shouldSkipIcon = false,
  ...props
}: SelectControllerProps<T>) => {
  const { t } = useTranslation('app');

  const getMenuItem = (
    { labelKey, value, itemDisabled, icon, withoutKey, hidden }: GetMenuItem,
    selectedValue?: string,
  ) => (
    <StyledMenuItem
      {...(!withoutKey && { key: labelKey })}
      uiType={uiType}
      value={value as string}
      disabled={itemDisabled}
      className={hidden ? 'hidden-menu-item' : ''}
    >
      <StyledItem itemDisabled={itemDisabled} selectDisabled={disabled}>
        {icon && (
          <StyledFlexTopCenter className="icon-wrapper" sx={{ mr: 1.8 }}>
            {icon}
          </StyledFlexTopCenter>
        )}
        {isLabelNeedTranslation ? t(labelKey) : labelKey}
        {withChecked && (
          <StyledFlexEnd className="icon-wrapper" sx={{ ml: 'auto', width: '4rem' }}>
            {selectedValue === value && <Svg id="check" width={24} height={24} />}
          </StyledFlexEnd>
        )}
      </StyledItem>
    </StyledMenuItem>
  );

  const renderOptions = (options?: Option[], selectedValue?: string) =>
    options?.map(({ labelKey, value, icon, disabled = false, tooltip, hidden }) => {
      const commonProps = {
        labelKey,
        value,
        itemDisabled: disabled,
        icon,
        hidden,
      };

      return tooltip ? (
        <Tooltip key={labelKey} tooltipTitle={tooltip}>
          <span>
            {getMenuItem(
              {
                ...commonProps,
                withoutKey: true,
              },
              selectedValue,
            )}
          </span>
        </Tooltip>
      ) : (
        getMenuItem(commonProps, selectedValue)
      );
    });

  const renderGroupedOptions = (selectedValue?: string) => {
    if (!withGroups) return renderOptions(options, selectedValue);

    const groupedOptions = groupBy(options, 'groupKey');

    return Object.keys(groupedOptions).reduce(
      (options: JSX.Element[], groupKey: string) => [
        ...options,
        <StyledMenuItem key={groupKey} uiType={uiType} itemDisabled>
          <StyledLabelBoldMedium sx={{ color: variables.palette.outline }}>
            {t(groupKey)}
          </StyledLabelBoldMedium>
        </StyledMenuItem>,
        ...(renderOptions(groupedOptions[groupKey], selectedValue) ?? []),
      ],
      [],
    );
  };

  const renderSelect = (
    onChange: ((e: SelectEvent) => void) | undefined,
    selectedValue?: string,
    error?: FieldError,
  ) => (
    <Box sx={{ position: 'relative', width: '100%', ...sx }}>
      {placeholder && !selectedValue && (
        <>
          <StyledPlaceholderMask>{placeholder}</StyledPlaceholderMask>
          <StyledPlaceholder>{placeholder}</StyledPlaceholder>
        </>
      )}

      <StyledTextField
        {...props}
        select
        onChange={onChange}
        value={selectedValue}
        error={!!error || providedError}
        helperText={isErrorVisible ? error?.message || helperText : ''}
        disabled={disabled}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { ...selectDropdownStyles, ...dropdownStyles },
              'data-testid': `${dataTestid}-dropdown`,
            },
          },
          IconComponent: shouldSkipIcon
            ? undefined
            : (props) => <Svg className={props.className} id="navigate-down" />,
          ...SelectProps,
          ...(shouldSkipIcon && {
            inputProps: {
              sx: {
                pr: '1.2rem !important',
                minWidth: '94% !important',
              },
            },
          }),
        }}
        data-testid={dataTestid}
      >
        {renderGroupedOptions(selectedValue)}
        {targetSelector && (
          <SelectObserverTarget setTrigger={setTrigger} targetSelector={targetSelector} />
        )}
      </StyledTextField>
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
              (event) => {
                customChange && customChange(event);
                onChange(event);
                setTrigger?.(false);
              },
              value,
              error,
            )
          }
        />
      ) : (
        renderSelect((event) => {
          customChange?.(event);
          setTrigger?.(false);
        }, valueProp)
      )}
    </>
  );
};
