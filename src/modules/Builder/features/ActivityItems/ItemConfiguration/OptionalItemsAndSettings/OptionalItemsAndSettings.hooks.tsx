import { useMemo } from 'react';

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
import { ActiveItemHookProps } from './OptionalItemsAndSettings.types';

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
