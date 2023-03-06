import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import uniqueId from 'lodash.uniqueid';

import { Svg } from 'components';
import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
} from 'styles/styledComponents';
import theme from 'styles/theme';
import { variables } from 'styles/variables';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { ItemSettingsDrawer } from './ItemSettingsDrawer';
import { ItemSettingsController } from './ItemSettingsController';
import { SelectionOption } from './SelectionOption';
import {
  StyledTop,
  StyledInputWrapper,
  StyledInputWrapper,
  StyledOptionsWrapper,
} from './ItemConfiguration.styles';
import {
  ItemConfigurationForm,
  ItemConfigurationForm,
  ItemInputTypes,
} from './ItemConfiguration.types';
import { itemsTypeOptions, DEFAULT_TIMER_VALUE } from './ItemConfiguration.const';

export const ItemConfiguration = () => {
  const { t } = useTranslation('app');
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const { control, watch, setValue } = useForm<ItemConfigurationForm>({
    defaultValues: { itemsInputType: '', settings: [], timer: DEFAULT_TIMER_VALUE },
    mode: 'onChange',
  });

  const {
    fields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: 'options',
  });

  const selectedInputType = watch('itemsInputType');
  const options = watch('options');

  const hasOptions =
    selectedInputType === ItemInputTypes.SingleSelection ||
    selectedInputType === ItemInputTypes.MultipleSelection;

  const handleAddOption = () =>
    appendOption({
      text: '',
      isVisible: true,
    });

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
  }, [selectedInputType]);

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
      {hasOptions && (
        <StyledOptionsWrapper>
          {options?.length
            ? options.map((option, index) => (
                <SelectionOption
                  key={uniqueId()}
                  removeOption={removeOption}
                  index={index}
                  {...option}
                />
              ))
            : null}
          <Button
            onClick={handleAddOption}
            variant="outlined"
            startIcon={<Svg id="add" width="20" height="20" />}
          >
            {t('addOption')}
          </Button>
        </StyledOptionsWrapper>
      )}
    </StyledFlexColumn>
  );
};
