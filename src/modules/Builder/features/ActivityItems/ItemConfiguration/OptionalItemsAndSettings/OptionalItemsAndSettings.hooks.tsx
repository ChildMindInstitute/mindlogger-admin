import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { ItemResponseType } from 'shared/consts';
import { Config } from 'shared/state';

import {
  TextResponse,
  SliderRows,
  AudioPlayer,
  AudioRecord,
  Date,
  Drawing,
  Geolocation,
  NumberSelection,
  VideoResponse,
  PhotoResponse,
  SelectionRows,
  Time,
} from '../InputTypeItems';
import { ActiveItemHookProps, SettingsSetupProps } from './OptionalItemsAndSettings.types';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';
import {
  defaultTextConfig,
  defaultSliderConfig,
  defaultSliderRowsConfig,
  defaultAudioAndVideoConfig,
  defaultAudioPlayerConfig,
  defaultSingleAndMultiSelectionRowsConfig,
  defaultNumberSelectionConfig,
  defaultDateAndTimeRangeConfig,
  defaultDrawingConfig,
  defaultTimeConfig,
  defaultPhotoConfig,
  defaultGeolocationConfig,
  defaultMessageConfig,
  defaultSingleSelectionConfig,
  defaultMultiSelectionConfig,
} from './OptionalItemsAndSettings.const';
import {
  getEmptySliderOption,
  getEmptyAudioPlayerResponse,
  getEmptyAudioResponse,
  getEmptyNumberSelection,
  checkIfItemHasRequiredOptions,
} from '../ItemConfiguration.utils';

export const useActiveItem = ({ name, responseType }: ActiveItemHookProps) => {
  const activeItem = useMemo(() => {
    switch (responseType) {
      case ItemResponseType.NumberSelection:
        return <NumberSelection name={name} />;
      case ItemResponseType.Slider:
        return <SliderRows name={name} />;
      case ItemResponseType.SliderRows:
        return <SliderRows name={name} isMultiple />;
      case ItemResponseType.SingleSelectionPerRow:
        return <SelectionRows name={name} isSingle />;
      case ItemResponseType.MultipleSelectionPerRow:
        return <SelectionRows name={name} />;
      case ItemResponseType.Geolocation:
        return <Geolocation />;
      case ItemResponseType.TimeRange:
        return <Time isRange />;
      case ItemResponseType.Time:
        return <Time />;
      case ItemResponseType.Video:
        return <VideoResponse />;
      case ItemResponseType.Photo:
        return <PhotoResponse />;
      case ItemResponseType.Date:
        return <Date />;
      case ItemResponseType.Audio:
        return <AudioRecord name={name} />;
      case ItemResponseType.Text:
        return <TextResponse name={name} />;
      case ItemResponseType.Drawing:
        return <Drawing name={name} />;
      case ItemResponseType.AudioPlayer:
        return <AudioPlayer name={name} />;
      default:
        return null;
    }
  }, [responseType]);

  return activeItem;
};

export const useSettingsSetup = ({
  name,
  handleAddOption,
  removeOptions,
  handleAddSliderRow,
  handleAddSingleOrMultipleRow,
}: SettingsSetupProps) => {
  const { setValue, getValues, watch, clearErrors } = useFormContext();

  const settings = watch(`${name}.config`);

  const isSkippable = get(settings, ItemConfigurationSettings.IsSkippable);
  const hasRequiredItems = checkIfItemHasRequiredOptions(settings);

  const setConfig = (config: Config) => setValue(`${name}.config`, config);

  useEffect(() => {
    const subscription = watch((_, { name: fieldName, type }) => {
      if (fieldName === `${name}.responseType` && type === 'change') {
        setValue(`${name}.responseValues`, {});
        clearErrors(`${name}.responseValues`);

        const responseType = getValues(`${name}.responseType`);

        const isSingleSelect = responseType === ItemResponseType.SingleSelection;

        switch (responseType) {
          case ItemResponseType.SingleSelection:
          case ItemResponseType.MultipleSelection:
            removeOptions?.();
            setConfig(isSingleSelect ? defaultSingleSelectionConfig : defaultMultiSelectionConfig);
            handleAddOption?.({ isAppendedOption: false });
            break;
          case ItemResponseType.Text:
            setConfig(defaultTextConfig);
            break;
          case ItemResponseType.Slider:
            setConfig(defaultSliderConfig);
            setValue(
              `${name}.responseValues`,
              getEmptySliderOption({ isMultiple: false, hasScores: false }),
            );
            break;
          case ItemResponseType.NumberSelection:
            setConfig(defaultNumberSelectionConfig);
            setValue(`${name}.responseValues`, getEmptyNumberSelection());
            break;
          case ItemResponseType.Date:
          case ItemResponseType.TimeRange:
            setConfig(defaultDateAndTimeRangeConfig);
            break;
          case ItemResponseType.Drawing:
            setConfig(defaultDrawingConfig);
            break;
          case ItemResponseType.Photo:
            setConfig(defaultPhotoConfig);
            break;
          case ItemResponseType.Geolocation:
            setConfig(defaultGeolocationConfig);
            break;
          case ItemResponseType.Message:
            setConfig(defaultMessageConfig);
            break;
          case ItemResponseType.SliderRows:
            handleAddSliderRow?.();
            setConfig(defaultSliderRowsConfig);
            break;
          case ItemResponseType.Time:
            setConfig(defaultTimeConfig);
            break;
          case ItemResponseType.Audio:
            setConfig(defaultAudioAndVideoConfig);
            setValue(`${name}.responseValues`, getEmptyAudioResponse());
            break;
          case ItemResponseType.Video:
            setConfig(defaultAudioAndVideoConfig);
            break;
          case ItemResponseType.AudioPlayer:
            setConfig(defaultAudioPlayerConfig);
            setValue(`${name}.responseValues`, getEmptyAudioPlayerResponse());
            break;
          case ItemResponseType.SingleSelectionPerRow:
          case ItemResponseType.MultipleSelectionPerRow:
            handleAddSingleOrMultipleRow?.();
            setConfig(defaultSingleAndMultiSelectionRowsConfig);
            break;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (hasRequiredItems && isSkippable) {
      setValue(`${name}.config`, {
        ...settings,
        [ItemConfigurationSettings.IsSkippable]: false,
      });
    }
  }, [settings]);
};
