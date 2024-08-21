import { ItemResponseType } from 'shared/consts';

import {
  Dashed,
  DashedUiType,
  Date,
  NumberSelection,
  Selection,
  SelectionUiType,
  Slider,
  SliderRows,
  Time,
  TimeRange,
  SelectionPerRow,
  PhrasalTemplate,
} from './TooltipComponents';

const singleUiType = SelectionUiType.Single;
const multipleUiType = SelectionUiType.Multiple;

export const getInputTypeContent = () => ({
  [ItemResponseType.SingleSelection]: <Selection uiType={singleUiType} />,
  [ItemResponseType.MultipleSelection]: <Selection uiType={multipleUiType} />,
  [ItemResponseType.Slider]: <Slider />,
  [ItemResponseType.Date]: <Date />,
  [ItemResponseType.NumberSelection]: <NumberSelection />,
  [ItemResponseType.TimeRange]: <TimeRange />,
  [ItemResponseType.SingleSelectionPerRow]: <SelectionPerRow uiType={singleUiType} />,
  [ItemResponseType.MultipleSelectionPerRow]: <SelectionPerRow uiType={multipleUiType} />,
  [ItemResponseType.SliderRows]: <SliderRows />,
  [ItemResponseType.Text]: <Dashed uiType={DashedUiType.Text} />,
  [ItemResponseType.ParagraphText]: <Dashed uiType={DashedUiType.ParagraphText} />,
  [ItemResponseType.Drawing]: <Dashed uiType={DashedUiType.Drawing} />,
  [ItemResponseType.Photo]: <Dashed uiType={DashedUiType.Photo} />,
  [ItemResponseType.Video]: <Dashed uiType={DashedUiType.Video} />,
  [ItemResponseType.Geolocation]: <Dashed uiType={DashedUiType.Geolocation} />,
  [ItemResponseType.Audio]: <Dashed uiType={DashedUiType.Audio} />,
  [ItemResponseType.Message]: <Dashed uiType={DashedUiType.Message} />,
  [ItemResponseType.AudioPlayer]: <Dashed uiType={DashedUiType.AudioPlayer} />,
  [ItemResponseType.Time]: <Time />,
  [ItemResponseType.PhrasalTemplate]: <PhrasalTemplate />,
});
