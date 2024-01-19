import { useState, ChangeEvent } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { Tooltip, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, StyledTitleMedium, StyledClearedButton } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import {
  SingleAndMultipleSelectMatrix,
  SingleAndMultiSelectOption,
  SingleAndMultiSelectRowOption,
  SingleAndMultipleSelectRow,
  SliderRowsItemResponseValues,
} from 'shared/state';
import { SelectEvent } from 'shared/types';
import { getDefaultSliderScores } from 'modules/Builder/utils/getDefaultSliderScores';

import {
  StyledFormControl,
  StyledSettingInfoIcon,
  StyledSettingTitleContainer,
  StyledInputControllerContainer,
  StyledItemSettingsGroupHeader,
  StyledItemSettingGroupContainer,
  StyledFormLabel,
} from './ItemSettingsGroup.styles';
import { ItemSettingsGroupProps } from './ItemSettingsGroup.types';
import {
  DEFAULT_ACTIVE_TIMER_VALUE,
  ITEM_SETTINGS_TO_HAVE_TOOLTIP,
  ITEM_TYPES_TO_HAVE_ALERTS,
} from './ItemSettingsGroup.const';
import {
  DEFAULT_TIMER_VALUE,
  DEFAULT_DISABLED_TIMER_VALUE,
  DEFAULT_SCORE_VALUE,
} from '../../../ItemConfiguration.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { checkIfItemHasRequiredOptions, getEmptyAlert } from '../../../ItemConfiguration.utils';
import { removeItemFromSubscales } from './ItemSettingsGroup.utils';

