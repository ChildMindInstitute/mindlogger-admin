import { Svg } from 'shared/components';
import { ItemInputTypes } from 'shared/types';

export const ItemInputTypess = {
  [ItemInputTypes.SingleSelection]: {
    icon: <Svg id="radio-button-outline" />,
    title: ItemInputTypes.SingleSelection,
  },
  [ItemInputTypes.MultipleSelection]: {
    icon: <Svg id="checkbox-multiple-filled" />,
    title: ItemInputTypes.MultipleSelection,
  },
  [ItemInputTypes.Slider]: {
    icon: <Svg id="slider-outline" />,
    title: ItemInputTypes.Slider,
  },
  [ItemInputTypes.Date]: {
    icon: <Svg id="calendar" />,
    title: ItemInputTypes.Date,
  },
  [ItemInputTypes.NumberSelection]: {
    icon: <Svg id="number-selection" />,
    title: ItemInputTypes.NumberSelection,
  },
  [ItemInputTypes.TimeRange]: {
    icon: <Svg id="clock" />,
    title: ItemInputTypes.TimeRange,
  },
  [ItemInputTypes.SingleSelectionPerRow]: {
    icon: <Svg id="single-selection-per-row" />,
    title: ItemInputTypes.SingleSelectionPerRow,
  },
  [ItemInputTypes.MultipleSelectionPerRow]: {
    icon: <Svg id="multiple-selection-per-row" />,
    title: ItemInputTypes.MultipleSelectionPerRow,
  },
  [ItemInputTypes.SliderRows]: {
    icon: <Svg id="slider-rows" />,
    title: ItemInputTypes.SliderRows,
  },
  [ItemInputTypes.Text]: { icon: <Svg id="text" />, title: ItemInputTypes.Text },
  [ItemInputTypes.Drawing]: { icon: <Svg id="drawing" />, title: ItemInputTypes.Drawing },
  [ItemInputTypes.Photo]: { icon: <Svg id="photo" />, title: ItemInputTypes.Photo },
  [ItemInputTypes.Video]: { icon: <Svg id="video" />, title: ItemInputTypes.Video },
  [ItemInputTypes.Geolocation]: {
    icon: <Svg id="geolocation" />,
    title: ItemInputTypes.Geolocation,
  },
  [ItemInputTypes.Audio]: { icon: <Svg id="audio" />, title: ItemInputTypes.Audio },
  [ItemInputTypes.Message]: { icon: <Svg id="quote" />, title: ItemInputTypes.Message },
  [ItemInputTypes.AudioPlayer]: {
    icon: <Svg id="audio-player" />,
    title: ItemInputTypes.AudioPlayer,
  },
};
