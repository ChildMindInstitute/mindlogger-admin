import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Button, Grid } from '@mui/material';
import { ColorResult } from 'react-color';
import { yupResolver } from '@hookform/resolvers/yup';

import { Svg } from 'shared/components';
import { EditorController, InputController } from 'shared/components/FormComponents';
import {
  StyledBodyMedium,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledFlexTopStart,
  StyledHeadlineLarge,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import { useHeaderSticky } from 'shared/hooks';
import { ItemInputTypes } from 'shared/types';

import { GroupedSelectSearchController } from './GroupedSelectSearchController';
import { Alerts } from './Alerts';
import {
  ItemSettingsController,
  ItemSettingsDrawer,
  ColorPalette,
  TextInputOption,
} from './Settings';
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
  Drawing,
} from './InputTypeItems';
import {
  StyledContent,
  StyledHeader,
  StyledItemConfiguration,
  StyledOptionsWrapper,
} from './ItemConfiguration.styles';
import { ItemConfigurationForm, ItemConfigurationSettings } from './ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE, itemsTypeOptions } from './ItemConfiguration.const';
import { useSettingsSetup } from './ItemConfiguration.hooks';
import { getInputTypeTooltip, getPaletteColor } from './ItemConfiguration.utils';
import { itemConfigurationFormSchema } from './ItemConfiguration.schema';

export const ItemConfiguration = () => {
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [showColorPalette, setShowColorPalette] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const isHeaderSticky = useHeaderSticky(containerRef);
  const { t } = useTranslation('app');

  const methods = useForm<ItemConfigurationForm>({
    resolver: yupResolver(itemConfigurationFormSchema()),
    defaultValues: {
      itemsInputType: '',
      name: '',
      body: '',
      settings: [],
    },
    mode: 'onChange',
  });

  const { control, watch, setValue, getValues, register, unregister } = methods;

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
  const palette = watch('paletteName');

  const hasOptions =
    selectedInputType === ItemInputTypes.SingleSelection ||
    selectedInputType === ItemInputTypes.MultipleSelection;

  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
  const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);
  const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);
  const hasColorPalette = settings?.includes(ItemConfigurationSettings.HasColorPalette);

  const handleAddOption = () =>
    appendOption({
      text: '',
      isVisible: true,
      ...(hasScores && { score: DEFAULT_SCORE_VALUE }),
      ...(hasColorPalette &&
        palette && { color: { hex: getPaletteColor(palette, options.length) } as ColorResult }),
    });

  const handleRemoveTextInputOption = () => {
    setValue(
      'settings',
      settings?.filter(
        (settingKey: ItemConfigurationSettings) =>
          settingKey !== ItemConfigurationSettings.HasTextInput &&
          settingKey !== ItemConfigurationSettings.IsTextInputRequired,
      ),
    );
  };

  useSettingsSetup({
    setValue,
    getValues,
    watch,
    register,
    unregister,
    removeOptions,
    handleAddOption,
    removeAlert,
    setShowColorPalette,
  });

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
          <Grid container direction="row" columns={2} spacing={2.4}>
            <Grid item xs={1}>
              <GroupedSelectSearchController
                name="itemsInputType"
                options={itemsTypeOptions}
                control={control}
              />
              <StyledBodyMedium
                sx={{ m: theme.spacing(0.2, 1.6, 4.8, 1.6) }}
                color={variables.palette.on_surface_variant}
              >
                {selectedInputType && getInputTypeTooltip()[selectedInputType]}
              </StyledBodyMedium>
            </Grid>
            <Grid item xs={1}>
              <InputController
                fullWidth
                name="name"
                control={control}
                label={t('itemName')}
                type="text"
                sx={{ mb: theme.spacing(4) }}
              />
            </Grid>
          </Grid>
          <StyledTitleLarge sx={{ mb: theme.spacing(2.4) }}>
            {t('displayedContent')}
          </StyledTitleLarge>
          <EditorController name="body" control={control} />
          {hasOptions && (
            <>
              <StyledFlexTopCenter
                sx={{ m: theme.spacing(4.8, 0, 2.4), justifyContent: 'space-between' }}
              >
                <StyledTitleLarge>{t('responseOptions')}</StyledTitleLarge>
                {hasColorPalette && !showColorPalette && (
                  <Button
                    onClick={() => setShowColorPalette(true)}
                    variant="outlined"
                    startIcon={<Svg id="paint-outline" width="20" height="20" />}
                  >
                    {t('setPalette')}
                  </Button>
                )}
              </StyledFlexTopCenter>
              {hasColorPalette && showColorPalette && (
                <ColorPalette setShowColorPalette={setShowColorPalette} />
              )}
              <StyledOptionsWrapper>
                {options?.length
                  ? options.map((option, index) => (
                      <SelectionOption
                        key={option.id}
                        onRemoveOption={removeOptions}
                        onUpdateOption={updateOptions}
                        optionsLength={options.length}
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
            </>
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
          {selectedInputType === ItemInputTypes.Drawing && (
            <Drawing drawerImage="drawerImage" drawerBgImage="drawerBgImage" />
          )}
          {isTextInputOptionVisible && <TextInputOption onRemove={handleRemoveTextInputOption} />}
          {hasAlerts && (
            <Alerts appendAlert={appendAlert} removeAlert={removeAlert} alerts={alerts} />
          )}
          {settingsDrawerVisible && (
            <ItemSettingsDrawer
              open={settingsDrawerVisible}
              onClose={() => setSettingsDrawerVisible(false)}
            >
              <ItemSettingsController
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
