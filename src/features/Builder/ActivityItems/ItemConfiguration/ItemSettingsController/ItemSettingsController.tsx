import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, FieldValues } from 'react-hook-form';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

import { Tooltip } from 'components';
import { InputController } from 'components/FormComponents';
import { StyledTitleMedium } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import {
  StyledSettingInfoIcon,
  StyledInputControllerContainer,
  StyledSettingTitleContainer,
} from './ItemSettingsController.styles';
import { ItemSettingsControllerProps } from './ItemSettingsController.types';
import { itemSettingsOptionsByInputType } from './ItemSettingsController.const';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';

export const ItemSettingsController = <T extends FieldValues>({
  name,
  timerName,
  inputType,
  control,
}: ItemSettingsControllerProps<T>) => {
  const { t } = useTranslation('app');

  return inputType ? (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <>
          {itemSettingsOptionsByInputType[inputType]?.map(({ groupName, groupOptions }) => (
            <FormControl sx={{ gap: '1.4rem' }} key={groupName}>
              <FormLabel component="legend" sx={{ color: variables.palette.on_surface }}>
                {t(groupName)}
              </FormLabel>
              <FormGroup sx={{ p: theme.spacing(0, 1.4) }}>
                {groupOptions.map((settingKey) => {
                  const isTimer = settingKey === ItemConfigurationSettings.HasTimer;

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
                      key={`${groupName}-${settingKey}`}
                      control={
                        <Checkbox
                          name={settingKey}
                          checked={value?.includes(settingKey)}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={
                        <StyledSettingTitleContainer withInput={isTimer}>
                          <StyledTitleMedium sx={{ p: theme.spacing(0, 1, 0, 1) }}>
                            {t(settingKey)}
                            <Tooltip tooltipTitle={t(settingKey)}>
                              <span>
                                <StyledSettingInfoIcon id="more-info-outlined" />
                              </span>
                            </Tooltip>
                          </StyledTitleMedium>
                          {isTimer && (
                            <>
                              <StyledInputControllerContainer>
                                <InputController control={control} name={timerName} type="number" />
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
            </FormControl>
          ))}
        </>
      )}
    />
  ) : null;
};
