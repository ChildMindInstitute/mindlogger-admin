import { Svg } from 'shared/components';
import { ItemResponseType } from 'shared/consts';

export const ItemResponseTypes = {
  [ItemResponseType.SingleSelection]: {
    icon: <Svg id="radio-button-outline" />,
    title: ItemResponseType.SingleSelection,
  },
  [ItemResponseType.MultipleSelection]: {
    icon: <Svg id="checkbox-filled" />,
    title: ItemResponseType.MultipleSelection,
  },
  [ItemResponseType.Slider]: {
    icon: <Svg id="slider-outline" />,
    title: ItemResponseType.Slider,
  },
  [ItemResponseType.Date]: {
    icon: <Svg id="calendar" />,
    title: ItemResponseType.Date,
  },
  [ItemResponseType.NumberSelection]: {
    icon: <Svg id="number-selection" />,
    title: ItemResponseType.NumberSelection,
  },
  [ItemResponseType.TimeRange]: {
    icon: <Svg id="clock" />,
    title: ItemResponseType.TimeRange,
  },
  [ItemResponseType.SingleSelectionPerRow]: {
    icon: <Svg id="single-selection-per-row" />,
    title: ItemResponseType.SingleSelectionPerRow,
  },
  [ItemResponseType.MultipleSelectionPerRow]: {
    icon: <Svg id="multiple-selection-per-row" />,
    title: ItemResponseType.MultipleSelectionPerRow,
  },
  [ItemResponseType.SliderRows]: {
    icon: <Svg id="slider-rows" />,
    title: ItemResponseType.SliderRows,
  },
  [ItemResponseType.Text]: { icon: <Svg id="text" />, title: ItemResponseType.Text },
  [ItemResponseType.Drawing]: { icon: <Svg id="drawing" />, title: ItemResponseType.Drawing },
  [ItemResponseType.Photo]: { icon: <Svg id="photo" />, title: ItemResponseType.Photo },
  [ItemResponseType.Video]: { icon: <Svg id="video" />, title: ItemResponseType.Video },
  [ItemResponseType.Geolocation]: {
    icon: <Svg id="geolocation" />,
    title: ItemResponseType.Geolocation,
  },
  [ItemResponseType.Audio]: { icon: <Svg id="audio" />, title: ItemResponseType.Audio },
  [ItemResponseType.Message]: { icon: <Svg id="quote" />, title: ItemResponseType.Message },
  [ItemResponseType.AudioPlayer]: {
    icon: <Svg id="audio-player" />,
    title: ItemResponseType.AudioPlayer,
  },
  [ItemResponseType.Flanker]: { icon: null, title: ItemResponseType.Flanker },
  [ItemResponseType.ABTrailsIpad]: { icon: null, title: ItemResponseType.ABTrailsIpad },
  [ItemResponseType.ABTrailsMobile]: { icon: null, title: ItemResponseType.ABTrailsMobile },
  [ItemResponseType.Gyroscope]: { icon: null, title: ItemResponseType.Gyroscope },
  [ItemResponseType.Touch]: { icon: null, title: ItemResponseType.Touch },
  [ItemResponseType.Time]: { icon: <Svg id="clock-picker" />, title: ItemResponseType.Time },
};
