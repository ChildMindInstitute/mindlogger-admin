import { ItemResponseType } from 'shared/consts';

import { MultiSelectResponseItem } from '../MultiSelectResponseItem';
import { SingleSelectResponseItem } from '../SingleSelectResponseItem';
import { SliderResponseItem } from '../SliderResponseItem';
import { TextResponseItem } from '../TextResponseItem';

const responseItems = {
  [ItemResponseType.SingleSelection]: SingleSelectResponseItem,
  [ItemResponseType.MultipleSelection]: MultiSelectResponseItem,
  [ItemResponseType.Slider]: SliderResponseItem,
  [ItemResponseType.Text]: TextResponseItem,
};
