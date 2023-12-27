import { useTranslation } from 'react-i18next';
import { Controller, FieldError, FieldValues } from 'react-hook-form';
import { Box } from '@mui/material';
import { useEffect } from 'react';

import { Svg } from 'shared/components/Svg';
import { Tooltip } from 'shared/components/Tooltip';
import { SelectEvent } from 'shared/types';
import {
  StyledFlexTopCenter,
  StyledLabelBoldMedium,
  StyledObserverTarget,
  theme,
  variables,
} from 'shared/styles';
import { groupBy } from 'shared/utils/array';

import {
  StyledPlaceholder,
  StyledItem,
  StyledMenuItem,
  selectDropdownStyles,
  StyledTextField,
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
  value: selectValue,
  customChange,
  withChecked,
  withGroups,
  placeholder,
  isLabelNeedTranslation = true,
  uiType = SelectUiType.Primary,
  disabled,
  sx,
  dropdownStyles,
  isErrorVisible = true,
  'data-testid': dataTestid,
  targetSelector,
  setTrigger,
  ...props
}: SelectControllerProps<T>) => {
  const { t } = useTranslation('app');

  const getMenuItem = ({
    labelKey,
    value,
    itemDisabled,
    icon,
    withoutKey,
    hidden,
  }: GetMenuItem) => (
    <StyledMenuItem
      {...(!withoutKey && { key: labelKey })}
      uiType={uiType}
      value={value as string}
      disabled={itemDisabled}
      className={hidden ? 'hidden-menu-item' : ''}
    >
      <StyledItem itemDisabled={itemDisabled} selectDisabled={disabled}>
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

  const renderOptions = (options?: Option[]) =>
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
          {getMenuItem({
            ...commonProps,
            withoutKey: true,
          })}
        </Tooltip>
      ) : (
        getMenuItem(commonProps)
      );
    });

  const renderGroupedOptions = () => {
    if (!withGroups) return renderOptions(options);

    const groupedOptions = groupBy(options, 'groupKey');

    return Object.keys(groupedOptions).reduce(
      (options: JSX.Element[], groupKey: string) => [
        ...options,
        <StyledMenuItem key={groupKey} uiType={uiType} itemDisabled>
          <StyledLabelBoldMedium sx={{ color: variables.palette.outline }}>
            {t(groupKey)}
          </StyledLabelBoldMedium>
        </StyledMenuItem>,
        ...(renderOptions(groupedOptions[groupKey]) ?? []),
      ],
      [],
    );
  };

  const renderSelect = (
    onChange: ((e: SelectEvent) => void) | undefined,
    selectValue?: string,
    error?: FieldError,
  ) => (
    <Box sx={{ position: 'relative', width: '100%', ...sx }}>
      {placeholder && !selectValue && <StyledPlaceholder>{placeholder}</StyledPlaceholder>}
      <StyledTextField
        {...props}
        select
        onChange={onChange}
        value={selectValue}
        error={!!error || providedError}
        helperText={isErrorVisible ? error?.message || null : ''}
        disabled={disabled}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: { ...selectDropdownStyles, ...dropdownStyles },
              'data-testid': `${dataTestid}-dropdown`,
            },
          },
          IconComponent: (props) => <Svg className={props.className} id="navigate-down" />,
        }}
        data-testid={dataTestid}
      >
        {renderGroupedOptions()}
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
        }, selectValue)
      )}
    </>
  );
};
