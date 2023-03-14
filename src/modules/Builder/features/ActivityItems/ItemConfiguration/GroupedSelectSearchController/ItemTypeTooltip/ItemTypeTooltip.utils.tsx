import { ItemInputTypes } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

import {
  Dashed,
  DashedUiType,
  Date,
  NumberSelection,
  Selection,
  SelectionUiType,
  Slider,
  SliderRows,
  TimeRange,
  SelectionPerRow,
} from './TooltipComponents';

const singleUiType = SelectionUiType.Single;
const multipleUiType = SelectionUiType.Multiple;

export const getInputTypeContent = () => ({
  [ItemInputTypes.SingleSelection]: <Selection uiType={singleUiType} />,
  [ItemInputTypes.MultipleSelection]: <Selection uiType={multipleUiType} />,
  [ItemInputTypes.Slider]: <Slider />,
  [ItemInputTypes.Date]: <Date />,
  [ItemInputTypes.NumberSelection]: <NumberSelection />,
  [ItemInputTypes.TimeRange]: <TimeRange />,
  [ItemInputTypes.SingleSelectionPerRow]: <SelectionPerRow uiType={singleUiType} />,
  [ItemInputTypes.MultipleSelectionPerRow]: <SelectionPerRow uiType={multipleUiType} />,
  [ItemInputTypes.SliderRows]: <SliderRows />,
  [ItemInputTypes.Text]: <Dashed uiType={DashedUiType.Text} />,
  [ItemInputTypes.Drawing]: <Dashed uiType={DashedUiType.Drawing} />,
  [ItemInputTypes.Photo]: <Dashed uiType={DashedUiType.Photo} />,
  [ItemInputTypes.Video]: <Dashed uiType={DashedUiType.Video} />,
  [ItemInputTypes.Geolocation]: <Dashed uiType={DashedUiType.Geolocation} />,
  [ItemInputTypes.Audio]: <Dashed uiType={DashedUiType.Audio} />,
  [ItemInputTypes.Message]: <Dashed uiType={DashedUiType.Message} />,
  [ItemInputTypes.AudioPlayer]: <Dashed uiType={DashedUiType.AudioPlayer} />,
});
