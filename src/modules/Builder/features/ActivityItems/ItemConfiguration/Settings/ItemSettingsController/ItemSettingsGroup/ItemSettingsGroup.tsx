import { useState, ChangeEvent } from 'react';
import { FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Tooltip, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, variables, StyledTitleMedium, StyledClearedButton } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';
import {
  SingleAndMultipleSelectOption,
  SingleAndMultipleSelectRow,
  SingleAndMultipleSelectionOption,
  SliderRowsItemResponseValues,
} from 'shared/state';

import {
  StyledFormControl,
  StyledSettingInfoIcon,
  StyledSettingTitleContainer,
  StyledInputControllerContainer,
  StyledItemSettingsGroupHeader,
  StyledItemSettingGroupContainer,
} from './ItemSettingsGroup.styles';
import { ItemSettingsGroupProps } from './ItemSettingsGroup.types';
import { ITEM_SETTINGS_TO_HAVE_TOOLTIP } from './ItemSettingsGroup.const';
import {
  DEFAULT_TIMER_VALUE,
  DEFAULT_DISABLED_TIMER_VALUE,
  DEFAULT_SCORE_VALUE,
} from '../../../ItemConfiguration.const';
import { ItemConfigurationSettings } from '../../../ItemConfiguration.types';
import { getDefaultSliderScores } from '../../../ItemConfiguration.utils';

export const ItemSettingsGroup = ({
  name,
  value,
  onChange,
  itemName,
  groupName,
  inputType,
  groupOptions,
  collapsedByDefault,
}: ItemSettingsGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(!collapsedByDefault);

  const { t } = useTranslation('app');
  const { control, setValue, getValues } = useFormContext();

  const handleCollapse = () => setIsExpanded((prevExpanded) => !prevExpanded);

  return (
    <StyledItemSettingGroupContainer
      in={isExpanded}
      timeout={0}
      collapsedSize="4.8rem"
      sx={{ flexShrink: 0 }}
    >
      <StyledFormControl>
        <StyledItemSettingsGroupHeader sx={{ justifyContent: 'space-between' }}>
          <FormLabel component="legend" sx={{ color: variables.palette.on_surface }}>
            {t(groupName, { context: inputType })}
          </FormLabel>
          <StyledClearedButton sx={{ p: theme.spacing(1) }} onClick={handleCollapse}>
            <Svg id={isExpanded ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
        </StyledItemSettingsGroupHeader>
        {isExpanded && (
          <FormGroup sx={{ p: theme.spacing(0, 1.4) }}>
            {groupOptions.map((settingKey) => {
              const isTimer = settingKey === ItemConfigurationSettings.HasTimer;
              const isTextInputRequired =
                settingKey === ItemConfigurationSettings.IsTextInputRequired;
              const isSkippableItem = settingKey === ItemConfigurationSettings.IsSkippable;
              const isCorrectAnswerRequired =
                settingKey === ItemConfigurationSettings.IsCorrectAnswerRequired;
              const isScores = settingKey === ItemConfigurationSettings.HasScores;

              const isDisabled =
                (isTextInputRequired && !get(value, ItemConfigurationSettings.HasTextInput)) ||
                (isSkippableItem && get(value, ItemConfigurationSettings.IsTextInputRequired));
              const isSecondsDisabled = isTimer && !get(value, ItemConfigurationSettings.HasTimer);

              const hasTooltip = ITEM_SETTINGS_TO_HAVE_TOOLTIP.includes(settingKey);

              const sxProps = isTextInputRequired ? { ml: theme.spacing(2.4) } : {};

              const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
                if (isTimer)
                  return onChange({
                    ...value,
                    [settingKey]: event.target.checked
                      ? DEFAULT_TIMER_VALUE
                      : DEFAULT_DISABLED_TIMER_VALUE,
                  });

                if (
                  settingKey === ItemConfigurationSettings.HasTextInput ||
                  settingKey === ItemConfigurationSettings.IsTextInputRequired
                ) {
                  const [prefix, postfix] = settingKey.split('.');

                  return onChange({
                    ...value,
                    [prefix]: {
                      ...value?.[prefix],
                      [postfix]: event.target.checked,
                    },
                  });
                }

                if (isCorrectAnswerRequired) {
                  const checked = event.target.checked;

                  return onChange({
                    ...value,
                    [settingKey]: checked,
                    correctAnswer: checked ? '' : undefined,
                  });
                }

                if (isScores) {
                  const hasScores = event.target.checked;

                  onChange({
                    ...value,
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
                          (option: SingleAndMultipleSelectionOption) => ({
                            ...option,
                            score: hasScores ? DEFAULT_SCORE_VALUE : undefined,
                          }),
                        ),
                      );
                    case ItemResponseType.SingleSelectionPerRow:
                    case ItemResponseType.MultipleSelectionPerRow:
                      return setValue(
                        `${itemName}.responseValues.dataMatrix`,
                        hasScores
                          ? getValues(`${itemName}.responseValues.rows`)?.map(
                              (row: SingleAndMultipleSelectRow) => ({
                                rowId: row.id,
                                options: getValues(`${itemName}.responseValues.options`)?.map(
                                  (option: SingleAndMultipleSelectOption) => ({
                                    optionId: option.id,
                                    score: DEFAULT_SCORE_VALUE,
                                  }),
                                ),
                              }),
                            )
                          : undefined,
                      );
                  }
                }

                onChange({
                  ...value,
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
                      checked={!!get(value, settingKey)}
                      onChange={handleCheckboxChange}
                      disabled={isDisabled}
                    />
                  }
                  label={
                    <StyledSettingTitleContainer withInput={isTimer}>
                      <StyledTitleMedium sx={{ p: theme.spacing(0, 1, 0, 1) }}>
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
                              minNumberValue={isSecondsDisabled ? DEFAULT_DISABLED_TIMER_VALUE : 1}
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
