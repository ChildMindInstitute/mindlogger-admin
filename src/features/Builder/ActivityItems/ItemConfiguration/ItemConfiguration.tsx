import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { Svg } from 'components';
import {
  StyledHeadlineLarge,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledBodyMedium,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { TextInputOption } from './TextInputOption';
import { ItemSettingsDrawer, ItemSettingsController } from './Settings';
import { NumberSelection } from './InputTypeItems';
import { StyledTop, StyledInputWrapper } from './ItemConfiguration.styles';
import {
  ItemConfigurationForm,
  ItemConfigurationSettings,
  ItemInputTypes,
} from './ItemConfiguration.types';
import { itemsTypeOptions, DEFAULT_TIMER_VALUE } from './ItemConfiguration.const';

export const ItemConfiguration = () => {
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

  const { t } = useTranslation('app');
  const { control, watch, setValue } = useForm<ItemConfigurationForm>({
    defaultValues: {
      itemsInputType: '',
      settings: [],
      timer: DEFAULT_TIMER_VALUE,
      isTextInputOptionRequired: true,
      minNumber: 1,
      maxNumber: 100,
    },
    mode: 'onChange',
  });

  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
  }, [selectedInputType]);

  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);

  const handleRemoveTextInputOption = () => {
    setValue(
      'settings',
      settings?.filter(
        (settingKey: ItemConfigurationSettings) =>
          settingKey !== ItemConfigurationSettings.HasTextInput,
      ),
    );
  };

  return (
    <StyledFlexColumn>
      <StyledTop>
        <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
        <StyledFlexTopCenter>
          <StyledClearedButton
            sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
            onClick={() => setSettingsDrawerVisible(true)}
          >
            <Svg id="report-configuration" />
          </StyledClearedButton>
          <StyledClearedButton sx={{ p: theme.spacing(1) }}>
            <Svg id="close" />
          </StyledClearedButton>
        </StyledFlexTopCenter>
      </StyledTop>
      <StyledInputWrapper>
        <GroupedSelectSearchController
          name="itemsInputType"
          options={itemsTypeOptions}
          control={control}
        />
        <StyledBodyMedium
          sx={{ m: theme.spacing(0.5, 0, 0, 1.4) }}
          color={variables.palette.on_surface_variant}
        >
          {t('itemTypeDescription')}
        </StyledBodyMedium>
      </StyledInputWrapper>
      {selectedInputType === ItemInputTypes.NumberSelection && (
        <NumberSelection name="minNumber" maxName="maxNumber" control={control} />
      )}
      {isTextInputOptionVisible && (
        <TextInputOption
          name="isTextInputOptionRequired"
          control={control}
          onRemove={handleRemoveTextInputOption}
        />
      )}
      {settingsDrawerVisible && (
        <ItemSettingsDrawer
          open={settingsDrawerVisible}
          onClose={() => setSettingsDrawerVisible(false)}
        >
          <ItemSettingsController
            timerName="timer"
            name="settings"
            inputType={selectedInputType}
            control={control}
          />
        </ItemSettingsDrawer>
      )}
    </StyledFlexColumn>
  );
};
