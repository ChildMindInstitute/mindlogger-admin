import { useEffect, useMemo } from 'react';

import { ItemInputTypes } from 'shared/types';
import {
  AudioPlayer,
  AudioRecord,
  Date,
  Drawing,
  Geolocation,
  NumberSelection,
  PhotoResponse,
  SelectionRows,
  SliderRows,
  TextResponse,
  TimeRange,
  VideoResponse,
} from '../InputTypeItems';
import { ActiveItemHookProps, SettingsSetupProps } from './OptionalItemsAndSettings.types';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';
import { DEFAULT_TIMER_VALUE } from '../ItemConfiguration.const';
import { getEmptySelectionRows, getEmptySliderOption } from '../ItemConfiguration.utils';

export const useActiveItem = ({ selectedInputType, control }: ActiveItemHookProps) =>
  useMemo(() => {
    switch (selectedInputType) {
      case ItemInputTypes.NumberSelection:
        return <NumberSelection name="minNumber" maxName="maxNumber" />;
      case ItemInputTypes.Slider:
        return <SliderRows name="sliderOptions" control={control} />;
      case ItemInputTypes.SliderRows:
        return <SliderRows name="sliderOptions" control={control} isMultiple />;

      case ItemInputTypes.SingleSelectionPerRow:
        return <SelectionRows isSingle />;
      case ItemInputTypes.MultipleSelectionPerRow:
        return <SelectionRows />;
      case ItemInputTypes.Geolocation:
        return <Geolocation />;
      case ItemInputTypes.TimeRange:
        return <TimeRange />;
      case ItemInputTypes.Video:
        return <VideoResponse />;
      case ItemInputTypes.Photo:
        return <PhotoResponse />;
      case ItemInputTypes.Date:
        return <Date />;
      case ItemInputTypes.Audio:
        return <AudioRecord name="audioDuration" />;
      case ItemInputTypes.Text:
        return <TextResponse name="textResponseAnswer" maxCharacters="textResponseMaxCharacters" />;
      case ItemInputTypes.AudioPlayer:
        return <AudioPlayer name="mediaTranscript" fileResource="mediaFileResource" />;
      case ItemInputTypes.Drawing:
        return <Drawing drawerImage="drawerImage" drawerBgImage="drawerBgImage" />;
      default:
        null;
    }
  }, [selectedInputType]);

export const useSettingsSetup = ({
  setValue,
  getValues,
  watch,
  register,
  unregister,
  clearErrors,
  removeOptions,
  handleAddOption,
  removeAlert,
  setShowColorPalette,
}: SettingsSetupProps) => {
  const selectedInputType = watch('itemsInputType');
  const settings = watch('settings');
  const selectionRows = watch('selectionRows');

  const hasTimer = settings?.includes(ItemConfigurationSettings.HasTimer);
  const hasAlerts = settings?.includes(ItemConfigurationSettings.HasAlerts);
  const hasPalette = settings?.includes(ItemConfigurationSettings.HasColorPalette);
  const isTextInputOptionVisible = settings?.includes(ItemConfigurationSettings.HasTextInput);
  const isTextInputRequired = settings?.includes(ItemConfigurationSettings.IsTextInputRequired);
  const isSkippable = settings?.includes(ItemConfigurationSettings.IsSkippable);

  useEffect(() => {
    setValue('settings', []);
    setValue('timer', DEFAULT_TIMER_VALUE);
    removeOptions?.();

    if (
      selectedInputType === ItemInputTypes.SingleSelection ||
      selectedInputType === ItemInputTypes.MultipleSelection
    ) {
      handleAddOption?.();
    }

    if (
      selectedInputType === ItemInputTypes.Slider ||
      selectedInputType === ItemInputTypes.SliderRows
    ) {
      const isMultiple = selectedInputType === ItemInputTypes.SliderRows;
      setValue('sliderOptions', [getEmptySliderOption(isMultiple)]);
      clearErrors('sliderOptions');
    } else unregister('sliderOptions');

    if (
      selectedInputType === ItemInputTypes.SingleSelectionPerRow ||
      selectedInputType === ItemInputTypes.MultipleSelectionPerRow
    ) {
      if (selectionRows) {
        setValue('selectionRows', getEmptySelectionRows(selectedInputType));
        clearErrors('selectionRows');
      } else {
        register('selectionRows', { value: getEmptySelectionRows(selectedInputType) });
      }
    } else unregister('selectionRows');
  }, [selectedInputType]);

  useEffect(() => {
    !hasAlerts && removeAlert?.();
  }, [hasAlerts]);

  useEffect(() => {
    if (hasPalette) {
      register('paletteName', { value: '' });
    } else {
      unregister('paletteName');
      setShowColorPalette?.(false);
    }
  }, [hasPalette]);

  useEffect(() => {
    //TODO add to isSkippable: 'Reset to True IF Allow respondent to skip all Items = True AND Required = False;'
    if (isTextInputRequired && isSkippable) {
      setValue(
        'settings',
        settings?.filter(
          (settingKey: ItemConfigurationSettings) =>
            settingKey !== ItemConfigurationSettings.IsSkippable,
        ),
      );
    }

    if (isTextInputOptionVisible) {
      const initialValue = getValues()['isTextInputOptionRequired'];

      register('isTextInputOptionRequired', { value: initialValue });
    } else unregister('isTextInputOptionRequired');
  }, [settings]);

  useEffect(() => {
    if (hasTimer) {
      const initialValue = getValues()['timer'];
      if (initialValue === undefined) {
        setValue('timer', DEFAULT_TIMER_VALUE);
      }

      return;
    }

    setValue('timer', undefined);
  }, [selectedInputType, hasTimer]);
};
