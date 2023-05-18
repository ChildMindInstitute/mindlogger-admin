import { Item } from 'shared/state';
import {
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state/Applet/Applet.schema';

import { ItemAnswer, ResponseOption, Version } from '../Report.types';

// TODO: add SliderItemResponseValues
export type MultiScatterResponseValues = SingleAndMultipleSelectItemResponseValues;

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
