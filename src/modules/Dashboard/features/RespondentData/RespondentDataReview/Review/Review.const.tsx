import { ItemInputTypes } from 'shared/types';

import { MultiSelectResponseItem } from './MultiSelectResponseItem';
import { SingleSelectResponseItem } from './SingleSelectResponseItem';
import { SliderResponseItem } from './SliderResponseItem';
import { TextResponseItem } from './TextResponseItem';

const responseItems = {
  [ItemInputTypes.SingleSelection]: SingleSelectResponseItem,
  [ItemInputTypes.MultipleSelection]: MultiSelectResponseItem,
  [ItemInputTypes.Slider]: SliderResponseItem,
  [ItemInputTypes.Text]: TextResponseItem,
};
