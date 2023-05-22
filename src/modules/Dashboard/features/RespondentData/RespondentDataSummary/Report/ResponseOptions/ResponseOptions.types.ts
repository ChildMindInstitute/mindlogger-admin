import { Item } from 'shared/state';
import {
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state/Applet/Applet.schema';

import { ItemAnswer, ResponseOption, Version } from '../Report.types';

export type MultiScatterResponseValues =
  | SingleAndMultipleSelectItemResponseValues
  | SliderItemResponseValues;

export type ResponseOptionsProps = {
  responseOptions: ResponseOption[];
  versions: Version[];
};

export type GetResponseOptionsProps = {
  minDate: Date;
  maxDate: Date;
  activityItem: Item;
  answers?: ItemAnswer[];
  versions: Version[];
};
