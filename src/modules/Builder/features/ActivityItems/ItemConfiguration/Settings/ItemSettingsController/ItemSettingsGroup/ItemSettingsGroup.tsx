import { ChangeEvent, Fragment, useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { Svg, Tooltip } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { StyledBodyMedium, StyledClearedButton, StyledTitleMedium, theme } from 'shared/styles';
import { ItemResponseType, textLanguageKey } from 'shared/consts';
import {
  SingleAndMultipleSelectMatrix,
  SingleAndMultipleSelectRow,
  SingleAndMultiSelectOption,
  SingleAndMultiSelectRowOption,
  SliderRowsItemResponseValues,
} from 'shared/state';
import { SelectEvent } from 'shared/types';
import { getDefaultSliderScores } from 'modules/Builder/utils/getDefaultSliderScores';
import { getMaxLengthValidationError, toggleBooleanState } from 'shared/utils';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import {
  StyledFormControl,
  StyledFormLabel,
  StyledInputControllerContainer,
  StyledItemSettingGroupContainer,
  StyledItemSettingsGroupHeader,
  StyledSettingInfoIcon,
  StyledSettingTitleContainer,
} from './ItemSettingsGroup.styles';
import { ItemSettingsGroupProps } from './ItemSettingsGroup.types';
import {
  DEFAULT_ACTIVE_TIMER_VALUE,
  ITEM_SETTINGS_TO_HAVE_TOOLTIP,
} from './ItemSettingsGroup.const';
import { isItemTypeWithAlerts } from './ItemSettingsGroup.types';
import {
  DEFAULT_DISABLED_TIMER_VALUE,
  DEFAULT_SCORE_VALUE,
  DEFAULT_TIMER_VALUE,
  SELECT_OPTION_TEXT_MAX_LENGTH_PORTRAIT,
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
  const {
    featureFlags: { enableParagraphTextItem },
  } = useFeatureFlags();

  const { t } = useTranslation('app');
  const { control, setValue, getValues, setError, clearErrors, getFieldState } =
    useCustomFormContext();
  const { fieldName } = useCurrentActivity();

  const subscalesName = `${fieldName}.subscaleSetting.subscales`;
  const config = getValues(`${itemName}.config`) ?? {};
  const activitySkippableName = `${fieldName}.isSkippable`;
  const responseOptionsName = `${itemName}.responseValues.options`;
  const handleTimerChange = (event: SelectEvent) => {
    setValue(
      `${name}.${ItemConfigurationSettings.HasTimer}`,
      +event.target.value || DEFAULT_ACTIVE_TIMER_VALUE,
    );
  };
  const groupNameLangContext =
    enableParagraphTextItem && inputType === ItemResponseType.Text ? textLanguageKey : inputType;

  return (
    <StyledItemSettingGroupContainer
      in={isExpanded}
      timeout={0}
      collapsedSize="4.8rem"
      sx={{ flexShrink: 0 }}
      data-testid={`builder-activity-items-item-settings-group-container-${groupName}`}
    >
      <StyledFormControl>
        <StyledItemSettingsGroupHeader onClick={toggleBooleanState(setIsExpanded)}>
          <StyledFormLabel>{t(groupName, { context: groupNameLangContext })}</StyledFormLabel>
          <StyledClearedButton
            sx={{ p: theme.spacing(1) }}
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
              const isColorPalette = settingKey === ItemConfigurationSettings.HasColorPalette;
              const isNumericalRequired =
                settingKey === ItemConfigurationSettings.IsNumericalRequired;
              const hasResponseDataIdentifier =
                settingKey === ItemConfigurationSettings.HasResponseDataIdentifier;
              const isResponseRequired =
                settingKey === ItemConfigurationSettings.IsResponseRequired;
              const isPortraitLayout = settingKey === ItemConfigurationSettings.PortraitLayout;
              const usePortraitLayout =
                isPortraitLayout && get(config, ItemConfigurationSettings.PortraitLayout);

              const hasTextInput = get(config, ItemConfigurationSettings.HasTextInput);
              const hasResponseRequired = checkIfItemHasRequiredOptions(config);
              const isDisabled =
                (isTextInputRequired && !hasTextInput) || (isSkippableItem && hasResponseRequired);
              const isSecondsDisabled = isTimer && !get(config, ItemConfigurationSettings.HasTimer);

              const hasTooltip = ITEM_SETTINGS_TO_HAVE_TOOLTIP.includes(settingKey);

              const sxProps = isTextInputRequired ? { ml: theme.spacing(2.4) } : {};

              const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
                // set activity skippable to false if any of the below input fields are checked
                if (
                  isCorrectAnswerRequired ||
                  isNumericalRequired ||
                  hasResponseDataIdentifier ||
                  isResponseRequired ||
                  isTextInputRequired
                ) {
                  const checked = event.target.checked;
                  checked && setValue(activitySkippableName, false);
                }

                if (isTimer)
                  return onChange({
                    ...config,
                    [settingKey]: event.target.checked
                      ? DEFAULT_TIMER_VALUE
                      : DEFAULT_DISABLED_TIMER_VALUE,
                  });

                if (isResponseRequired) {
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

                if (isColorPalette) {
                  const hasColorPalette = event.target.checked;

                  onChange({
                    ...config,
                    [settingKey]: hasColorPalette,
                  });

                  if (
                    inputType === ItemResponseType.SingleSelection ||
                    inputType === ItemResponseType.MultipleSelection
                  ) {
                    if (hasColorPalette) return;

                    setValue(
                      responseOptionsName,
                      getValues(responseOptionsName)?.map((option: SingleAndMultiSelectOption) => ({
                        ...option,
                        color: undefined,
                      })),
                    );
                    setValue(`${itemName}.responseValues.paletteName`, undefined);
                  }
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
                        responseOptionsName,
                        getValues(responseOptionsName)?.map(
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
                        options: getValues(responseOptionsName)?.map(
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

                if (isAlerts && isItemTypeWithAlerts(inputType)) {
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

                if (isPortraitLayout) {
                  const responseOptions = getValues(
                    responseOptionsName,
                  ) as SingleAndMultiSelectOption[];
                  const maxLengthErrorMessage = getMaxLengthValidationError({
                    max: SELECT_OPTION_TEXT_MAX_LENGTH_PORTRAIT,
                  });

                  responseOptions?.forEach((option, index) => {
                    const optionTextPath = `${responseOptionsName}.${index}.text`;
                    const optionTextLength = option?.text?.length || 0;
                    const currentErrorMessage = getFieldState(optionTextPath)?.error?.message;

                    if (
                      event.target.checked &&
                      optionTextLength > SELECT_OPTION_TEXT_MAX_LENGTH_PORTRAIT
                    ) {
                      setError(optionTextPath, {
                        message: maxLengthErrorMessage,
                      });
                    } else if (currentErrorMessage === maxLengthErrorMessage) {
                      clearErrors(optionTextPath);
                    }
                  });
                }

                onChange({
                  ...config,
                  [settingKey]: event.target.checked,
                });
              };

              return (
                <Fragment key={`${groupName}-${settingKey}`}>
                  <FormControlLabel
                    sx={sxProps}
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
                  {usePortraitLayout && (
                    <StyledBodyMedium sx={{ fontStyle: 'italic' }}>
                      {t('itemSettings.portraitLayout_subtext')}
                    </StyledBodyMedium>
                  )}
                </Fragment>
              );
            })}
          </FormGroup>
        )}
      </StyledFormControl>
    </StyledItemSettingGroupContainer>
  );
};
