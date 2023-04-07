import { useEffect, useMemo } from 'react';

import { ItemResponseType } from 'shared/consts';
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
      case ItemResponseType.NumberSelection:
        return <NumberSelection name="minNumber" maxName="maxNumber" />;
      case ItemResponseType.Slider:
        return <SliderRows name="sliderOptions" control={control} />;
      case ItemResponseType.SliderRows:
        return <SliderRows name="sliderOptions" control={control} isMultiple />;

      case ItemResponseType.SingleSelectionPerRow:
        return <SelectionRows isSingle />;
      case ItemResponseType.MultipleSelectionPerRow:
        return <SelectionRows />;
      case ItemResponseType.Geolocation:
        return <Geolocation />;
      case ItemResponseType.TimeRange:
        return <TimeRange />;
      case ItemResponseType.Video:
        return <VideoResponse />;
      case ItemResponseType.Photo:
        return <PhotoResponse />;
      case ItemResponseType.Date:
        return <Date />;
      case ItemResponseType.Audio:
        return <AudioRecord name="audioDuration" />;
      case ItemResponseType.Text:
        return <TextResponse name="textResponseAnswer" maxCharacters="textResponseMaxCharacters" />;
      case ItemResponseType.AudioPlayer:
        return <AudioPlayer name="mediaTranscript" fileResource="mediaFileResource" />;
      case ItemResponseType.Drawing:
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
  handleAddAlert,
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
      selectedInputType === ItemResponseType.SingleSelection ||
      selectedInputType === ItemResponseType.MultipleSelection
    ) {
      handleAddOption?.();
    }

    if (
      selectedInputType === ItemResponseType.Slider ||
      selectedInputType === ItemResponseType.SliderRows
    ) {
      const isMultiple = selectedInputType === ItemResponseType.SliderRows;
      setValue('sliderOptions', [getEmptySliderOption(isMultiple)]);
      clearErrors('sliderOptions');
    } else unregister('sliderOptions');

    if (
      selectedInputType === ItemResponseType.SingleSelectionPerRow ||
      selectedInputType === ItemResponseType.MultipleSelectionPerRow
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
    if (!hasAlerts) {
      return removeAlert?.();
    }
    handleAddAlert?.();
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
