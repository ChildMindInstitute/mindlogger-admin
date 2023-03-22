import { useState, ChangeEvent } from 'react';
import { FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import {
  ItemConfigurationSettings,
  DEFAULT_TIMER_VALUE,
} from 'modules/Builder/features/ActivityItems/ItemConfiguration';
import { Tooltip, Svg } from 'shared/components';
import { InputController } from 'shared/components/FormComponents';
import { theme, variables, StyledTitleMedium, StyledClearedButton } from 'shared/styles';

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

export const ItemSettingsGroup = ({
  value,
  onChange,
  groupName,
  inputType,
  groupOptions,
}: ItemSettingsGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const { t } = useTranslation('app');

  const { control, watch } = useFormContext();

  const settings = watch('settings');

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

              const isDisabled =
                (isTextInputRequired &&
                  !settings?.includes(ItemConfigurationSettings.HasTextInput)) ||
                (isSkippableItem &&
                  settings?.includes(ItemConfigurationSettings.IsTextInputRequired));
              const isSecondsDisabled =
                isTimer && !settings?.includes(ItemConfigurationSettings.HasTimer);

              const hasTooltip = ITEM_SETTINGS_TO_HAVE_TOOLTIP.includes(settingKey);

              const sxProps = isTextInputRequired ? { ml: theme.spacing(2.4) } : {};

              const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.checked && !value?.includes(settingKey))
                  onChange([...value, settingKey]);

                if (!event.target.checked && value?.includes(settingKey))
                  onChange(
                    value.filter(
                      (selectedSetting: ItemConfigurationSettings) =>
                        selectedSetting !== settingKey,
                    ),
                  );
              };

              return (
                <FormControlLabel
                  sx={sxProps}
                  key={`${groupName}-${settingKey}`}
                  control={
                    <Checkbox
                      name={settingKey}
                      checked={value?.includes(settingKey)}
                      onChange={handleCheckboxChange}
                      disabled={isDisabled}
                    />
                  }
                  label={
                    <StyledSettingTitleContainer withInput={isTimer}>
                      <StyledTitleMedium sx={{ p: theme.spacing(0, 1, 0, 1) }}>
                        {t(settingKey)}
                        {hasTooltip && (
                          <Tooltip
                            tooltipTitle={t(settingKey, { context: 'tooltip' })}
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
                              name="timer"
                              type="number"
                              disabled={isSecondsDisabled}
                              minNumberValue={isSecondsDisabled ? DEFAULT_TIMER_VALUE : undefined}
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
