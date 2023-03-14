import { Svg } from 'shared/components';

import { ItemsOptionGroup, ItemInputTypes } from './ItemConfiguration.types';

export const DEFAULT_TIMER_VALUE = 100;
export const DEFAULT_SCORE_VALUE = 0;
export const DEFAULT_MIN_NUMBER = 1;
export const DEFAULT_MAX_NUMBER = 100;
export const DEFAULT_AUDIO_DURATION_MS = 3000;

export const itemsTypeIcons = {
  [ItemInputTypes.SingleSelection]: <Svg id="radio-button-outline" />,
  [ItemInputTypes.MultipleSelection]: <Svg id="checkbox-multiple-filled" />,
  [ItemInputTypes.Slider]: <Svg id="slider-outline" />,
  [ItemInputTypes.Date]: <Svg id="calendar" />,
  [ItemInputTypes.NumberSelection]: <Svg id="number-selection" />,
  [ItemInputTypes.TimeRange]: <Svg id="clock" />,
  [ItemInputTypes.SingleSelectionPerRow]: <Svg id="single-selection-per-row" />,
  [ItemInputTypes.MultipleSelectionPerRow]: <Svg id="multiple-selection-per-row" />,
  [ItemInputTypes.SliderRows]: <Svg id="slider-rows" />,
  [ItemInputTypes.Text]: <Svg id="text" />,
  [ItemInputTypes.Drawing]: <Svg id="drawing" />,
  [ItemInputTypes.Photo]: <Svg id="photo" />,
  [ItemInputTypes.Video]: <Svg id="video" />,
  [ItemInputTypes.Geolocation]: <Svg id="geolocation" />,
  [ItemInputTypes.Audio]: <Svg id="audio" />,
  [ItemInputTypes.Message]: <Svg id="quote" />,
  [ItemInputTypes.AudioPlayer]: <Svg id="audio-player" />,
};

export const itemsTypeOptions: ItemsOptionGroup[] = [
  {
    groupName: 'select',
    groupOptions: [
      {
        value: ItemInputTypes.SingleSelection,
        icon: itemsTypeIcons[ItemInputTypes.SingleSelection],
      },
      {
        value: ItemInputTypes.MultipleSelection,
        icon: itemsTypeIcons[ItemInputTypes.MultipleSelection],
      },
      { value: ItemInputTypes.Slider, icon: itemsTypeIcons[ItemInputTypes.Slider] },
      { value: ItemInputTypes.Date, icon: itemsTypeIcons[ItemInputTypes.Date] },
      {
        value: ItemInputTypes.NumberSelection,
        icon: itemsTypeIcons[ItemInputTypes.NumberSelection],
      },
      { value: ItemInputTypes.TimeRange, icon: itemsTypeIcons[ItemInputTypes.TimeRange] },
    ],
  },
  {
    groupName: 'matrixSelect',
    groupOptions: [
      {
        value: ItemInputTypes.SingleSelectionPerRow,
        icon: itemsTypeIcons[ItemInputTypes.SingleSelectionPerRow],
      },
      {
        value: ItemInputTypes.MultipleSelectionPerRow,
        icon: itemsTypeIcons[ItemInputTypes.MultipleSelectionPerRow],
      },
      { value: ItemInputTypes.SliderRows, icon: itemsTypeIcons[ItemInputTypes.SliderRows] },
    ],
  },
  {
    groupName: 'input',
    groupOptions: [
      { value: ItemInputTypes.Text, icon: itemsTypeIcons[ItemInputTypes.Text] },
      { value: ItemInputTypes.Drawing, icon: itemsTypeIcons[ItemInputTypes.Drawing] },
      { value: ItemInputTypes.Photo, icon: itemsTypeIcons[ItemInputTypes.Photo] },
      { value: ItemInputTypes.Video, icon: itemsTypeIcons[ItemInputTypes.Video] },
    ],
  },
  {
    groupName: 'record',
    groupOptions: [
      { value: ItemInputTypes.Geolocation, icon: itemsTypeIcons[ItemInputTypes.Geolocation] },
      { value: ItemInputTypes.Audio, icon: itemsTypeIcons[ItemInputTypes.Audio] },
    ],
  },
  {
    groupName: 'display',
    groupOptions: [
      { value: ItemInputTypes.Message, icon: itemsTypeIcons[ItemInputTypes.Message] },
      { value: ItemInputTypes.AudioPlayer, icon: itemsTypeIcons[ItemInputTypes.AudioPlayer] },
    ],
  },
];
