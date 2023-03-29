import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { ColorResult } from 'react-color';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ItemInputTypes } from 'shared/types';
import { StyledFlexTopCenter, StyledTitleLarge, theme } from 'shared/styles';
import { Svg } from 'shared/components';

import { ItemConfigurationSettings } from '../ItemConfiguration.types';
import { DEFAULT_SCORE_VALUE } from '../ItemConfiguration.const';
import { getPaletteColor } from '../ItemConfiguration.utils';
import {
  ColorPalette,
  ItemSettingsController,
  ItemSettingsDrawer,
  TextInputOption,
} from '../Settings';
import { Alerts } from '../Alerts';
import {
  AudioPlayer,
  AudioRecord,
  Date,
  Drawing,
  Geolocation,
  NumberSelection,
  PhotoResponse,
  SelectionOption,
  SelectionRows,
  SliderRows,
  TextResponse,
  TimeRange,
  VideoResponse,
} from '../InputTypeItems';
import { OptionalItemsProps, OptionalItemsRef } from './OptionalItemsAndSettings.types';
import { StyledOptionsWrapper } from './OptionalItemsAndSettings.styles';

export const OptionalItemsAndSettings = forwardRef<OptionalItemsRef, OptionalItemsProps>(
  ({ setValue, control, selectedInputType, settings, palette }, ref) => {
    const { t } = useTranslation('app');
    const [showColorPalette, setShowColorPalette] = useState(false);
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);

    const {
      fields: alerts,
      append: appendAlert,
      remove: removeAlert,
    } = useFieldArray({
      control,
      name: 'alerts',
    });
    const {
      fields: options,
      append: appendOption,
      remove: removeOptions,
      update: updateOptions,
    } = useFieldArray({
      control,
      name: 'options',
    });

    const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);
    const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
    const hasOptions =
      selectedInputType === ItemInputTypes.SingleSelection ||
      selectedInputType === ItemInputTypes.MultipleSelection;
    const hasScores = settings?.includes(ItemConfigurationSettings.HasScores);
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

    useImperativeHandle(
      ref,
      () => ({
        removeAlert,
        removeOptions,
        handleAddOption,
        setSettingsDrawerVisible,
        setShowColorPalette,
      }),
      [],
    );

    return (
      <>
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
      </>
    );
  },
);