export const ItemSettingsGroup = ({
  name,
  onChange,
  itemName,
  groupName,
  inputType,
  groupOptions,
  collapsedByDefault,
}: ItemSettingsGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(!collapsedByDefault);

  const { t } = useTranslation('app');
  const { control, setValue, getValues } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();

  const subscalesName = `${fieldName}.subscaleSetting.subscales`;
  const config = getValues(`${itemName}.config`) ?? {};

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);
  const handleTimerChange = (event: SelectEvent) => {
    setValue(
      `${name}.${ItemConfigurationSettings.HasTimer}`,
      +event.target.value || DEFAULT_ACTIVE_TIMER_VALUE,
    );
  };

  return (
    <StyledItemSettingGroupContainer
      in={isExpanded}
      timeout={0}
      collapsedSize="4.8rem"
      sx={{ flexShrink: 0 }}
      data-testid={`builder-activity-items-item-settings-group-container-${groupName}`}
    >
      <StyledFormControl>
        <StyledItemSettingsGroupHeader sx={{ justifyContent: 'space-between' }}>
          <StyledFormLabel>{t(groupName, { context: inputType })}</StyledFormLabel>
          <StyledClearedButton
            sx={{ p: theme.spacing(1) }}
            onClick={handleCollapse}
            data-testid="builder-activity-items-item-settings-group-collapse"
          >
            <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
        </StyledItemSettingsGroupHeader>
        {isExpanded && (
          <FormGroup sx={{ p: theme.spacing(0, 1.4) }}>
            {groupOptions.map((settingKey) => {
              const isMultiOrSingleRows =
                inputType === ItemResponseType.SingleSelectionPerRow ||
                inputType === ItemResponseType.MultipleSelectionPerRow;
              const isTimer = settingKey === ItemConfigurationSettings.HasTimer;
              const isTextInput = settingKey === ItemConfigurationSettings.HasTextInput;
              const isTextInputRequired =
                settingKey === ItemConfigurationSettings.IsTextInputRequired;
              const isSkippableItem = settingKey === ItemConfigurationSettings.IsSkippable;
              const isCorrectAnswerRequired =
                settingKey === ItemConfigurationSettings.IsCorrectAnswerRequired;
              const isScores = settingKey === ItemConfigurationSettings.HasScores;
              const isAlerts = settingKey === ItemConfigurationSettings.HasAlerts;

              const hasTextInput = get(config, ItemConfigurationSettings.HasTextInput);
              const hasResponseRequired = checkIfItemHasRequiredOptions(config);
              const isDisabled =
                (isTextInputRequired && !hasTextInput) || (isSkippableItem && hasResponseRequired);
              const isSecondsDisabled = isTimer && !get(config, ItemConfigurationSettings.HasTimer);

              const hasTooltip = ITEM_SETTINGS_TO_HAVE_TOOLTIP.includes(settingKey);

              const sxProps = isTextInputRequired ? { ml: theme.spacing(2.4) } : {};

              const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
                if (isTimer)
                  return onChange({
                    ...config,
                    [settingKey]: event.target.checked
                      ? DEFAULT_TIMER_VALUE
                      : DEFAULT_DISABLED_TIMER_VALUE,
                  });

                if (settingKey === ItemConfigurationSettings.IsResponseRequired) {
                  return onChange({
                    ...config,
                    [settingKey]: event.target.checked,
                    [ItemConfigurationSettings.IsSkippable]: false,
                  });
                }

                if (isTextInput || isTextInputRequired) {
                  const [prefix, postfix] = settingKey.split('.');
                  const [, textInputRequired] =
                    ItemConfigurationSettings.IsTextInputRequired.split('.');
                  const value = event.target.checked;

                  return onChange({
                    ...config,
                    [prefix]: {
                      ...config?.[prefix],
                      [postfix]: value,
                      ...(isTextInput && !value && { [textInputRequired]: false }),
                    },
                  });
                }

                if (isCorrectAnswerRequired) {
                  const checked = event.target.checked;

                  return onChange({
                    ...config,
                    [settingKey]: checked,
                    correctAnswer: checked ? '' : undefined,
                  });
                }

                if (isScores) {
                  const hasScores = event.target.checked;

                  if (!hasScores) {
                    removeItemFromSubscales({
                      setValue,
                      subscales: getValues(subscalesName),
                      item: getValues(itemName),
                      subscalesName,
                    });
                  }

                  onChange({
                    ...config,
                    [settingKey]: hasScores,
                  });

                  switch (inputType) {
                    case ItemResponseType.SliderRows:
                      return setValue(
                        `${itemName}.responseValues.rows`,
                        getValues(`${itemName}.responseValues.rows`)?.map(
                          (sliderRow: SliderRowsItemResponseValues) => ({
                            ...sliderRow,
                            scores: hasScores ? getDefaultSliderScores(sliderRow) : undefined,
                          }),
                        ),
                      );
                    case ItemResponseType.Slider:
                      return setValue(
                        `${itemName}.responseValues.scores`,
                        hasScores
                          ? getDefaultSliderScores(getValues(`${itemName}.responseValues`))
                          : undefined,
                      );
                    case ItemResponseType.SingleSelection:
                    case ItemResponseType.MultipleSelection:
                      return setValue(
                        `${itemName}.responseValues.options`,
                        getValues(`${itemName}.responseValues.options`)?.map(
                          (option: SingleAndMultiSelectOption) => ({
                            ...option,
                            score: hasScores ? DEFAULT_SCORE_VALUE : undefined,
                          }),
                        ),
                      );
                  }
                }

                if ((isScores || isAlerts) && isMultiOrSingleRows) {
                  const hasScores = isScores
                    ? event.target.checked
                    : get(config, ItemConfigurationSettings.HasScores);
                  const hasAlerts = isAlerts
                    ? event.target.checked
                    : get(config, ItemConfigurationSettings.HasAlerts);

                  const dataMatrix = getValues(`${itemName}.responseValues.dataMatrix`);

                  const updatedMatrix = dataMatrix
                    ? dataMatrix.map(({ rowId, options }: SingleAndMultipleSelectMatrix) => ({
                        rowId,
                        options: options?.map(({ optionId, score }) => ({
                          ...(hasScores && { score: score ?? DEFAULT_SCORE_VALUE }),
                          optionId,
                        })),
                      }))
                    : undefined;
                  const newMatrix =
                    updatedMatrix ??
                    getValues(`${itemName}.responseValues.rows`)?.map(
                      (row: SingleAndMultipleSelectRow) => ({
                        rowId: row.id,
                        options: getValues(`${itemName}.responseValues.options`)?.map(
                          (option: SingleAndMultiSelectRowOption) => ({
                            optionId: option.id,
                            ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
                          }),
                        ),
                      }),
                    );

                  setValue(
                    `${itemName}.responseValues.dataMatrix`,
                    hasScores || hasAlerts ? newMatrix : undefined,
                  );
                }

                if (isAlerts && ~ITEM_TYPES_TO_HAVE_ALERTS.indexOf(inputType as ItemResponseType)) {
                  const hasAlerts = event.target.checked;

                  setValue(
                    `${itemName}.alerts`,
                    hasAlerts
                      ? [
                          getEmptyAlert({
                            responseType: inputType,
                            responseValues: getValues(`${itemName}.responseValues`),
                            config,
                          }),
                        ]
                      : undefined,
                  );
                }

                onChange({
                  ...config,
                  [settingKey]: event.target.checked,
                });
              };

              return (
                <FormControlLabel
                  sx={sxProps}
                  key={`${groupName}-${settingKey}`}
                  control={
                    <Checkbox
                      name={settingKey}
                      checked={!!get(config, settingKey)}
                      onChange={handleCheckboxChange}
                      disabled={isDisabled}
                    />
                  }
                  data-testid={`builder-activity-items-item-settings-${settingKey}`}
                  label={
                    <StyledSettingTitleContainer withInput={isTimer}>
                      <StyledTitleMedium sx={{ p: theme.spacing(0, 1), whiteSpace: 'nowrap' }}>
                        {t(`itemSettings.${settingKey}`)}
                        {hasTooltip && (
                          <Tooltip
                            tooltipTitle={t(`itemSettings.${settingKey}`, { context: 'tooltip' })}
                            placement="top"
                          >
                            <span>
                              <StyledSettingInfoIcon id="more-info-outlined" />
                            </span>
                          </Tooltip>
                        )}
                      </StyledTitleMedium>
                      {isTimer && (
                        <>
                          <StyledInputControllerContainer>
                            <InputController
                              control={control}
                              key={`timer-${isSecondsDisabled}`}
                              name={`${name}.${ItemConfigurationSettings.HasTimer}`}
                              type="number"
                              disabled={isSecondsDisabled}
                              minNumberValue={
                                isSecondsDisabled
                                  ? DEFAULT_DISABLED_TIMER_VALUE
                                  : DEFAULT_ACTIVE_TIMER_VALUE
                              }
                              data-testid={`builder-activity-items-item-settings-${settingKey}-input`}
                              onChange={handleTimerChange}
                            />
                          </StyledInputControllerContainer>
                          <StyledTitleMedium>{t('seconds')}</StyledTitleMedium>
                        </>
                      )}
                    </StyledSettingTitleContainer>
                  }
                />
              );
            })}
          </FormGroup>
        )}
      </StyledFormControl>
    </StyledItemSettingGroupContainer>
  );
};
