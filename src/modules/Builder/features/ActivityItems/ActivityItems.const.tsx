import { Svg } from 'shared/components';
import { ItemInputTypes } from 'shared/types';

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
  [ItemInputTypes.Flanker]: null,
  [ItemInputTypes.AbTest]: null,
};
