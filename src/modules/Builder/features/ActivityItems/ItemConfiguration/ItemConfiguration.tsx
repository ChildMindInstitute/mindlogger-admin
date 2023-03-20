import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@mui/material';

import { Svg } from 'shared/components';
import { EditorController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledHeadlineLarge,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { ItemInputTypes } from 'shared/types';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { TextInputOption } from './TextInputOption';
import { Alerts } from './Alerts';
import { ItemSettingsController, ItemSettingsDrawer } from './Settings';
import {
  AudioPlayer,
  SelectionOption,
  NumberSelection,
  TimeRange,
  VideoResponse,
  PhotoResponse,
  Date,
  SliderRows,
  AudioRecord,
  Geolocation,
  TextResponse,
  SelectionRows,
} from './InputTypeItems';
import {
  StyledContent,
  StyledHeader,
  StyledInputWrapper,
  StyledItemConfiguration,
  StyledOptionsWrapper,
} from './ItemConfiguration.styles';
import { ItemConfigurationForm, ItemConfigurationSettings } from './ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE, itemsTypeOptions } from './ItemConfiguration.const';
import { useSettingsSetup } from './ItemConfiguration.hooks';
import { getInputTypeTooltip } from './ItemConfiguration.utils';

export const ItemConfiguration = () => {
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { t } = useTranslation('app');

  const methods = useForm<ItemConfigurationForm>({
    defaultValues: {
      itemsInputType: '',
      name: '',
      body: '',
      settings: [],
    },
    mode: 'onChange',
  });

  const { control, watch, setValue, getValues } = methods;

  const {
    fields: options,
    append: appendOption,
    remove: removeOptions,
    update: updateOptions,
  } = useFieldArray({
    control,
    name: 'options',
  });

  const {
    fields: alerts,
    append: appendAlert,
    remove: removeAlert,
  } = useFieldArray({
    control,
    name: 'alerts',
  });

  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');

  const hasOptions =
    selectedInputType === ItemInputTypes.SingleSelection ||
    selectedInputType === ItemInputTypes.MultipleSelection;

  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
  const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);
  const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);

  const handleAddOption = () =>
    appendOption({
      text: '',
      isVisible: true,
      ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
    });

  const handleRemoveTextInputOption = () => {
    setValue(
      'settings',
      settings?.filter(
        (settingKey: ItemConfigurationSettings) =>
          settingKey !== ItemConfigurationSettings.HasTextInput,
      ),
    );
  };

  useSettingsSetup({ control, setValue, getValues, watch });

  return (
    <FormProvider {...methods}>
      <StyledItemConfiguration ref={containerRef}>
        <StyledHeader isSticky={isHeaderSticky}>
          <StyledHeadlineLarge>{t('itemConfiguration')}</StyledHeadlineLarge>
          <StyledFlexTopCenter>
            {selectedInputType && (
              <StyledClearedButton
                sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
                onClick={() => setSettingsDrawerVisible(true)}
              >
                <Svg id="report-configuration" />
              </StyledClearedButton>
            )}
            <StyledClearedButton sx={{ p: theme.spacing(1) }}>
              <Svg id="close" />
            </StyledClearedButton>
          </StyledFlexTopCenter>
        </StyledHeader>
        <StyledContent>
          <StyledInputWrapper>
            <GroupedSelectSearchController
              name="itemsInputType"
              options={itemsTypeOptions}
              control={control}
            />
          </StyledInputWrapper>
          <StyledInputWrapper>
            <StyledBodyMedium
              sx={{ m: theme.spacing(0.2, 0, 4, 1.4) }}
              color={variables.palette.on_surface_variant}
            >
              {selectedInputType && getInputTypeTooltip()[selectedInputType]}
            </StyledBodyMedium>
            <InputController
              fullWidth
              name="name"
              control={control}
              label={t('itemName')}
              type="text"
              sx={{ mb: theme.spacing(4) }}
            />
          </StyledInputWrapper>
          <StyledTitleLarge sx={{ mb: theme.spacing(1) }}>{t('itemBody')}</StyledTitleLarge>
          <EditorController name="body" control={control} />
          {hasOptions && (
            <StyledOptionsWrapper>
              {options?.length
                ? options.map((option, index) => (
                    <SelectionOption
                      key={option.id}
                      onRemoveOption={removeOptions}
                      onUpdateOption={updateOptions}
                      index={index}
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
          {selectedInputType === ItemInputTypes.NumberSelection && (
            <NumberSelection name="minNumber" maxName="maxNumber" />
          )}
          {selectedInputType === ItemInputTypes.Slider && (
            <SliderRows name="sliderOptions" control={control} />
          )}
          {selectedInputType === ItemInputTypes.SliderRows && (
            <SliderRows name="sliderOptions" control={control} isMultiple />
          )}
          {selectedInputType === ItemInputTypes.SingleSelectionPerRow && <SelectionRows isSingle />}
          {selectedInputType === ItemInputTypes.MultipleSelectionPerRow && <SelectionRows />}
          {selectedInputType === ItemInputTypes.Geolocation && <Geolocation />}
          {selectedInputType === ItemInputTypes.TimeRange && <TimeRange />}
          {selectedInputType === ItemInputTypes.Video && <VideoResponse />}
          {selectedInputType === ItemInputTypes.Photo && <PhotoResponse />}
          {selectedInputType === ItemInputTypes.Date && <Date />}
          {selectedInputType === ItemInputTypes.Audio && <AudioRecord name="audioDuration" />}
          {selectedInputType === ItemInputTypes.Text && (
            <TextResponse name="textResponseAnswer" maxCharacters="textResponseMaxCharacters" />
          )}
          {selectedInputType === ItemInputTypes.AudioPlayer && (
            <AudioPlayer name="mediaTranscript" fileResource="mediaFileResource" />
          )}
          {isTextInputOptionVisible && (
            <TextInputOption
              name="isTextInputOptionRequired"
              control={control}
              onRemove={handleRemoveTextInputOption}
            />
          )}
          {hasAlerts && (
            <Alerts appendAlert={appendAlert} removeAlert={removeAlert} alerts={alerts} />
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
        </StyledContent>
      </StyledItemConfiguration>
    </FormProvider>
  );
};
