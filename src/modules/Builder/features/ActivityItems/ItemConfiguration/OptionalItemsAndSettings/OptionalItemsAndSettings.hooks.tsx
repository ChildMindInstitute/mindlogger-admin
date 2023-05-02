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
  PhotoResponse,
  SelectionRows,
  TimeRange,
  VideoResponse,
} from '../InputTypeItems';
import { ActiveItemHookProps, SettingsSetupProps } from './OptionalItemsAndSettings.types';
import { ItemConfigurationSettings } from '../ItemConfiguration.types';
import {
  defaultTextConfig,
  defaultSliderConfig,
  defaultSliderRowsConfig,
  defaultSingleAndMultiSelectionConfig,
  defaultNumberSelectionConfig,
  defaultDateAndTimeRangeConfig,
  defaultDrawingConfig,
  defaultPhotoConfig,
  defaultGeolocationConfig,
  defaultMessageConfig,
} from './OptionalItemsAndSettings.const';
import { getEmptySliderOption, getEmptyNumberSelection } from '../ItemConfiguration.utils';

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
        return <TextResponse name={name} />;
      case ItemResponseType.Drawing:
        return <Drawing name={name} />;
      case ItemResponseType.AudioPlayer:
        return <AudioPlayer name="mediaTranscript" fileResource="mediaFileResource" />;
      default:
        null;
    }
  }, [responseType]);

  return activeItem;
};

export const useSettingsSetup = ({
  name,
  handleAddOption,
  removeRows,
  handleAddRow,
  removeAlert,
  handleAddAlert,
  setShowColorPalette,
}: SettingsSetupProps) => {
  const { setValue, getValues, watch, clearErrors } = useFormContext();

  const settings = watch(`${name}.config`);

  const hasAlerts = get(settings, ItemConfigurationSettings.HasAlerts);
  const hasPalette = get(settings, ItemConfigurationSettings.HasColorPalette);
  const isTextInputRequired = get(settings, ItemConfigurationSettings.IsTextInputRequired);
  const isSkippable = get(settings, ItemConfigurationSettings.IsSkippable);

  const setConfig = (config: Config) => setValue(`${name}.config`, config);

  useEffect(() => {
    const subscription = watch((_, { name: fieldName, type }) => {
      if (fieldName === `${name}.responseType` && type === 'change') {
        setValue(`${name}.responseValues`, {});
        clearErrors(`${name}.responseValues`);

        const responseType = getValues(`${name}.responseType`);

        switch (responseType) {
          case ItemResponseType.SingleSelection:
          case ItemResponseType.MultipleSelection:
            handleAddOption?.();
            setConfig(defaultSingleAndMultiSelectionConfig);
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
            handleAddRow?.();
            setConfig(defaultSliderRowsConfig);
            break;
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hasAlerts) {
      return removeAlert?.();
    }
    handleAddAlert?.();
  }, [hasAlerts]);

  useEffect(() => {
    if (!hasPalette) setShowColorPalette?.(false);
  }, [hasPalette]);

  useEffect(() => {
    //TODO add to isSkippable: 'Reset to True IF Allow respondent to skip all Items = True AND Required = False;'
    if (isTextInputRequired && isSkippable) {
      setValue(`${name}.config`, {
        ...settings,
        [ItemConfigurationSettings.IsSkippable]: false,
      });
    }
  }, [settings]);
};
